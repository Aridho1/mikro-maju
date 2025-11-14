import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps } from "../libs/swal2props.js";
// import DateRangePicker from "../../../node_modules/flowbite-datepicker/js/DateRangePicker.js";
import DateRangePicker from "../../../pkg/flowbite-datepicker-1.3.2/package/js/DateRangePicker.js";
import { TaskQueue } from "../libs/TaskQueue.js";
// import { config, getConfigJson } from "../libs/getConfigJson.js";

const q = new TaskQueue();

const IDR = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
});

export default function () {
	const db_path = "./src/php/attandances.php?m=";

	// console.warn(config);

	const is_wait = {
		get: false,
		add: false,
		// edit: false,
		remove: false,
	};

	// Handle datepicker
	const el_date_start = document.querySelector("#datepicker-range-start");
	const el_date_end = document.querySelector("#datepicker-range-end");

	const el_date_range_picker = document.querySelector("#date-range-picker");
	const dateRangePicker = new DateRangePicker(el_date_range_picker, {
		format: "yyyy-mm-dd",
		clearBtn: true,
		todayBtn: true,
		todayBtnMode: 1,
		language: "id",
	});
	const datepickers = dateRangePicker.datepickers;

	const date = new Date().toISOString().split("T")[0];

	return {
		appName: "Absensi",
		attandances: [],
		staffs: [],
		form: {
			id: null,
			staff_id: null,
			username: null,
			status: null,
			type: null,
			time: null,
			salary: 0,
		},
		formSearch: {
			statuses: [],
			types: [],
			date_start: null,
			date_end: null,
			sort_desc: true,
			keyword: null,
		},
		page: new Pagination(),

		statuses: ["Hadir", "Tidak Hadir"],
		types: ["clock-in", "clock-out"],
		typesText: ["Clock In", "Clock out"],

		// regular props
		isOpenModal: false,
		isOpenDescModal: false,
		description_of_cost: null,
		time: null,
		date,
		formattedSalary: "",

		getTime() {
			const now = new Date();
			const hours = now.getHours().toString().padStart(2, "0");
			const minute = now.getMinutes().toString().padStart(2, "0");

			const time = `${hours}:${minute}`;
			this.time = time;
			this.form.time = time;

			console.log({ time });
		},

		// methods
		async init() {
			if (!this.auth) {
				return console.log("Auth tidak ditemukan!");
			}

			this.getTime();

			setInterval(() => this.getTime(), 1000 * 60);

			// get categories
			// await this.getCategories(true);

			// set filter by url param
			fillFormsByUrlParam(
				{
					array: ["statuses", "types"],
					string: ["date_start", "date_end", "keyword"],
					int: "page",
					boolean: "sort_desc",
				},
				this.formSearch,
				url_param
			);

			this.form.username = this.auth.username;

			console.error("FORM", this.form);

			// regenerate UI / value input date
			if (this.formSearch.date_start && this.formSearch.date_end) {
				dateRangePicker.setDates(this.formSearch.date_start, this.formSearch.date_end);

				// datepickers[1].setDate(this.formSearch.date_end);
				// datepickers[0].setDate(this.formSearch.date_start);
			}

			await this.get(null, true);

			const ctx = this;

			Object.defineProperty(el_date_start, "value", {
				_value: "",
				set(newValue) {
					this._value ??= "";
					if (newValue == this._value) return newValue;

					this._value = newValue;
					ctx.formSearch.date_start = newValue;

					return newValue;
				},
				get() {
					return this._value;
				},
			});

			Object.defineProperty(el_date_end, "value", {
				_value: "",
				set(newValue) {
					this._value ??= "";
					if (newValue == this._value) return newValue;

					this._value = newValue;
					ctx.formSearch.date_end = newValue;
					return newValue;
				},
				get() {
					return this._value;
				},
			});

			this.$watch("formattedSalary", (value) => {
				const _value = value.replace(/\D/g, "");
				this.formattedSalary = IDR.format(_value);
				this.form.salary = _value;
			});

			encodeFetchedJson(await (await fetch("./src/php/staffs.php?m=" + "get-all-staff")).text(), "get-all-staff", ({ data }) => {
				if (!Array.isArray(data)) return;

				this.staffs = data;
				console.log({ staffs: data });

				// if (is_init) this.formSearch.categories = categories;
			});
		},

		staff: null,
		selectStaff(username) {
			this.staff = this.staffs.find((staff) => staff.username == username);

			// console.log({ staff: this.staff });
			this.form.staff_id = this.staff.id;
		},

		async get(page, is_init = false) {
			q.add(
				"get",
				async () => {
					const formData = new FormData();
					bindAndFillFormData(formData, this.formSearch);
					formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

					// Filter | same url param = same result
					if (!rewriteUrl(formData, url_param) && !is_init) return (is_wait.get = false), console.warn("Reject get method cause same url param!");

					encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), "search", ({ data, pagination } = {}) => {
						this.attandances = data;

						if (pagination && typeof pagination == "object") Object.assign(this.page, pagination);
					});
				},
				{ cancelIfAlreadyInQueue: true, callbackForCancelled: () => console.warn("JANGAN SPAM GET!!!") }
			);
		},
		async add() {
			q.add(
				"add",
				async () => {
					// if (is_wait.add) return console.warn("Reject add method cause spam!");

					// is_wait.add = true;

					await new Promise((resolve) => setTimeout(resolve, 6000));

					const formData = new FormData();

					bindAndFillFormData(formData, this.form);

					// formData.forEach((value, key) => {
					// 	console.log({ key, value });
					// });

					// return;

					encodeFetchedJson(await (await fetch(db_path + "add", { method: "POST", body: formData })).text(), "add", ({ msg } = {}) => {
						// Swal.fire({ icon: "success", title: "Selamat", text });
						this.$dispatch("notify", { variant: "success", title: "Selamat", message: msg });
					});

					console.error("THISFORM", this.form);

					// if (!this.categories.includes(formData.get("amount"))) this.getCategories();

					// is_wait.add = false;

					await this.get(null, true);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => {
						// console.warn("JANGAN SPAM ADDDDD!!!");
						this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });
					},
				}
			);
		},
		async remove({ id, staff_id } = {}) {
			if (!id || !staff_id) return;

			const { isConfirmed } = await Swal.fire({
				...deafultConfirmProps,
				title: "Yakin ingin hapus Absen?",
				text: "Data yang dihapus tidak bisa di kembalikan!",
				confirmButtonText: "Ya, saya yakin!",
				cancelButtonText: "Batal",
			});

			if (!isConfirmed) return;

			const formData = new FormData();
			formData.append("id", id);
			formData.append("staff_id", staff_id);

			encodeFetchedJson(await (await fetch(db_path + "remove", { method: "POST", body: formData })).text(), "remove", async ({ msg } = {}) => {
				// Swal.fire({ title: "Selamat", icon: "success", text: msg });
				this.$dispatch("notify", { variant: "success", title: "Selamat", message: msg });
				await this.get(null, true);
			});
		},
		openModal() {
			this.form = {
				...this.form,
				id: null,
				status: null,
				type: null,
			};

			this.isOpenModal = true;
		},
		selectAttandanceEdit(attandance) {
			if (!attandance.id) return;
			console.log("IDDDDDDDDDDDD", attandance.id);

			Object.assign(this.form, attandance);

			this.isOpenModal = true;
		},
	};
}
