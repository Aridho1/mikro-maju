import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps } from "../libs/swal2props.js";
// import DateRangePicker from "../../../node_modules/flowbite-datepicker/js/DateRangePicker.js";
import DateRangePicker from "../../../pkg/flowbite-datepicker-1.3.2/package/js/DateRangePicker.js";
import { config, getConfigJson } from "../libs/getConfigJson.js";

export default function () {
    const db_path = "./src/php/midtrans_settings.php?m=";

    // console.warn(config);

    const is_wait = {
        get: false,
        add: false,
        edit: false,
    };

    return {
        appName: "Settings",
        midtrans_settings: [],
        form: {
            id: null,
            is_production: false,
            merchant_server_key: null,
            client_key: null,
            description: null,
        },
        formSearch: {
            filters: ["is_production", "merchant_server_key", "client_key", "description"],
            sort_desc: true,
            keyword: null,
        },
        page: new Pagination(),

        // regular props
        isOpenModal: false,
        isOpenDescModal: false,
        description_of_cost: null,

        // methods
        async init() {

            const config = await getConfigJson();

            // set filter by url param
            fillFormsByUrlParam(
                {
                    array: ["filters"],
                    string: ["keyword"],
                    int: "page",
                    boolean: "sort_desc",
                },
                this.formSearch,
                url_param
            );

            await this.get(null, true);

        },
        async get(page, is_init = false) {
            if (is_wait.get) return console.warn("Reject get method cause spam!");

            is_wait.get = true;

            const formData = new FormData();
            formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
            bindAndFillFormData(formData, this.formSearch);

            // Filter | same url param = same result
            if (!rewriteUrl(formData, url_param) && !is_init) return (is_wait.get = false), console.warn("Reject get method cause same url param!");

            encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), "search", ({ data, pagination } = {}) => {
                this.midtrans_settings = data;

                if (pagination && typeof pagination == "object") Object.assign(this.page, pagination);
            });

            is_wait.get = false;
        },
        async add() {
            if (is_wait.add) return console.warn("Reject add method cause spam!");

            is_wait.add = true;

            const formData = new FormData();

            bindAndFillFormData(formData, this.form);

            encodeFetchedJson(await (await fetch(db_path + "add", { method: "POST", body: formData })).text(), "add", ({ msg: text } = {}) => {
                Swal.fire({ icon: "success", title: "Selamat", text });
            });

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

            is_wait.edit = false;

            await this.get(null, true);
        },
        async remove({ id } = {}) {
            if (!id) return;

            const { isConfirmed } = await Swal.fire({
                ...deafultConfirmProps,
                title: "Yakin ingin hapus data setting?",
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
                description: null,
            };

            this.isOpenModal = true;
        },
        selectCostEdit(setting) {
            if (!setting.id) return;
            // console.log("IDDDDDDDDDDDD", setting.id);

            Object.assign(this.form, setting);

            this.isOpenModal = true;
        },
    };
}
