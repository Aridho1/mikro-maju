import encodeFetchedJson from "../libs/encodeFetchedJson.js";

export default function () {
    const form = document.querySelector("#form-transaction");
    const db_path = "./src/php/";

    const is_wait = {
        submit: false,
    };

    // const CATEGORIES = {
    //     'Makanan': [
    //         'Nasi Goreng',
    //         'Ayam',
    //         'Lele',
    //     ],
    //     'Minuman': [
    //         'Teh',
    //         'kopi',
    //         'Macca',
    //     ],
    //     'Disert': [],
    // }

    // const C = {
    //     'Makanan': {
    //         'Nasi Goreng': true,
    //         'Ayam': true,
    //         'Lele': false,
    //     },
    //     'Minuman': {
    //         'Teh': true,
    //         'kopi': true,
    //         'Macca': false,
    //     },
    //     'Disert': {},
    // }

    const el_form_filter_category = document.querySelector("#filter-category");

    return {
        items: [],
        products: [],
        filteredProducts: [],
        categories: {},
        filterCategories: {},
        cart: [],
        quantity: 0,
        total: 0,

        async init() {
            // Handle get products
            encodeFetchedJson(await (await fetch(db_path + "products.php?m=get")).text(), false, (json) => {
                // const { data } = json
                this.products = json.data || [];
                this.getCart();
            });

            // Handle get categories
            encodeFetchedJson(await (await fetch(db_path + "products.php?m=get-categories")).text(), false, (json) => {
                this.categories = json.categories;

                // Handle localstorage & filter categories
                Object.keys(this.categories).forEach((key) => {
                    this.filterCategories[key] = {
                        enabled: false,
                        items: [],
                    };
                });

                const local = this.getStorageFilterCategories() ?? {};

                if (local && typeof localStorage == "object") Object.assign(this.filterCategories, local);
            });

            this.$watch("filterCategories", () => {
                this.setStorageFilterCategories();
            });

            // Handle quantity & storage
            let qty = 0;

            this.cart.forEach(({ quantity, sub_total }) => {
                qty += quantity;
                this.total += sub_total;
            });

            this.quantity = qty;
        },

        filterCategory(e) {
            const category = e?.target?.name?.split(/^filter-category-/)[1];

            if (!category) return;

            if (!e.target.checked) {
                delete this.filterCategories[category];
            } else this.filterCategories[category] = {};
        },

        filterSubcategory(e) {
            const subcategory = e?.target?.name?.split(/^filter-subcategory-/)[1];
            const category = e?.target?.dataset?.category;

            if (!subcategory || !category) return;

            if (!this.filterCategories[category]) return;

            this.filterCategories[category][subcategory] = e.target.checked;
        },

        async submit({ target } = {}) {
            if (!target) return console.error("Missing target");

            if (is_wait.submit) return console.warn("Cancel method cause spam!");

            if (!this.total)
                return Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Pilih setidaknya 1 produk!",
                });

            is_wait.submit = true;

            const { cart } = this;

            const formData = new FormData(target);
            formData.append("cart", JSON.stringify(cart));

            const res = await fetch(db_path + "transactions.php?m=add", {
                method: "POST",
                body: formData,
            });
            const text = await res.text();

            encodeFetchedJson(text, "Tambah Transaksi", ({ transaction_respon: { res: { token } = {} } = {} }) => {
                // Swal.fire({ title: "Selamat", icon: "success", text: msg, didOpen })
                this.clear();

                setTimeout(() => {
                    window.open(`?c=transactions&get_newest_struk=true`, "_blank");
                }, 2000);

                // Redirect
                // if (token) window.open("pay.html?token=" + token, "_blank");
            });

            is_wait.submit = false;
        },
        clear() {
            this.cart = [];
            this.quantity = 0;
            this.total = 0;
            this.setCart();
        },
        selectItem(item) {
            console.log({ cart: this.cart, item });

            const cart = this.cart?.find(({ id }) => id == item.id);

            if (!cart) {
                item = {
                    ...item,
                    quantity: item.quantity - 0,
                    price: item.price - 0,
                };
                this.cart.push({ ...item, quantity: 1, sub_total: item.price });
                this.quantity++;
                this.total += item.price;
            } else {
                this.cart = this.cart.map((_item) => {
                    if (_item.id == item.id) {
                        _item.quantity++;
                        _item.sub_total += item.price - 0;
                        this.quantity++;
                        this.total += item.price - 0;
                    }

                    return _item;
                });
            }
        },
        addQuantity({ id }) {
            this.cart = this.cart.map((item) => {
                if (item.id == id) {
                    item.quantity++;
                    item.sub_total += item.price - 0;
                    this.total += item.price - 0;
                }

                return item;
            });

            this.quantity++;
        },
        removeQuantity({ id }) {
            let isRemove = false;

            this.cart = this.cart.map((item) => {
                if (item.id == id) {
                    isRemove = --item.quantity == 0;
                    item.sub_total -= item.price;
                    this.quantity--;
                    this.total -= item.price;

                    if (isRemove) return false;
                }

                return item;
            });

            if (isRemove) this.cart = this.cart.filter((val) => val);
        },
        setCart() {
            console.log(this);
            localStorage.setItem("cart", JSON.stringify(this.cart));
            // console.log('set cart')
        },
        getCart() {
            const rawCart = localStorage.getItem("cart");

            try {
                this.cart = JSON.parse(rawCart) || [];
            } catch (e) {
                console.warn("cart error...", { rawCart, e });
            }

            // console.log('get cart')
        },

        getStorageFilterCategories() {
            const storage = localStorage.getItem("filterCategories");
            try {
                return JSON.parse(storage);
            } catch (e) {
                console.log(e, "storage:", storage);
            }
        },
        setStorageFilterCategories() {
            const data = this.filterCategories;
            localStorage.setItem("filterCategories", JSON.stringify(data));
        },
    };
}
