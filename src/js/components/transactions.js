import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps, defaultErrorProps } from "../libs/swal2props.js";
import { calculateTimeDifference, sleep } from "../libs/sleep.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

const IDR = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
});

export default function () {
	const db_path = "./src/php/transactions.php?m=";

	const form = document.querySelector("#main-form");

	const PAYMENT_METHODS = ["Tunai", "Transfer"];
	const PAYMENT_STATUS_CASH = ["Belum dibayar", "Sudah dibayar"];
	const PAYMENT_STATUS_TRANSFER = ["Pending", "Settlement"];

	const is_wait = {
		add: false,
		edit: false,
		remove: false,
		search: false,
		syncTransactionStatus: false,
		remakeTransaction: false,
	};

	let payment_methods = [];
	let payment_statuses = [];

	return {
		transactions: [],
		form: {
			id: null,
			total: null,
			date: null,
			payment_method: null,
			payment_status: null,

			prev_payment_method: null,
			prev_payment_status: null,
		},
		page: new Pagination(),
		formSearch: {
			payment_methods: [],
			payment_statuses: [],
			date_start: null,
			date_end: null,
			sort_desc: true,
			is_req_by_user: false,
		},
		inputPage: null,
		PAYMENT_METHODS,
		PAYMENT_STATUS_CASH,
		isOpenModal: false,
		detail: {},
		isOpenDetailModal: false,
		paymentMethods: {},
		isOpenStructModal: false,
		whilePrint: false,
		struk: {},

		get isWaitSearch() {
			return is_wait.search;
		},

		setDateToNow() {
			const _date = new Date().toISOString().split("T")[0];

			this.formSearch.date_start = _date;
			this.formSearch.date_end = _date;
		},

		async init() {
			fillFormsByUrlParam(
				{
					array: ["payment_methods", "payment_statuses"],
					string: ["date_start", "date_end"],
					boolean: ["sort_desc", "is_req_by_user"],
					int: "page",
				},
				this.formSearch,
				url_param
			);

			// set date to now if no search/url
			if (!this.formSearch.date_start && !this.formSearch.date_end) {
				this.setDateToNow();
			} else {
				if (this.formSearch.date_start == "NULL") this.formSearch.date_start = null;
				if (this.formSearch.date_end == "NULL") this.formSearch.date_end = null;
			}

			// init watch date range
			window.addEventListener("date-range-change", ({ detail }) => {
				const { startDate, endDate } = detail;

				const _start = startDate ? startDate.toISOString() : startDate;
				const _end = endDate ? endDate.toISOString() : endDate;

				this.formSearch.date_start = _start;
				this.formSearch.date_end = _end;
			});

			encodeFetchedJson(await (await fetch(db_path + "get-payment-methods")).text(), "fetch-get-payment-methods", ({ payment_methods: pm } = {}) => {
				this.paymentMethods = pm;

				payment_methods = Object.keys(pm);
				payment_statuses = payment_methods.map((prop) => pm[prop]).flat();

				if (!this.formSearch.payment_methods.length) this.formSearch.payment_methods = payment_methods;
				if (!this.formSearch.payment_statuses.length) this.formSearch.payment_statuses = payment_statuses;
			});

			setTimeout(async () => {
				await this.get(this.page.page, true);

				// handle get struk newest transaction
				if (!url_param["get_newest_struk"]) return;

				const newest = this.transactions?.[0];

				if (!newest) return;

				this.openStruct(newest);
			}, 500);

			(() => {
				// SSE NOTIF
				const es = new EventSource("./src/php/sse-server.php");

				es.addEventListener("sse_order", (e) => {
					try {
						const payload = JSON.parse(e.data);

						console.warn(e);
						console.warn(payload);

						const { name, total, payment_method, category_count } = payload;

						this.$dispatch("notify", { variant: "info", title: "Transaksi Baru", message: `${name || "unkown"} telah melakukan transaksi sebesar ${IDR.format(total)} via ${payment_method}. (${category_count} jenis produk)` });
					} catch (error) {
						console.log("ERROR IN SSE ORDER", error);
					}
				});
			})();
		},

		async get(page, is_init = false) {
			q.add(
				"get",
				async () => {
					const formData = new FormData();
					formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// handle empty filter
					if (!this.formSearch.payment_methods.length) (this.formSearch.payment_methods = payment_methods), console.warn({ payment_methods });
					if (!this.formSearch.payment_statuses.length) (this.formSearch.payment_statuses = payment_statuses), console.warn({ payment_statuses });

					// Asign x-model to post body | formdata
					bindAndFillFormData(formData, this.formSearch);

					if (!is_init) formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Handle rewrtie
					const isRewriteUrl = rewriteUrl(formData, url_param);

					if (!isRewriteUrl && !is_init) return console.warn("Reject get method cause same param!");

					const res = await fetch(db_path + "search", {
						method: "POST",
						body: formData,
					});

					const text = await res.text();

					encodeFetchedJson(
						text,
						null,
						(json) => {
							const { status, msg: message, data, pagination, query_page, query } = json;

							console.log(query);
							this.transactions = data;
							Object.assign(this.page, pagination);
						},
						{
							swalSuccess: false,
						}
					);

					// rewrite again
					let shouldRewrite;
					["date_start", "date_end"].forEach((key) => {
						if (formData.get(key)) return;

						formData.delete(key);
						formData.append(key, "NULL");

						if (!shouldRewrite) shouldRewrite = true;
					});

					if (shouldRewrite) rewriteUrl(formData, url_param);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},
		async edit() {
			q.add(
				"edit",
				async () => {
					const formData = new FormData(form);
					formData.append("id", this.form.id);
					formData.append("prev_payment_method", this.form.prev_payment_method);
					formData.append("prev_payment_status", this.form.prev_payment_status);

					const res = await fetch(db_path + "edit", {
						method: "POST",
						body: formData,
					});
					const text = await res.text();

					encodeFetchedJson(
						text,
						"edit",
						async ({ msg: message }) => {
							if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });

							await this.get(null, true);
						},
						{
							swalSuccess: false,
						}
					);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},
		async remove({ id }) {
			if (!id) return;

			q.add(
				"remove",
				async () => {
					const { isConfirmed } = await Swal.fire({
						...deafultConfirmProps,
						title: "Yakin ingin hapus transaksi?",
						text: "Transaksi yang dihapus tidak bisa di kembalikan!",
					});

					if (!isConfirmed) return;

					const formData = new FormData();
					// console.log({ id });
					formData.append("id", id);

					const res = await fetch(db_path + "remove", {
						method: "POST",
						body: formData,
					});
					const text = await res.text();

					encodeFetchedJson(
						text,
						"remove",
						async ({ msg: message } = {}) => {
							await this.get(null, true);

							if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
						},
						{
							swalSuccess: false,
						}
					);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		openModal() {
			this.form = {
				id: null,
				total: null,
				date: null,
				payment_method: null,
				payment_status: null,

				prev_payment_method: null,
				prev_payment_status: null,
			};

			this.isOpenModal = true;
		},
		selectEdit(transaction) {
			if (!transaction.id) return console.log("not id");

			console.log("set id");

			this.openModal();
			const data = {
				...this.form,
				...transaction,
				prev_payment_method: transaction.payment_method,
				prev_payment_status: transaction.payment_status,
			};
			this.form = data;

			// console.log({ data, transaction });
		},
		openModalDetail(detail) {
			console.log(detail);
			// console.log(JSON.stringify(detail));

			try {
				console.log(JSON.parse(detail.td));
			} catch (e) {}
			this.detail = detail;
			this.isOpenDetailModal = true;
		},
		async bayar({ id } = {}) {
			if (isNaN(id)) return console.warn("Id harus berupa number!");

			const { isConfirmed } = await Swal.fire({
				...deafultConfirmProps,
				title: "Konfirmasi",
				text: "Yakin ingin ubah status transaksi menjadi Sudah dibayar?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Ya, Ubah!",
			});

			if (!isConfirmed) return;

			const formData = new FormData();

			formData.append("id", id);

			encodeFetchedJson(
				await (await fetch(db_path + "transaction-status-to-bayar", { method: "POST", body: formData })).text(),
				"ubah-status-transaksi",
				async ({ msg: message }) => {
					await this.get(null, true);

					if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
				},
				{
					swalSuccess: false,
				}
			);
		},

		get syncTransactionStatus() {
			return is_wait.syncTransactionStatus;
		},

		async syncTransactionStatus({ id, payment_key, payment_status } = {}) {
			if (!id || !payment_key || !payment_status) return;

			q.add(
				"sync-status",
				async () => {
					// check cache for to much re-request
					const now = Date.now();
					const cache_name = "cache-syncTransaction";
					const _cache = {};
					try {
						const _json = JSON.parse(localStorage.getItem(cache_name));
						Object.assign(_cache, _json);
					} catch (e) {}

					// formula: 1 hour
					if (_cache[id] && !isNaN(_cache[id]) && _cache[id] - now < 1000 * 60 * 60) {
						const times = calculateTimeDifference(_cache[id], now);

						const { isConfirmed } = await Swal.fire({ ...deafultConfirmProps, title: "Yakin ingin sync status nya lagi?", text: `Aksi yang sama baru saja di lakukan ${times.minutes > 0 ? times.minutes + " menit" : times.seconds + " detik"} yang lalu.` });

						// console.log("confirm:", isConfirmed);
						if (!isConfirmed) return;
					}

					const formData = new FormData();
					formData.append("payment_key", payment_key);
					formData.append("payment_status", payment_status);

					Object.assign(_cache, { [id]: now });
					localStorage.setItem(cache_name, JSON.stringify(_cache));
					encodeFetchedJson(await (await fetch(db_path + "check-status", { method: "POST", body: formData })).text(), "sync-status", () => {
						this.get(null, true);
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		async remakeTransaction(transaction) {
			const { id, payment_key, payment_status, total, payment_method, transaction_details } = transaction;

			if (!id || !payment_key || !payment_status || !total || !payment_method || !transaction_details) return;

			q.add(
				"remake-transaction",
				async () => {
					const formData = new FormData();

					const _data = { ...transaction };
					delete _data.transaction_details;

					bindAndFillFormData(formData, _data);
					formData.append("cart", JSON.stringify(transaction.transaction_details));

					encodeFetchedJson(
						await (await fetch(db_path + "remake-transaction", { method: "POST", body: formData })).text(),
						"Remake Transaction",
						({ msg: message }) => {
							// console.log(json);
							this.get(null, true);

							if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
						},
						{
							swalSuccess: false,
						}
					);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		openStruct(product) {
			if (!product?.id) return;

			this.struk = {};
			this.struk = { ...product };

			this.isOpenStructModal = true;
		},

		async print() {
			print();
			// const { jsPDF } = window.jspdf || {};

			// if (!jsPDF) return;

			// const doc = new jsPDF();

			// this.whilePrint = true;
			// await sleep(200);

			// const element = document.querySelector("#print-modal");
			// console.log(element);

			// const canvas = await html2canvas(element);
			// const imgData = canvas.toDataURL("image/png");

			// const imgProps = doc.getImageProperties(imgData);
			// const pdfWidth = doc.internal.pageSize.getWidth();
			// const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

			// doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			// doc.save("laporan.pdf");

			// this.whilePrint = false;
		},
	};
}
