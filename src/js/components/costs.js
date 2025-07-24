import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps } from "../libs/swal2props.js";
import DateRangePicker from "../../../node_modules/flowbite-datepicker/js/DateRangePicker.js";
import { config, getConfigJson } from "../libs/getConfigJson.js";

export default function () {
    const db_path = "./src/php/costs.php?m=";

    // console.warn(config);

    const is_wait = {
        get: false,
        add: false,
        edit: false,
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

        // methods
        async init() {
            // get categories
            await this.getCategories(true);

            const config = await getConfigJson();
            console.warn("a", { config });

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

            // regenerate UI / value input date
            if (this.formSearch.date_start && this.formSearch.date_end) {
                dateRangePicker.setDates(this.formSearch.date_start, this.formSearch.date_end);

                // datepickers[1].setDate(this.formSearch.date_end);
                // datepickers[0].setDate(this.formSearch.date_start);
            }

            await this.get(null, true);

            // watch amount form
            this.$watch("form.amount", (curr, prev) => {
                if (isNaN(curr) || isNaN(prev)) return;

                console.log({ curr, prev });

                if (prev - 1 == curr) this.form.amount = prev - 1000;
                else if (prev - 0 + 1 == curr) this.form.amount = prev - 0 + 1000;
            });

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
        },

        async getCategories(is_init) {
            encodeFetchedJson(await (await fetch(db_path + "get-categories")).text(), "get-categories", ({ data, categories }) => {
                if (!Array.isArray(categories)) return;

                this.categories = categories;
                console.log({ categories });

                if (is_init) this.formSearch.categories = categories;
            });
        },

        async get(page, is_init = false) {
            if (is_wait.get) return console.warn("Reject get method cause spam!");

            is_wait.get = true;

            const formData = new FormData();
            formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
            bindAndFillFormData(formData, this.formSearch);
            console.log(this.formSearch);

            // Filter | same url param = same result
            if (!rewriteUrl(formData, url_param) && !is_init) return (is_wait.get = false), console.warn("Reject get method cause same url param!");

            encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), "search", ({ data, pagination } = {}) => {
                this.costs = data;

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
                date: null,
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
