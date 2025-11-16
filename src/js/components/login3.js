import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
// import { defaultErrorProps } from "../libs/swal2props.js";
import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

export default function () {
	const db_path = "./src/php/staffs.php?m=";

	return {
		appName: "login",
		form: {
			username: null,
			password: null,
		},

		init() {},

		async login() {
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
						},
						{ swallError: false, errorCallback: ({ message }) => this.$dispatch("notify", { variant: "danger", title: "Gagal", message }) }
					);
				},
				{ cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Mohon tunggu beberapa saat! Sedang memproses aaksi sebelumnya." }) }
			);
		},
	};
}
