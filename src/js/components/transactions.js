import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps, defaultErrorProps } from "../libs/swal2props.js";
import { calculateTimeDifference, sleep } from "../libs/sleep.js";

// import Datepicker from "../../../node_modules/flowbite-datepicker/js/Datepicker.js";
import DateRangePicker from "../../../node_modules/flowbite-datepicker/js/DateRangePicker.js";
import { oneDayOfTimestamp, timestampToDate } from "../libs/getDatepickerDate.js";
import rewriteUrl from "../libs/rewriteUrl.js";

import html2canvas from "../../../pkg/html2canvas-1.4.1/package/dist/html2canvas.esm.js";
// import { DateRangePicker } from "../../../pkg/flowbite-3.1.2/package/lib/esm/components/datepicker/index.js";

export default function () {
    const db_path = "./src/php/transactions.php?m=";

    const form = document.querySelector("#main-form");

    const PAYMENT_METHODS = ["Tunai", "Transfer"];
    const PAYMENT_STATUS_CASH = ["Belum dibayar", "Sudah dibayar"];
    const PAYMENT_STATUS_TRANSFER = ["Pending", "Settlement"];

    const is_wait = {
        add: false,
        edit: false,
        remove: false,
        search: false,
        syncTransactionStatus: false,
        remakeTransaction: false,
    };

    let payment_methods = [];
    let payment_statuses = [];

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

    const el_search = document.querySelector("#table-search-users");
    return {
        transactions: [],
        form: {
            id: null,
            total: null,
            date: null,
            payment_method: null,
            payment_status: null,

            prev_payment_method: null,
            prev_payment_status: null,
        },
        page: new Pagination(5, 5),
        formSearch: {
            payment_methods: [],
            payment_statuses: [],
            date_start: null,
            date_end: null,
            sort_desc: true,
        },
        inputPage: null,
        PAYMENT_METHODS,
        PAYMENT_STATUS_CASH,
        isOpenModal: false,
        detail: {},
        isOpenDetailModal: false,
        paymentMethods: {},
        isOpenStructModal: false,
        whilePrint: false,
        struk: {},

        get isWaitSearch() {
            return is_wait.search;
        },

        async init() {
            // get dinamic payment methods for
            // Swal.fire({
            //     title: "Please Wait !",
            //     html: "data <br>uploading", // add html attribute if you want or remove
            //     allowOutsideClick: false,
            //     onBeforeOpen: () => {
            //         Swal.showLoading();
            //     },
            // });
            encodeFetchedJson(await (await fetch(db_path + "get-payment-methods")).text(), "fetch-get-payment-methods", ({ payment_methods: pm } = {}) => {
                this.paymentMethods = pm;

                // console.warn({ pm });

                payment_methods = Object.keys(pm);
                payment_statuses = payment_methods.map((prop) => pm[prop]).flat();
                // console.warn({ pm: payment_statuses });

                this.formSearch.payment_methods = payment_methods;
                this.formSearch.payment_statuses = payment_statuses;
            });

            // Set filter by url
            fillFormsByUrlParam(
                {
                    array: ["payment_methods", "payment_statuses"],
                    string: ["date_start", "date_end"],
                    boolean: "sort_desc",
                    int: "page",
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

            // setInterval(() => {
            //     const x = datepickers[0].dates[0];
            //     const y = datepickers[1].dates[0];

            //     console.log({
            //         start: this.formSearch.date_start,
            //         end: this.formSearch.date_end,

            //         start_input: el_date_start.value,
            //         end_input: el_date_end.value,

            //         start_date: x && timestampToDate(x + oneDayOfTimestamp),
            //         end_date: y && timestampToDate(y + oneDayOfTimestamp),
            //     });
            // }, 5000);

            // fillFormsByUrlParam("array", ["payment_methods", "payment_statuses"], this.formSearch);
            // fillFormsByUrlParam("string", ["date_start", "date_end"], this.formSearch);
            // fillFormsByUrlParam("bool", ["sort_desc"], this.formSearch);
            // fillFormsByUrlParam("int", ["page"], this.formSearch);
            // // default
            // // array
            // ["payment_methods", "payment_statuses"].forEach((prop) => {
            //     const ctx = url_param[prop];

            //     if (typeof ctx == "undefined") return;

            //     this.formSearch[prop] = ctx.split(/\,/).filter((val) => val);
            // });
            // // if (url_param["payment_methods"]) this.formSearch.payment_methods = url_param["payment_methods"].split(/\,/);
            // // if (url_param["payment_statuses"]) {
            // //     const data = url_param["payment_statuses"].split(/\,/);
            // //     console.warn(data);
            // //     this.formSearch.payment_statuses = data;
            // // }

            // // normal
            // if (url_param["date_start"]) this.formSearch.date_start = url_param["date_start"];
            // if (url_param["date_end"]) this.formSearch.date_end = url_param["date_end"];
            // if (url_param["sort_desc"]) this.formSearch.sort_desc = true;
            // if (url_param["page"]) this.page.page = url_param["page"];

            // Init

            setTimeout(async () => {
                await this.get(this.page.page, true);

                // handle get struk newest transaction
                if (!url_param["get_newest_struk"]) return;

                const newest = this.transactions?.[0];

                if (!newest) return;

                this.openStruct(newest);
            }, 500);

            // console.log("wait till 2 sec");
            // await sleep(2000);
            // console.log("udah");

            // Handle datepicker

            // this.$watch("formSearch.date_start", (curr, prev) => console.log("start", { curr, prev }));
            // this.$watch("formSearch.date_end", (curr, prev) => console.log("end", { curr, prev }));

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

        async get(page, is_init = false) {
            if (is_wait.search) return console.warn("cancel cause spam");

            is_wait.search = true;

            const formData = new FormData();

            console.log("page:", page);

            formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
            console.log("page:", formData.get("page"));

            // handle empty filter
            if (!this.formSearch.payment_methods.length) (this.formSearch.payment_methods = payment_methods), console.warn({ payment_methods });
            if (!this.formSearch.payment_statuses.length) (this.formSearch.payment_statuses = payment_statuses), console.warn({ payment_statuses });

            // Asign x-model to post body | formdata
            bindAndFillFormData(formData, this.formSearch);
            // Object.keys(this.formSearch).forEach((prop) => {
            //     const ctx = this.formSearch[prop];

            //     switch (typeof ctx) {
            //         case "boolean": {
            //             formData.append(prop, ctx ? "on" : "");
            //             break;
            //         }
            //         case "string": {
            //             formData.append(prop, ctx);
            //             break;
            //         }
            //         case "object": {
            //             if (Array.isArray(ctx)) {
            //                 formData.append(prop, ctx.join());
            //             } else {
            //                 formData.append(prop, "");
            //             }

            //             break;
            //         }
            //         default: {
            //             formData.append(prop, "");
            //             break;
            //         }
            //     }
            // });

            // Handle rewrtie
            const isRewriteUrl = rewriteUrl(formData, url_param);
            console.log({ isRewriteUrl });
            if (!isRewriteUrl && !is_init) return (is_wait.search = false), console.warn("Reject get method cause same param!");

            // formData.forEach((val, key) => (url_param[key] = val));

            // const newUrl = new URLSearchParams(url_param);
            // console.log(`${location.search}\n?${newUrl}\nis_same: ${location.search == "?" + newUrl}`);

            // if (!is_init && location.search == "?" + newUrl) {
            //     is_wait.search = false;
            //     return console.log("same data...");
            // }

            // window.history.pushState([], "", "?" + newUrl);

            // console.log(this.formSearch);
            // console.log({ url_param });

            const res = await fetch(db_path + "search", {
                method: "POST",
                body: formData,
            });

            const text = await res.text();

            encodeFetchedJson(text, null, (json) => {
                const { status, msg, data, pagination, query_page, query } = json;

                console.log(query);
                this.transactions = data;
                Object.assign(this.page, pagination);
            });

            is_wait.search = false;
        },
        async edit() {
            const formData = new FormData(form);
            formData.append("id", this.form.id);
            formData.append("prev_payment_method", this.form.prev_payment_method);
            formData.append("prev_payment_status", this.form.prev_payment_status);

            const res = await fetch(db_path + "edit", {
                method: "POST",
                body: formData,
            });
            const text = await res.text();

            encodeFetchedJson(text, "edit", async () => {
                await this.get(null, true);
            });

            // try {
            //     const json = JSON.parse(text);
            //     console.log(json);
            //     const { status, msg, data } = json;

            //     if (!status) throw new Error(msg);

            //     Swal.fire({ title: "Selamat", icon: "success", text: msg });
            // } catch (e) {
            //     console.log("Error while fetching:", text, { e });
            //     Swal.fire({
            //         title: "Error",
            //         icon: "error",
            //         text: "Terjadi kesalahan saat fetching: " + e.message,
            //     });
            // }

            // await this.get(this.page.page, true);
        },
        async remove({ id }) {
            if (!id) return;

            const { isConfirmed } = await Swal.fire({
                ...deafultConfirmProps,
                title: "Yakin ingin hapus transaksi?",
                text: "Transaksi yang dihapus tidak bisa di kembalikan!",
            });

            if (!isConfirmed) return;

            const formData = new FormData();
            // console.log({ id });
            formData.append("id", id);

            const res = await fetch(db_path + "remove", {
                method: "POST",
                body: formData,
            });
            const text = await res.text();

            encodeFetchedJson(text, "remove", async ({ msg } = {}) => {
                Swal.fire({ title: "Selamat", icon: "success", text: msg });
                await this.get(null, true);
            });
        },

        openModal() {
            this.form = {
                id: null,
                total: null,
                date: null,
                payment_method: null,
                payment_status: null,

                prev_payment_method: null,
                prev_payment_status: null,
            };

            this.isOpenModal = true;
        },
        selectEdit(transaction) {
            if (!transaction.id) return console.log("not id");

            console.log("set id");

            this.openModal();
            const data = {
                ...this.form,
                ...transaction,
                prev_payment_method: transaction.payment_method,
                prev_payment_status: transaction.payment_status,
            };
            this.form = data;

            // console.log({ data, transaction });
        },
        openModalDetail(detail) {
            // console.log(detail.td);
            // console.log(JSON.stringify(detail));

            try {
                console.log(JSON.parse(detail.td));
            } catch (e) {}
            this.detail = detail;
            this.isOpenDetailModal = true;
        },
        async bayar({ id } = {}) {
            if (isNaN(id)) return console.warn("Id harus berupa number!");

            const { isConfirmed } = await Swal.fire({
                ...deafultConfirmProps,
                title: "Konfirmasi",
                text: "Yakin ingin ubah status transaksi menjadi Sudah dibayar?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, Ubah!",
            });

            if (!isConfirmed) return;

            const formData = new FormData();

            formData.append("id", id);

            encodeFetchedJson(await (await fetch(db_path + "transaction-status-to-bayar", { method: "POST", body: formData })).text(), "ubah-status-transaksi", async () => {
                await this.get(null, true);
            });
        },

        get syncTransactionStatus() {
            return is_wait.syncTransactionStatus;
        },

        async syncTransactionStatus({ id, payment_key } = {}) {
            if (!id || !payment_key) return;

            if (is_wait.syncTransactionStatus) return Swal.fire({ ...defaultErrorProps, text: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });

            is_wait.syncTransactionStatus = true;

            // check cache for to much re-request
            const now = Date.now();
            const cache_name = "cache-syncTransaction";
            const _cache = {};
            try {
                const _json = JSON.parse(localStorage.getItem(cache_name));
                Object.assign(_cache, _json);
            } catch (e) {}

            // formula: 1 hour
            if (_cache[id] && !isNaN(_cache[id]) && _cache[id] - now < 1000 * 60 * 60) {
                const times = calculateTimeDifference(_cache[id], now);

                const { isConfirmed } = await Swal.fire({ ...deafultConfirmProps, title: "Yakin ingin sync status nya lagi?", text: `Aksi yang sama baru saja di lakukan ${times.minutes > 0 ? times.minutes + " menit" : times.seconds + " detik"} yang lalu.` });

                console.log("confirm:", isConfirmed);
                if (!isConfirmed) return (is_wait.syncTransactionStatus = false);
            }

            const formData = new FormData();
            formData.append("payment_key", payment_key);

            Object.assign(_cache, { [id]: now });
            localStorage.setItem(cache_name, JSON.stringify(_cache));
            encodeFetchedJson(await (await fetch(db_path + "check-status", { method: "POST", body: formData })).text(), "sync-status", () => {
                this.get(null, true);
            });

            console.log({ _cache, cache_name });

            is_wait.syncTransactionStatus = false;
        },

        async remakeTransaction(transaction) {
            const { id, payment_key, payment_status, total, payment_method, transaction_details } = transaction;

            if (!id || !payment_key || !payment_status || !total || !payment_method || !transaction_details) return;

            if (!is_wait.remakeTransaction) return Swal.fire({ ...defaultErrorProps, text: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!" });

            is_wait.remakeTransaction = true;

            const formData = new FormData();

            const _data = { ...transaction };
            delete _data.transaction_details;
            // const _context = { ..._data, cart: transaction.transaction_details };
            // console.log({ transaction });
            bindAndFillFormData(formData, _data);
            formData.append("cart", JSON.stringify(transaction.transaction_details));

            encodeFetchedJson(await (await fetch(db_path + "remake-transaction", { method: "POST", body: formData })).text(), "Remake Transaction", (json) => {
                // console.log(json);
                this.get(null, true);
            });
            is_wait.remakeTransaction = false;
        },

        openStruct(product) {
            if (!product?.id) return;

            this.struk = {};
            this.struk = { ...product };

            this.isOpenStructModal = true;
        },

        async print() {
            print();
            // const { jsPDF } = window.jspdf || {};

            // if (!jsPDF) return;

            // const doc = new jsPDF();

            // this.whilePrint = true;
            // await sleep(200);

            // const element = document.querySelector("#print-modal");
            // console.log(element);

            // const canvas = await html2canvas(element);
            // const imgData = canvas.toDataURL("image/png");

            // const imgProps = doc.getImageProperties(imgData);
            // const pdfWidth = doc.internal.pageSize.getWidth();
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            // doc.save("laporan.pdf");

            // this.whilePrint = false;
        },
    };
}
