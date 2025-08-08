import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import { defaultErrorProps } from "../libs/swal2props.js";

export default function () {
    const db_path = "./src/php/staffs.php?m=";

    const is_wait = {
        login: false,
    };

    return {
        form: {
            username: null,
            password: null,
        },

        init() {
            this.$refs.inputUsername.focus()
        },

        async login() {
            if (is_wait.login) return await Swal.fire({ ...defaultErrorProps, text: "Mohon Tunggu. Sedang memproses aksi sebelumnya!" });

            is_wait.login = true;

            const formData = new FormData();
            bindAndFillFormData(formData, this.form);

            encodeFetchedJson(await (await fetch(db_path + "login", { method: "POST", body: formData })).text(), "Login", () => {
                setTimeout(() => {
                    location.href = "?c=dashboard";
                }, 3000);
            });

            is_wait.login = false;
        },
    };
}
