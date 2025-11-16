import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
// import { defaultErrorProps } from "../libs/swal2props.js";
import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

export default function () {
	const db_path = "./src/php/staffs.php?m=";

	let authed = false;

	return {
		appName: "login",
		form: {
			username: null,
			password: null,
		},

		init() {},

		clear() {
			this.form.username = null;
			this.form.password = null;
		},

		async login() {
			if (authed) return this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Kamu sudah login!" });

			q.add(
				"login",
				async () => {
					const formData = new FormData();
					bindAndFillFormData(formData, this.form);

					encodeFetchedJson(
						await (await fetch(db_path + "login", { method: "POST", body: formData })).text(),
						"Login",
						({ msg: message }) => {
							setTimeout(() => {
								location.href = "?c=menu";
							}, 3000);

							if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });

							authed = true;
							this.clear();
						},
						{ swalError: false, errorCallback: ({ message }) => this.$dispatch("notify", { variant: "danger", title: "Gagal", message }) }
					);
				},
				{ cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu beberapa saat! Sedang memproses aaksi sebelumnya." }) }
			);
		},
	};
}
