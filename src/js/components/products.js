import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps, defaultErrorProps, defaultSuccessProps } from "../libs/swal2props.js";

export default function () {
    const db_path = "./src/php/products.php?m=";
    const form = document.querySelector("#form-main");
    const inputFileEl = document.querySelector("#dropzone-file");

    let is_wait = {
        get: false,
        add: false,
        edit: false,
    };

    return {
        categories: {},
        categories_keys: [],
        items: [],
        products: [],
        form: {
            id: null,
            name: null,
            description: null,
            purchase_price: null,
            price: null,

            category: null,
            subcategory: null,
            prevImage: null,
        },
        editedProduct: {},
        isOpenModal: false,
        isOpenImageModal: false,
        imageModal: null,
        srcUploadedImage: null,
        formSearch: {
            filters: ["name", "purchase_price", "price", "category", "subcategory"],
            categories: {},
            sort_desc: true,
            keyword: null,
        },
        page: new Pagination(),

        async init() {
            this.$watch("form.price", (curr, prev) => {
                if (isNaN(curr) || isNaN(prev)) return;

                console.log({ curr, prev });

                if (prev - 1 == curr) this.form.price = prev - 1000;
                else if (prev - 0 + 1 == curr) this.form.price = prev - 0 + 1000;
            });

            this.$watch("form.purchase_price", (curr, prev) => {
                if (isNaN(curr) || isNaN(prev)) return;

                console.log({ curr, prev });

                if (prev - 1 == curr) this.form.purchase_price = prev - 1000;
                else if (prev - 0 + 1 == curr) this.form.purchase_price = prev - 0 + 1000;
            });

            await this.getCategories();
            console.log("FORMSEARCH before", this.formSearch);

            // set filter by url param
            fillFormsByUrlParam(
                {
                    array: [...[...Object.keys(this.categories).map((key) => "categories." + key)], "filters"],
                    // array: ["filters"],
                    string: ["keyword"],
                    int: "page",
                    boolean: "sort_desc",
                },
                this.formSearch,
                url_param
            );

            // console.log("FORMSEARCH after", this.formSearch);

            await this.get(null, true);
        },

        async getCategories() {
            encodeFetchedJson(await (await fetch(db_path + "get-categories")).text(), null, (json) => {
                const { categories } = json;

                console.log({ json });

                const keys = Object.keys(categories);
                this.categories_keys = keys;

                console.log({ keys });

                // handle dynamic formsearch categories
                keys.forEach((key) => (this.formSearch.categories[key] = []));

                this.categories = categories;
            });
        },

        async get(page, is_init = false) {
            if (is_wait.get) return console.warn("Reject get method cause spam!");

            is_wait.get = true;

            if (!this.formSearch.filters.length) return Swal.fire({ ...defaultErrorProps, text: "Isi minimal 1 filter! (kecuali sorting terbalik)!" });

            // prepare search param
            const formData = new FormData();
            formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);
            bindAndFillFormData(formData, this.formSearch);
            console.log(this.formSearch);

            // filter | same param = same result
            const isSame = rewriteUrl(formData, url_param);
            if (!isSame && !is_init) return (is_wait.get = false), console.warn("Reject get method cause same param!");

            encodeFetchedJson(await (await fetch(db_path + "search", { method: "POST", body: formData })).text(), null, ({ data, pagination, query } = json) => {
                this.products = data;
                console.log(query);

                Object.assign(this.page, pagination);

                if (pagination.total_data && page && this.page.page != page) {
                    Swal.fire({ ...defaultErrorProps, text: "Tidak ada halaman " + page });
                }
            });

            is_wait.get = false;
            // if (typeof page == "undefined") this.getCategories();
        },
        async add() {
            if (is_wait.add) return console.warn("Reject add method cause spam!");
            is_wait.add = true;

            const formData = new FormData(form);
            bindAndFillFormData(formData, this.form);

            encodeFetchedJson(await (await fetch(db_path + "add", { method: "POST", body: formData })).text(), "add", async () => {
                // looking 4 new categories
                if (
                    !this.categories_keys.includes(this.form.category) ||
                    !this.categories_keys
                        .map((key) => this.categories[key])
                        .flat()
                        .includes(this.form.subcategory)
                ) {
                    await this.getCategories();
                }
            });

            this.isOpenModal = false;
            is_wait.add = false;

            await this.get(null, true);
        },
        async edit() {
            const formData = new FormData(form);
            bindAndFillFormData(formData, this.form);
            bindAndFillFormData(formData, this.editedProduct, "prev");

            // Handle prev data
            const prevProduct = this.products.find(({ id }) => this.form.id == id);

            if (!prevProduct) return Swal.fire({ ...defaultErrorProps, text: "Product tidak ditemukan!" });

            formData.append("prevPrice", prevProduct.price);
            formData.append("prevPurchasePrice", prevProduct.purchase_price);

            encodeFetchedJson(await (await fetch(db_path + "edit", { method: "POST", body: formData })).text(), "edit");

            // const res = await fetch(db_path + "edit", {
            //     method: "POST",
            //     body: formData,
            // });

            // const text = await res.text();

            // try {
            //     const json = JSON.parse(text);
            //     const { status, msg } = json;
            //     console.log(json);

            //     if (!status) throw new Error(msg);

            //     this.get();
            //     Swal.fire({
            //         icon: "success",
            //         title: "Selamat",
            //         text: msg,
            //         didOpen: this.didOpen,
            //     });
            // } catch (e) {
            //     console.error("Error while parsing json:", text);
            //     Swal.fire({
            //         icon: "error",
            //         title: "Error",
            //         text: "Terjadi kesalahan saat edit barang! Pesan kesalahan: " + e.message,
            //         didOpen: this.didOpen,
            //     });
            // }
            this.isOpenModal = false;
            is_wait.edit = false;

            await this.get(null, true);
        },
        async remove({ id, origin_id } = {}) {
            if (!id || !origin_id) return;

            const { isConfirmed } = await Swal.fire({
                ...deafultConfirmProps,
                title: "Yakin ingin hapus item?",
                text: "Produk yang dihapus tidak bisa di kembalikan!",
                icon: "warning",
                confirmButtonText: "Ya, saya yakin!",
            });

            if (!isConfirmed) return;

            const formData = new FormData();
            formData.append("id", id);
            formData.append("origin_id", origin_id);

            encodeFetchedJson(await (await fetch(db_path + "remove", { method: "POST", body: formData })).text(), "Hapus Produk");

            // .then(async (result) => {
            //     if (result.isConfirmed) {
            //         const body = new FormData();
            //         body.append("id", id);

            //         await fetch(db_path + "remove", { method: "POST", body })
            //             .then((res) => res.text())
            //             .then((res) => {
            //                 const { status, msg } = JSON.parse(res);

            //                 if (!status) throw new Error(msg);

            //                 Swal.fire({
            //                     title: "Selamat",
            //                     icon: "success",
            //                     text: msg,
            //                     didOpen: this.didOpen,
            //                 });
            //             })
            //             .catch((e) => {
            //                 console.log("error while deleting item.", e);
            //                 Swal.fire({
            //                     title: "Error",
            //                     icon: "error",
            //                     text: "Terjadi kesalahan saat edit barang! Pesan kesalahan: " + e.message,
            //                     didOpen: this.didOpen,
            //                 });
            //             });

            //         this.get();
            //     }
            // });

            await this.get(null, true);
        },

        openModal() {
            this.form = {
                id: null,
                name: null,
                description: null,
                purchase_price: null,
                price: null,

                category: null,
                subcategory: null,

                prevImage: null,
            };

            this.resetUploadedImage();

            this.isOpenModal = true;
        },
        openImageModal({ image }) {
            if (!image) return;

            this.imageModal = image;
            this.isOpenImageModal = true;
        },
        selectEditItem(item) {
            if (item.id) {
                this.form = { ...this.form, ...item, prevImage: item.image || "" };
                this.editedProduct = {};
                this.editedProduct = { ...item };
            }

            this.resetUploadedImage();

            this.isOpenModal = true;
        },
        dropHandler(e) {
            console.log("File(s) dropped");

            // Prevent default behavior (Prevent file from being opened)
            e.preventDefault();

            if (!e.dataTransfer.items) return;

            this.handleFile(e.dataTransfer.items);
        },

        dragOverHandler(ev) {
            console.log("File(s) in drop zone");

            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
        },
        onInputDropZoneFile(e) {
            // console.log(e.target.files)

            this.handleFile(e.target.files);
        },
        handleFile(files) {
            const fileRaw = files?.[0];

            const file = fileRaw?.constructor?.name == "DataTransferItem" ? fileRaw.getAsFile() : fileRaw;

            if (!file) return;

            if (!/^image\/(webp|png|jpg|jpeg)$/.test(file.type)) {
                const error = "Type tidak valid!\nType yang barusan di upload:" + file.type;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error,
                });
                return console.log(error);
            }

            const reader = new FileReader();
            reader.onload = () => {
                this.srcUploadedImage = reader.result;
            };

            reader.readAsDataURL(file);
            const fileList = new DataTransfer();
            fileList.items.add(file);
            inputFileEl.files = fileList.files;
        },
        resetUploadedImage() {
            this.srcUploadedImage = null;
            inputFileEl.value = null;

            console.log("RESET");
        },

        setPaginationButton() {
            const { page, total_data, total_page, max_data, max_button } = this.page;

            const buttons =
                ((total_page <= max_button || page - ~~(max_button / 2) < ~~(max_button / 2)) &&
                    (console.error("case 1") ||
                        Array(total_page <= max_button ? total_page : max_button)
                            .fill(2)
                            .map((_, i) => i + 1))) ||
                (page <= total_page - ~~(max_button / 2) &&
                    (console.error("case 2") ||
                        Array(max_button)
                            .fill(2)
                            .map((_, i) => i + page - ~~(max_button / 2)))) ||
                console.error("case 3") ||
                Array(max_button)
                    .fill(2)
                    .map((_, i) => total_page - max_button + 1 + i);

            this.page.buttons = buttons;

            return console.warn(buttons) || buttons;
        },
    };
}
