import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps, defaultErrorProps } from "../libs/swal2props.js";
import { calculateTimeDifference, sleep } from "../libs/sleep.js";
import rewriteUrl from "../libs/rewriteUrl.js";

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
			// Set filter by url
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
			}
			// init watch date range
			window.addEventListener("date-range-change", ({ detail }) => {
				const { startDate, endDate } = detail;

				// console.log(dateRangePicker)
				const _start = startDate ? startDate.toISOString() : startDate;
				const _end = endDate ? endDate.toISOString() : endDate;

				this.formSearch.date_start = _start;
				this.formSearch.date_end = _end;
			});

			encodeFetchedJson(await (await fetch(db_path + "get-payment-methods")).text(), "fetch-get-payment-methods", ({ payment_methods: pm } = {}) => {
				this.paymentMethods = pm;

				// console.warn({ pm });

				payment_methods = Object.keys(pm);
				payment_statuses = payment_methods.map((prop) => pm[prop]).flat();
				// console.warn({ pm: payment_statuses });

				// console.warn("this.formSearch.payment_methods", this.formSearch.payment_methods, "this.formSearch.payment_statuses", this.formSearch.payment_statuses);

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
		},

		async get(page, is_init = false) {
			if (is_wait.search) return console.warn("cancel cause spam");

			is_wait.search = true;

			const formData = new FormData();
			formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

			console.log("page:", page);

			// handle empty filter
			if (!this.formSearch.payment_methods.length) (this.formSearch.payment_methods = payment_methods), console.warn({ payment_methods });
			if (!this.formSearch.payment_statuses.length) (this.formSearch.payment_statuses = payment_statuses), console.warn({ payment_statuses });

			// Asign x-model to post body | formdata
			bindAndFillFormData(formData, this.formSearch);

			formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
			console.log("page:", formData.get("page"));

			// Handle rewrtie
			const isRewriteUrl = rewriteUrl(formData, url_param);
			console.log({ isRewriteUrl });
			if (!isRewriteUrl && !is_init) return (is_wait.search = false), console.warn("Reject get method cause same param!");

			const res = await fetch(db_path + "search", {
				method: "POST",
				body: formData,
			});

			const text = await res.text();

			encodeFetchedJson(text, null, (json) => {
				const { status, msg, data, pagination, query_page, query } = json;

				console.log(query);
				this.transactions = data;
				Object.assign(this.page, pagination);
			});

			is_wait.search = false;
		},
		async edit() {
			const formData = new FormData(form);
			formData.append("id", this.form.id);
			formData.append("prev_payment_method", this.form.prev_payment_method);
			formData.append("prev_payment_status", this.form.prev_payment_status);

			const res = await fetch(db_path + "edit", {
				method: "POST",
				body: formData,
			});
			const text = await res.text();

			encodeFetchedJson(text, "edit", async () => {
				await this.get(null, true);
			});
		},
		async remove({ id }) {
			if (!id) return;

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

			encodeFetchedJson(text, "remove", async ({ msg } = {}) => {
				Swal.fire({ title: "Selamat", icon: "success", text: msg });
				await this.get(null, true);
			});
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

			encodeFetchedJson(await (await fetch(db_path + "transaction-status-to-bayar", { method: "POST", body: formData })).text(), "ubah-status-transaksi", async () => {
				await this.get(null, true);
			});
		},

		get syncTransactionStatus() {
			return is_wait.syncTransactionStatus;
		},

		async syncTransactionStatus({ id, payment_key, payment_status } = {}) {
			if (!id || !payment_key || !payment_status) return;

			if (is_wait.syncTransactionStatus) return Swal.fire({ ...defaultErrorProps, text: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });

			is_wait.syncTransactionStatus = true;

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

				console.log("confirm:", isConfirmed);
				if (!isConfirmed) return (is_wait.syncTransactionStatus = false);
			}

			const formData = new FormData();
			formData.append("payment_key", payment_key);
			formData.append("payment_status", payment_status);

			Object.assign(_cache, { [id]: now });
			localStorage.setItem(cache_name, JSON.stringify(_cache));
			encodeFetchedJson(await (await fetch(db_path + "check-status", { method: "POST", body: formData })).text(), "sync-status", () => {
				this.get(null, true);
			});

			console.log({ _cache, cache_name });

			is_wait.syncTransactionStatus = false;
		},

		async remakeTransaction(transaction) {
			const { id, payment_key, payment_status, total, payment_method, transaction_details } = transaction;

			if (!id || !payment_key || !payment_status || !total || !payment_method || !transaction_details) return;

			if (is_wait.remakeTransaction) return Swal.fire({ ...defaultErrorProps, text: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });

			is_wait.remakeTransaction = true;

			const formData = new FormData();

			const _data = { ...transaction };
			delete _data.transaction_details;
			// const _context = { ..._data, cart: transaction.transaction_details };
			// console.log({ transaction });
			bindAndFillFormData(formData, _data);
			formData.append("cart", JSON.stringify(transaction.transaction_details));

			encodeFetchedJson(await (await fetch(db_path + "remake-transaction", { method: "POST", body: formData })).text(), "Remake Transaction", (json) => {
				// console.log(json);
				this.get(null, true);
			});
			is_wait.remakeTransaction = false;
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
