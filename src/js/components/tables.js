import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { deafultConfirmProps } from "../libs/swal2props.js";
import { TaskQueue } from "../libs/TaskQueue.js";
import { url_param } from "../libs/urlParam.js";

const q = new TaskQueue();

export default function () {
	const db_path = "./src/php/tables.php?m=";

	return {
		appName: "Meja",
		link: "#",
		tables: [],
		form: {
			id: null,
			name: null,
		},
		formSearch: {
			keyword: null,
			sort_desc: true,
		},
		isOpenModal: false,
		page: new Pagination(),
		qrDetail: null,
		qr: null,

		async init() {
			// const canvas = document.getElementById("qr-code");

			// const qr = await new QRCode("qr-code", {
			// 	text: "HALO SEMUA",
			// 	width: 128,
			// 	height: 128,
			// 	colorDark: "#000000",
			// 	colorLight: "#ffffff",
			// 	correctLevel: QRCode.CorrectLevel.H,
			// });

			// await qr;

			// this.$nextTick(() => {
			// 	const link = qr._el.querySelector("img").src;

			// 	console.log({ link });
			// });

			this.qr = new QRCode("qr-code", {
				width: 128,
				height: 128,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRCode.CorrectLevel.H,
			});

			fillFormsByUrlParam(
				{
					string: ["keyword"],
					int: "page",
					boolean: "sort_desc",
				},
				this.formSearch,
				url_param
			);

			this.get(null, true);

			// this.link = link;
		},

		async get(page, is_init = false) {
			q.add(
				"get",
				async () => {
					const formData = new FormData();
					formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Asign x-model to post body | formdata
					bindAndFillFormData(formData, this.formSearch);

					if (!is_init) formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Handle rewrtie
					const isRewriteUrl = rewriteUrl(formData, url_param);

					if (!isRewriteUrl && !is_init) return this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Aksi dibatalkan karena keyword yang sama dengan sebelumnya!" });

					encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), "search", ({ data, pagination } = {}) => {
						this.tables = data;

						if (pagination && typeof pagination == "object") Object.assign(this.page, pagination);
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		async add() {
			q.add(
				"add",
				async () => {
					const formData = new FormData();

					bindAndFillFormData(formData, this.form);

					encodeFetchedJson(await (await fetch(db_path + "add", { method: "POST", body: formData })).text(), "add", async ({ msg: message } = {}) => {
						// Swal.fire({ icon: "success", title: "Selamat", text });

						if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
						await this.get(null, true);
					});
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
					const formData = new FormData();
					bindAndFillFormData(formData, this.form);

					encodeFetchedJson(await (await fetch(db_path + "edit", { method: "POST", body: formData })).text(), "edit", async ({ msg: message } = {}) => {
						if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
						await this.get(null, true);
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		async remove({ id } = {}) {
			if (!id) return;

			q.add(
				"remove",
				async () => {
					const { isConfirmed } = await Swal.fire({
						...deafultConfirmProps,
						title: "Yakin ingin hapus Data Meja?",
						text: "Data yang dihapus tidak bisa di kembalikan!",
						confirmButtonText: "Ya, saya yakin!",
						cancelButtonText: "Batal",
					});

					if (!isConfirmed) return;

					const formData = new FormData();
					formData.append("id", id);

					encodeFetchedJson(await (await fetch(db_path + "remove", { method: "POST", body: formData })).text(), "remove", async ({ msg: message } = {}) => {
						if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });

						await this.get(null, true);
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" }),
				}
			);
		},

		selectTableEdit(table) {
			if (!table.id) return;

			Object.assign(this.form, table);

			this.isOpenModal = true;
		},

		selectTableDetail(table) {
			if (!table.id) return;

			this.qrDetail = table;

			const url = `${location.origin}${location.pathname}?c=order&t=${table.name}`;
			this.qrDetail.__url = url;

			this.qr.clear();
			this.qr.makeCode(url);

			this.$nextTick(() => {
				const link = this.qr._el.querySelector("img").src;
				if (this.qrDetail) this.qrDetail.__link = link;
			});
		},

		openModal() {
			this.form = {
				id: null,
				name: null,
			};

			this.isOpenModal = true;
		},
	};
}
