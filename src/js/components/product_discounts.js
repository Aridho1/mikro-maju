// import config from "../../../config.json";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { deafultConfirmProps } from "../libs/swal2props.js";
import { TaskQueue } from "../libs/TaskQueue.js";
import { url_param } from "../libs/urlParam.js";

const q = new TaskQueue();

const defaultWarningNotif = {
	variant: "warning",
	title: "Warning",
	message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!",
};

export default function () {
	const dbPath = "./src/php/product_discounts.php?m=";

	const types = {
		percent: "Persen (%)",
		fixed: "Angka Fix",
	};

	const type_keys = Object.keys(types);
	const type_list = type_keys.map(() => [key, types[key]]);

	return {
		mainDatas: [],
		form: {
			id: null,
			product_id: null,
			type: null,
			value: null,
			start_date: null,
			end_date: null,
		},
		page: Pagination(),
		formSearch: {
			date_start: null,
			date_end: null,
			types: [],
			is_sort_desc: true,
			page: 1,
		},

		isOpenModal: false,
		types,

		setDateToNow() {
			const _date = new Date().toISOString().split("T")[0];

			this.formSearch.date_start = _date;
			this.formSearch.date_end = _date;
		},

		init() {
			fillFormsByUrlParam(
				{
					array: ["types"],
					string: ["date_start", "date_end"],
					int: "page",
					bool: "is_sort_desc",
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

			setTimeout(() => {
				this.get(this.page.page, true);
			}, 500);
		},

		get(page, is_init = false) {
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

					if (!isRewriteUrl && !is_init) return console.warn("Reject get method cause same param!");

					encodeFetchedJson(await (await fetch(dbPath + "search", { method: "POST", body: formData })).text(), "", ({ data, pagination }) => {
						//
						this.data = data;
						Object.assign(this.page, pagination);
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
				{ cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) }
			);
		},

		async remove({ id }) {
			if (!id) return;

			q.add(
				"remove",
				async () => {
					const { isConfirmed } = await Swal.fire({
						...deafultConfirmProps,
						title: "Yakin ingin hapus diskon?",
						text: "Diskon yang dihapus tidak bisa di kembalikan!",
					});

					if (!isConfirmed) return;

					const formData = new FormData();
					formData.append("id", id);

					encodeFetchedJson(
						await (await fetch(dbPath + "remove", { method: "POST", body: formData })).text(),
						"remove",
						({ msg: message } = {}) => {
							this.get(null, true);

							if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
						},
						{ swalSuccess: false }
					);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
				}
			);
		},

		openModal() {
			this.form = {
				id: null,
				product_id: null,
				type: null,
				value: null,
				start_date: null,
				end_date: null,
			};

			this.isOpenModal = true;
		},
	};
}
