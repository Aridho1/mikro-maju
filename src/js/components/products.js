import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import Pagination from "../libs/pagination.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { url_param } from "../libs/urlParam.js";
import { deafultConfirmProps, defaultErrorProps, defaultSuccessProps } from "../libs/swal2props.js";
import { IDR } from "../libs/utils.js";
import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

const defaultWarningNotif = {
    variant: "warning",
    title: "Warning",
    message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!",
};

const defaultSuccessNotif = {
    variant: "success",
    title: "Selamat",
    message: "Mohon tunggu dan coba beberapa saat lagi. Sedang memproses aksi sebelumnya!",
};

export default function () {
    const dbPath = "./src/php/products.php?m=";
    const dbDiscountPath = "./src/php/product_discounts.php?m=";
    const dbStockPath = "./src/php/stock_adjustments.php?m=";

    const discountTypeMap = {
        percent: "Persen (%)",
        fixed: "Angka Fix",
    };
    const discountTypeKeys = Object.keys(discountTypeMap);
    const discountTypeList = discountTypeKeys.map((key) => discountTypeMap[key]);

    const tabMap = {
        product: "Produk",
        discount: "Diskon",
        stock: "Stok",
    };
    const tabKeys = Object.keys(tabMap);
    const tabList = tabKeys.map((key) => tabMap[key]);

    const stockReasonMap = {
        EXPIRED: "Kadaluarsa",
        DAMAGED: "Rusak",
        OPNAME: "Sinkron Data Fisik | OPNAME",
        MANUAL: "Manual / Yang Lainnya",
    };
    const stockReasonKeys = Object.keys(stockReasonMap);
    const stockReasonList = tabKeys.map((key) => tabMap[key]);

    const form = document.querySelector("#form-main");
    const inputFileEl = document.querySelector("#dropzone-file");

    // let is_wait = {
    // 	get: false,
    // 	add: false,
    // 	edit: false,
    // };

    return {
        tabMap,
        tabKeys,
        tabList,

        tabActive: tabKeys[0],

        categories: {},
        categories_keys: [],
        items: [],
        products: [],
        form: {
            id: null,
            name: null,
            // description: null,
            purchase_price: null,
            price: null,

            is_stockable: false,
            stock: null,

            category: null,
            subcategory: null,
            prevImage: null,
        },
        formattedPurchase_price: "",
        formattedPrice: "",

        editedProduct: {},
        isOpenModal: false,
        isOpenImageModal: false,
        imageModal: null,
        srcUploadedImage: null,
        formSearch: {
            filters: ["name", "purchase_price", "price", "category", "subcategory", "is_stockable"],
            categories: {},
            sort_desc: true,
            keyword: null,
        },
        page: new Pagination(),

        selectedProduct: {},

        // discount props
        productDiscounts: [],
        formDiscount: {
            id: null,
            product_id: null,
            type: discountTypeKeys[0],
            value: null,
            start_date: null,
            end_date: null,
        },
        formattedDiscountValue: "",
        discountTypeMap,
        discountTypeKeys,
        discountTypeList,
        isOpenModalDiscount: false,
        selectedDiscount: {
            discountList: [],
        },
        discountList: [],
        isFetchingDiscountHistory: false,

        stocks: [],
        formStock: {
            id: null,
            product_id: null,
            quantity: 0,
            reason: stockReasonKeys.at(-1),
            note: null,

            total: 0,
        },
        stockNote: null,
        stockQuantityManual: null,
        isProductsShouldbeResfrefhed: false,
        stockReasonMap,
        stockReasonKeys,
        stockReasonList,

        isOpenModalStock: false,
        selectedStock: {},
        stockList: [],
        get groupedStocks() {
            return this.stockList.reduce((acc, stock) => {
                const splited = stock.timestamp.split(" ");
                const date = splited[0]; // ambil YYYY-MM-DD
                stock.date = date;
                stock.time = splited[1]; // ambil HH:MM:SS

                if (!acc[date]) acc[date] = [];
                acc[date].push(stock);

                return acc;
            }, {});
        },
        isFetchingStockHistory: false,

        selectProduct(product) {
            const _product = this.products.find(({ id }) => id == product?.id);
            if (!_product) return console.warn(`Product with id ${product?.id} is not found!`, this.products);

            return (this.selectedProduct = { ..._product });
            // return (this.selectedProduct = structuredClone(_product));
        },

        async getDiscountHistory() {
            if (isNaN(this.selectedProduct?.id)) return console.warn(`selected product is not found!`);

            q.add(
                "get-history-discount",
                async () => {
                    this.isFetchingDiscountHistory = true;

                    const formData = new FormData();
                    formData.append("id", this.selectedProduct.id);

                    encodeFetchedJson(await (await fetch(dbDiscountPath + "get-discounts-by-product-id", { method: "POST", body: formData })).text(), "Fetching Riwayat Diskon Produk", ({ data }) => {
                        if (data) this.discountList = data;
                    });

                    this.isFetchingDiscountHistory = false;
                },
                { cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) },
            );

            return;

            // if (!this.products.some(({ id }) => productId == id)) return console.warn(`Product with id ${productId} is not found!`);
            const product = this.products.find(({ id }) => id == productId);
            if (!product) return console.warn(`Product with id ${productId} is not found!`);

            return;
            if (!this.selectedDiscount) return console.warn(`selected discount is not found!`);

            Object.assign(this.selectedDiscount, product);

            this.isFetchingDiscountHistory = true;

            q.add("get-history-discount", async () => {
                const formData = new FormData();
                formData.append("id", productId);

                encodeFetchedJson(await (await fetch(dbStockPath + "get-discounts-by-product-id", { method: "POST", body: formData })).text(), "Fetching History Diskon Produk", ({ data }) => {
                    if (!this.selectedDiscount?.discountList) return console.warn(`selected discount is gone!`);
                    this.selectedDiscount.discountList = data;
                });
            });

            this.isFetchingDiscountHistory = false;
        },

        async getStockHistory(productId) {
            if (isNaN(this.selectedProduct?.id)) return console.warn(`selected product is not found!`);

            q.add(
                "get-history-stock",
                async () => {
                    this.isFetchingStockHistory = true;

                    const formData = new FormData();
                    formData.append("id", this.selectedProduct.id);

                    encodeFetchedJson(await (await fetch(dbStockPath + "get-stocks-by-product-id", { method: "POST", body: formData })).text(), "Fetching Riwayat Stok Produk", async ({ data }) => {
                        if (data) {
                            this.stockList = data;

                            console.warn("groupedStocks", this.groupedStocks);
                        }
                    });

                    this.isFetchingStockHistory = false;
                },
                { cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) },
            );
        },

        selectDiscountProduct(product) {
            const selected = this.selectProduct(product);
            if (!selected) return console.warn(`selected product is not found!`);

            this.getDiscountHistory();
            this.tabActive = tabKeys[1];
            return;

            this.selectedDiscount = { ...selected, discountList: [] };

            this.getDiscountHistory(product.id);
            this.tabActive = tabKeys[1];

            console.log(this.selectedDiscount);
        },

        selectStockProduct(product, isJustSelect = false) {
            const selected = this.selectProduct(product);
            if (!selected) return console.warn(`selected product is not found!`);

            this.stockQuantityManual = null;

            if (isJustSelect) return;

            this.formStock.total = this.selectedProduct.stock;

            this.getStockHistory();
            this.tabActive = tabKeys[2];

            const formData = new FormData();
            formData.append("pid", this.selectedProduct.id);

            rewriteUrl(formData, url_param);

            return;
        },

        openModalDiscount() {
            // if (this.selectedDiscount.discount_id) return this.$dispatch("notify", { ...defaultWarningNotif, title: "(Warning) Gagal membuka form", message: "Produk ini masih memiliki discount yang aktif!" });

            this.formDiscount = {
                ...this.formDiscount,
                id: null,
                product_id: null,
                value: null,
                start_date: null,
                end_date: null,
            };

            this.isOpenModalDiscount = true;
        },

        openModalStock() {
            // if (this.selectedDiscount.discount_id) return this.$dispatch("notify", { ...defaultWarningNotif, title: "(Warning) Gagal membuka form", message: "Produk ini masih memiliki discount yang aktif!" });

            this.formStock = {
                ...this.formStock,
                id: null,
                product_id: null,
                quantity: 0,
                // reason: stockReasonKeys.at(-1),
                note: null,
            };

            this.isOpenModalStock = true;
        },

        async addDiscount() {
            if (isNaN(this.selectedProduct?.id)) return console.warn(`selected product is not found!`);

            q.add(
                "add-discount",
                async () => {
                    const formData = new FormData();
                    bindAndFillFormData(formData, this.formDiscount);
                    formData.append("product_id", this.selectedProduct.id);

                    encodeFetchedJson(
                        await (await fetch(dbDiscountPath + "add", { method: "POST", body: formData })).text(),
                        "Tambah Diskon",
                        async ({ msg: message } = {}) => {
                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });

                            await this.getDiscountHistory();
                        },
                        {
                            swalSuccess: false,
                        },
                    );

                    this.isOpenModalDiscount = false;
                },
                { cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) },
            );
        },

        async addStock() {
            if (isNaN(this.selectedProduct?.id)) return console.warn(`selected product is not found!`);

            q.add(
                "add-stock",
                async () => {
                    const formData = new FormData();
                    bindAndFillFormData(formData, this.formStock);
                    formData.append("product_id", this.selectedProduct.id);

                    encodeFetchedJson(
                        await (await fetch(dbStockPath + "add", { method: "POST", body: formData })).text(),
                        "Tambah Stok",
                        async (res) => {
                            const { msg: message, current_stock: currentStock } = res;
                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });

                            console.warn(res);

                            if (!isNaN(currentStock) && this.selectedProduct.stock != currentStock) {
                                this.isProductsShouldbeResfrefhed = true;
                                // console.log(this.selectedProduct);
                                this.selectedProduct.stock = +currentStock;
                                // console.warn({ currentStock });
                                // console.log(this.selectedProduct);
                            }

                            await this.getStockHistory();
                        },
                        {
                            swalSuccess: false,
                        },
                    );

                    this.isOpenModalStock = false;
                },
                { cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) },
            );
        },

        async removeDiscount({ id } = {}) {
            if (!id) return;

            q.add(
                "remove-discount",
                async () => {
                    const { isConfirmed } = await Swal.fire({
                        ...deafultConfirmProps,
                        title: "Yakin ingin hapus Diskon ini?",
                        text: "Diskon yang dihapus tidak bisa di kembalikan!",
                        icon: "warning",
                        confirmButtonText: "Ya, saya yakin!",
                    });

                    if (!isConfirmed) return;

                    const formData = new FormData();
                    formData.append("id", id);

                    encodeFetchedJson(
                        await (await fetch(dbDiscountPath + "remove", { method: "POST", body: formData })).text(),
                        "Hapus Diskon",
                        async ({ msg: message } = {}) => {
                            await this.getDiscountHistory(this.selectedDiscount.id);

                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });
                        },
                        { swalSuccess: false },
                    );
                },
                {
                    cancelIfAlreadyInQueue: true,
                    callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
                },
            );
        },
        async stopDiscount({ id, is_active } = {}) {
            if (!id) return;

            console.log({ id, is_active });

            q.add(
                "stop-discount",
                async () => {
                    const { isConfirmed } = await Swal.fire({
                        ...deafultConfirmProps,
                        title: "Yakin ingin stop Diskon ini?",
                        text: "Diskon yang distop tidak bisa di kembalikan!",
                        icon: "warning",
                        confirmButtonText: "Ya, saya yakin!",
                    });

                    if (!isConfirmed) return;

                    const formData = new FormData();
                    formData.append("id", id);

                    encodeFetchedJson(
                        await (await fetch(dbDiscountPath + "stop-discount", { method: "POST", body: formData })).text(),
                        "Stop Diskon",
                        async ({ msg: message } = {}) => {
                            await this.getDiscountHistory(this.selectedDiscount.id);

                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });
                        },
                        { swalSuccess: false },
                    );
                },
                {
                    cancelIfAlreadyInQueue: true,
                    callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
                },
            );
        },

        async init() {
            this.$watch("formStock.total", (curr, prev) => {
                if (curr == prev || isNaN(this.selectedProduct?.stock) || this.formStock.quantity + this.selectedProduct.stock == curr) return;

                this.formStock.quantity = curr - this.selectedProduct.stock;
                console.warn("formStock total", { curr, prev });
            });

            this.$watch("formStock.quantity", (curr, prev) => {
                if (curr == prev || isNaN(this.selectedProduct?.stock) || this.formStock.total - this.selectedProduct.stock == curr) return;

                this.formStock.total = +curr + +this.selectedProduct.stock;
            });

            this.$watch("tabActive", async (curr, prev) => {
                console.log("tabActive", { curr, prev });

                if (curr == prev) return;

                if (curr == tabKeys[0] && this.isProductsShouldbeResfrefhed) {
                    await this.get(this.page.page, true);
                    this.isProductsShouldbeResfrefhed = false;

                    // handle selected product stock
                    // if (isNaN(this.selectedProduct?.id)) return;
                    // this.selectStockProduct(this.selectedProduct.id, true);
                }

                // console.error("tabActive changed", { curr, prev, tabKeys, "curr == tabKeys[2]": curr == tabKeys[2], "isNaN(this.selectedProduct?.id": isNaN(this.selectedProduct?.id), "!this.selectedProduct.is_stockable": !this.selectedProduct.is_stockable });
                // check is stockble
                if (curr == tabKeys[2] && (isNaN(this.selectedProduct?.id) || !this.selectedProduct.is_stockable)) return ((this.tabActive = prev), console.error(`not stockable product`, this.selectedProduct));

                const formData = new FormData();
                formData.append("tab", curr);

                rewriteUrl(formData, url_param);
            });

            this.$watch("formattedDiscountValue", (value) => {
                value ??= "";
                const _value = value.replace(/\D/g, "");
                this.formattedDiscountValue = IDR.format(_value);
                this.formDiscount.value = _value;
            });

            this.$watch("formattedPrice", (value) => {
                value ??= "";
                const _value = value.replace(/\D/g, "");
                this.formattedPrice = IDR.format(_value);
                this.form.price = _value;
            });

            this.$watch("formattedPurchase_price", (value) => {
                value ??= "";
                const _value = value.replace(/\D/g, "");
                this.formattedPurchase_price = IDR.format(_value);
                this.form.purchase_price = _value;
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
                url_param,
            );

            // console.log("FORMSEARCH after", this.formSearch);

            await this.get(null, true);

            let waitAble = false;

            const timer = setInterval(() => {
                if (!this.products.length || waitAble) return;

                waitAble = true;

                console.error("sudah di wait");

                const tab = url_param["tab"];
                const pid = url_param["pid"];

                if (pid && isNaN(this.selectedProduct?.id)) {
                    console.error("set selected produk in init", { pid });
                    // this.selectStockProduct({ id: pid }, tab != tabKeys[2]);

                    switch (tab) {
                        case tabKeys[0]:
                            this.selectProduct({ id: pid });
                            break;
                        case tabKeys[1]:
                            this.selectDiscountProduct({ id: pid });
                            break;
                        case tabKeys[2]:
                            this.selectStockProduct({ id: pid });
                            break;
                        default:
                            break;
                    }

                    console.error("selected produ", this.selectedProduct);
                } else console.error("not set selected produk in init");

                if (tab && tabKeys.includes(tab) && this.tabActive != tab) this.tabActive = tab;

                clearInterval(timer);
            }, 200);
        },

        async getCategories() {
            encodeFetchedJson(await (await fetch(dbPath + "get-categories")).text(), null, (json) => {
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
            q.add(
                "get",
                async () => {
                    if (!this.formSearch.filters.length) return Swal.fire({ ...defaultErrorProps, text: "Isi minimal 1 filter! (kecuali sorting terbalik)!" });

                    const formData = new FormData();
                    formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

                    // Asign x-model to post body | formdata
                    bindAndFillFormData(formData, this.formSearch);

                    if (!is_init) formData.append("page", page && !isNaN(page) ? page : this.page.page || 1);

                    // Handle rewrtie
                    const isRewriteUrl = rewriteUrl(formData, url_param);

                    if (!isRewriteUrl && !is_init) return console.warn("Reject get method cause same param!");

                    const apiMethod = "search-v2";

                    encodeFetchedJson(await (await fetch(dbPath + apiMethod, { method: "POST", body: formData })).text(), "Fetching List Produk", ({ data, pagination }) => {
                        //
                        this.products = data.map((p) => {
                            p.is_stockable = p.is_stockable != "0";

                            return p;
                        });
                        Object.assign(this.page, pagination);
                    });
                },
                { cancelIfAlreadyInQueue: true, callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif) },
            );

            return;
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
            if (!isSame && !is_init) return ((is_wait.get = false), console.warn("Reject get method cause same param!"));

            encodeFetchedJson(await (await fetch(dbPath + "search", { method: "POST", body: formData })).text(), null, ({ data, pagination, query } = json) => {
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
            q.add(
                "add-product",
                async () => {
                    const formData = new FormData(form);

                    console.log("this.formaaa", this.form);

                    bindAndFillFormData(formData, this.form);

                    encodeFetchedJson(
                        await (await fetch(dbPath + "add", { method: "POST", body: formData })).text(),
                        "Tambah Produk",
                        async ({ msg: message }) => {
                            // looking 4 new categories
                            if (!this.categories_keys.includes(this.form.category)) {
                                await this.getCategories();
                            }
                            // if (
                            // 	!this.categories_keys.includes(this.form.category) ||
                            // 	!this.categories_keys
                            // 		.map((key) => this.categories[key])
                            // 		.flat()
                            // 		.includes(this.form.subcategory)
                            // ) {
                            // 	await this.getCategories();
                            // }
                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });
                        },
                        {
                            swalSuccess: false,
                        },
                    );

                    await this.get(null, true);
                    this.isOpenModal = false;
                },
                {
                    cancelIfAlreadyInQueue: true,
                    callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
                },
            );

            return;
            if (is_wait.add) return console.warn("Reject add method cause spam!");
            is_wait.add = true;

            const formData = new FormData(form);
            bindAndFillFormData(formData, this.form);

            encodeFetchedJson(await (await fetch(dbPath + "add", { method: "POST", body: formData })).text(), "add", async () => {
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
            q.add(
                "edit-product",
                async () => {
                    if (this.editedProduct.discountList?.length) {
                        const { isConfirmed } = await Swal.fire({
                            ...deafultConfirmProps,
                            title: "Yakin ingin edit Product ini?",
                            text: "Jika harganya diubah, diskon lama akan hilang!",
                            icon: "warning",
                            confirmButtonText: "Ya, saya yakin!",
                        });

                        if (!isConfirmed) return;
                    }

                    const formData = new FormData(form);
                    bindAndFillFormData(formData, this.form);
                    bindAndFillFormData(formData, this.editedProduct, "prev");

                    // Handle prev data
                    const prevProduct = this.products.find(({ id }) => this.form.id == id);

                    if (!prevProduct) return Swal.fire({ ...defaultErrorProps, text: "Product tidak ditemukan!" });

                    formData.append("prevPrice", prevProduct.price);
                    formData.append("prevPurchasePrice", prevProduct.purchase_price);

                    encodeFetchedJson(
                        await (await fetch(dbPath + "edit", { method: "POST", body: formData })).text(),
                        "Edit Produk",
                        ({ msg: message } = {}) => {
                            this.get(null, true);

                            if (message) this.$dispatch("notify", { variant: "success", title: "Selamat", message });
                        },
                        {
                            swalSuccess: false,
                        },
                    );

                    this.isOpenModal = false;
                },
                {
                    cancelIfAlreadyInQueue: true,
                    callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
                },
            );
            return;
            const formData = new FormData(form);
            bindAndFillFormData(formData, this.form);
            bindAndFillFormData(formData, this.editedProduct, "prev");

            // Handle prev data
            const prevProduct = this.products.find(({ id }) => this.form.id == id);

            if (!prevProduct) return Swal.fire({ ...defaultErrorProps, text: "Product tidak ditemukan!" });

            formData.append("prevPrice", prevProduct.price);
            formData.append("prevPurchasePrice", prevProduct.purchase_price);

            encodeFetchedJson(await (await fetch(dbPath + "edit", { method: "POST", body: formData })).text(), "edit");

            // const res = await fetch(dbPath + "edit", {
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
            if (!id || !origin_id) return console.warn("missing props");

            q.add(
                "remove",
                async () => {
                    const { isConfirmed } = await Swal.fire({
                        ...deafultConfirmProps,
                        title: "Yakin ingin hapus Product ini?",
                        text: "Produk yang dihapus tidak bisa di kembalikan!",
                        icon: "warning",
                        confirmButtonText: "Ya, saya yakin!",
                    });

                    if (!isConfirmed) return;

                    const formData = new FormData();
                    formData.append("id", id);
                    formData.append("origin_id", origin_id);

                    encodeFetchedJson(
                        await (await fetch(dbPath + "remove", { method: "POST", body: formData })).text(),
                        "Hapus Produk",
                        ({ msg: message } = {}) => {
                            this.get(null, true);

                            if (message) this.$dispatch("notify", { ...defaultSuccessNotif, message });
                        },
                        { swalSuccess: false },
                    );
                },
                {
                    cancelIfAlreadyInQueue: true,
                    callbackForCancelled: () => this.$dispatch("notify", defaultWarningNotif),
                },
            );

            return;
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

            encodeFetchedJson(await (await fetch(dbPath + "remove", { method: "POST", body: formData })).text(), "Hapus Produk");

            // .then(async (result) => {
            //     if (result.isConfirmed) {
            //         const body = new FormData();
            //         body.append("id", id);

            //         await fetch(dbPath + "remove", { method: "POST", body })
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
                ...this.form,
                id: null,
                name: null,
                // description: null,
                purchase_price: null,
                price: null,

                category: null,
                subcategory: null,

                prevImage: null,
            };

            this.formattedDiscountValue = null;
            this.formattedPurchase_price = null;

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

                console.log("item:", item);
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
