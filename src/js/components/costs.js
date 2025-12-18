import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps } from "../libs/swal2props.js";

import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

const IDR = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
});

export default function () {
	const db_path = "./src/php/costs.php?m=";

	// console.warn(config);

	const is_wait = {
		get: false,
		add: false,
		edit: false,
	};

	return {
		appName: "Pengeluaran",
		costs: [],
		form: {
			id: null,
			date: null,
			amount: null,
			category: null,
			description: null,
		},
		formSearch: {
			filters: ["amount", "description"],
			categories: [],
			date_start: null,
			date_end: null,
			sort_desc: true,
			keyword: null,
		},
		page: new Pagination(),

		categories: [],

		// regular props
		isOpenModal: false,
		isOpenDescModal: false,
		description_of_cost: null,

		setDateToNow() {
			const _date = new Date().toISOString().split("T")[0];

			this.formSearch.date_start = _date;
			this.formSearch.date_end = _date;
		},

		// methods
		async init() {
			// get categories

			// set filter by url param
			fillFormsByUrlParam(
				{
					array: ["filters", "categories"],
					string: ["date_start", "date_end", "keyword"],
					int: "page",
					boolean: "sort_desc",
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

			await this.getCategories(true);

			await this.get(null, true);

			// watch amount form
			this.$watch("form.amount", (curr, prev) => {
				if (isNaN(curr) || isNaN(prev)) return;

				console.log({ curr, prev });

				if (prev - 1 == curr) this.form.amount = prev - 1000;
				else if (prev - 0 + 1 == curr) this.form.amount = prev - 0 + 1000;
			});
		},

		async getCategories(is_init) {
			encodeFetchedJson(await (await fetch(db_path + "get-categories")).text(), "get-categories", ({ data, categories }) => {
				if (!Array.isArray(categories)) return;

				if (!this.categories.length) this.categories = categories;

				if ((is_init && !this.deafultConfirmProps, categories.length)) this.formSearch.categories = categories;
			});
		},

		async get(page, is_init = false) {
			q.add(
				"get",
				async () => {
					console.warn("GET DATA");
					const formData = new FormData();
					formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
					// formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Asign x-model to post body | formdata
					bindAndFillFormData(formData, this.formSearch);

					if (!is_init) formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Handle rewrtie
					const isRewriteUrl = rewriteUrl(formData, url_param);

					if (!isRewriteUrl && !is_init) return console.warn("Reject get method cause same param!");

					encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), "search", ({ data, pagination } = {}) => {
						this.costs = data;

						if (pagination && typeof pagination == "object") Object.assign(this.page, pagination);
					});

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
		async add() {
			if (is_wait.add) return console.warn("Reject add method cause spam!");

			is_wait.add = true;

			const formData = new FormData();

			bindAndFillFormData(formData, this.form);

			encodeFetchedJson(await (await fetch(db_path + "add", { method: "POST", body: formData })).text(), "add", ({ msg: text } = {}) => {
				Swal.fire({ icon: "success", title: "Selamat", text });
			});

			// if (!this.categories.includes(formData.get("amount"))) this.getCategories();

			is_wait.add = false;

			await this.get(null, true);
		},
		async edit() {
			if (is_wait.edit) return console.warn("Reject edit method case spam!");

			is_wait.edit = true;

			const formData = new FormData();
			bindAndFillFormData(formData, this.form);

			encodeFetchedJson(await (await fetch(db_path + "edit", { method: "POST", body: formData })).text(), "edit", ({ msg: text } = {}) => {
				Swal.fire({ icon: "success", title: "Selamat", text });
			});

			// if (!this.categories.includes(formData.get("amount"))) this.getCategories();

			is_wait.edit = false;

			await this.get(null, true);
		},
		async remove({ id } = {}) {
			if (!id) return;

			const { isConfirmed } = await Swal.fire({
				...deafultConfirmProps,
				title: "Yakin ingin hapus Data Pengeluaran?",
				text: "Data yang dihapus tidak bisa di kembalikan!",
				confirmButtonText: "Ya, saya yakin!",
				cancelButtonText: "Batal",
			});

			if (!isConfirmed) return;

			const formData = new FormData();
			formData.append("id", id);

			encodeFetchedJson(await (await fetch(db_path + "remove", { method: "POST", body: formData })).text(), "remove", async ({ msg } = {}) => {
				Swal.fire({ title: "Selamat", icon: "success", text: msg });
				await this.get(null, true);
			});
		},
		openModal() {
			this.form = {
				id: null,
				amount: null,
				category: null,
				description: null,
			};

			this.isOpenModal = true;
		},
		selectCostEdit(cost) {
			if (!cost.id) return;
			console.log("IDDDDDDDDDDDD", cost.id);

			Object.assign(this.form, cost);

			this.isOpenModal = true;
		},
	};
}
