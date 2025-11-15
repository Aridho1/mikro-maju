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
	const db_path = "./src/php/attandances.php?m=";

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
			__date_start: null,
			__date_end: null,
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

		setDateToNow() {
			const _date = new Date().toISOString().split("T")[0];

			this.formSearch.date_start = _date;
			this.formSearch.date_end = _date;
		},

		// methods
		async init() {
			if (!this.auth) {
				return console.log("Auth tidak ditemukan!");
			}

			this.getTime();

			setInterval(() => this.getTime(), 1000 * 60);

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

			this.form.username = this.auth.username;

			console.error("FORM", this.form);

			await this.get(null, true);

			this.$watch("formattedSalary", (value) => {
				const _value = value.replace(/\D/g, "");
				this.formattedSalary = IDR.format(_value);
				this.form.salary = _value;
			});

			encodeFetchedJson(await (await fetch("./src/php/staffs.php?m=" + "get-all-staff")).text(), "get-all-staff", ({ data }) => {
				if (!Array.isArray(data)) return;

				this.staffs = data;
			});
		},

		staff: null,
		selectStaff(username) {
			this.staff = this.staffs.find((staff) => staff.username == username);

			this.form.staff_id = this.staff.id;
		},

		async get(page, is_init = false) {
			q.add(
				"get",
				async () => {
					const formData = new FormData();
					bindAndFillFormData(formData, this.formSearch);

					if (!is_init) formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

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
					const formData = new FormData();

					bindAndFillFormData(formData, this.form);

					encodeFetchedJson(
						await (await fetch(db_path + "add", { method: "POST", body: formData })).text(),
						"add",
						({ msg } = {}) => {
							this.$dispatch("notify", { variant: "success", title: "Selamat", message: msg });
						},
						{ swalSuccess: false }
					);

					console.error("THISFORM", this.form);

					await this.get(null, true);
					this.isOpenModal = false;
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => {
						this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });
					},
				}
			);
		},
		async remove({ id, staff_id } = {}) {
			q.add(
				"remove",
				async () => {
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

					encodeFetchedJson(
						await (await fetch(db_path + "remove", { method: "POST", body: formData })).text(),
						"remove",
						async ({ msg } = {}) => {
							this.$dispatch("notify", { variant: "success", title: "Selamat", message: msg });
							await this.get(null, true);
						},
						{ swalSuccess: false }
					);
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => {
						this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });
					},
				}
			);
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
