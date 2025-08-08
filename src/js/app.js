import encodeFetchedJson from "./libs/encodeFetchedJson.js";
import { deafultConfirmProps } from "./libs/swal2props.js";
import { url_param } from "./libs/urlParam.js";
import { getConfigJson } from "./libs/getConfigJson.js";

console.log("App");

const URL_PAY_QRIS = "https://simulator.sandbox.midtrans.com/v2/qris/payment/gopay";

const type = "sandbox";
const CLIENT_KEY = "SB-Mid-client-uj7hKX_GDknpM6wl";
const SERVER_KEY = "SB-Mid-server-LmcKxJVkNmmASwHGc2JDV6qw";

const db_path = "./src/php/";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// let Pagination = import("./libs/pagination.js").then(({ default: _ }) => ((Pagination = _), true));
// let bindAndFillFormData = import("./libs/bindAndFillFormData.js").then(({ default: _ }) => ((bindAndFillFormData = _), true));
// let rewriteUrl = import("./libs/rewriteUrl.js").then(({ default: _ }) => ((rewriteUrl = _), true));
// let fillFormsByUrlParam = import("./libs/fillFormsByUrlParam.js").then(({ default: _ }) => ((fillFormsByUrlParam = _), true));

const auth = {};

async function safeImport(url) {
    try {
        return await import(url);
    } catch (e) {
        return console.error("Error while import:", e);
    }
}

async function loadXData(name) {
    console.log("try load xdata:", name);
    
    const imported = await safeImport(`./components/${name}.js`);
    
    if (!imported || !imported.default) return console.log("xdata not found");
    
    const { default: xData } = imported;
    const xDataName = `${name}Component`.replace(/[\-]/g, "");
    
    Alpine.data(xDataName, xData);
    console.log("xdata successfully", { xDataName, xData });
    console.log("THISISISIS")
}

const exlusiveComponent = ["login", "login2", "pay"];

async function loadComponent() {
    const { c: componentName } = url_param;
    const defaultComponent = "dashboard";

    let app;

    // look for component exlusive
    if (!exlusiveComponent.includes(componentName)) {
        // check session
        let is_continue = false;

        encodeFetchedJson(await (await fetch(db_path + "staffs.php?m=get-session")).text(), "Cek Sesi", ({ auth: _auth } = {}) => {
            is_continue = true;

            if (_auth) Object.assign(auth, _auth);

            if (auth.username) {
                auth.username = auth.username.replace(/^[a-z]/, (char) => char.toUpperCase());
            }
        });

        if (!is_continue)
            return setTimeout(() => {
                location.href = "?c=login2";
            }, 3000);

        console.log("WUUUUHUUUUUU", is_continue);

        // set layout
        const htmlLayout = await (await fetch("./src/html/layout.html")).text();
        document.body.innerHTML = htmlLayout;

        app = document.querySelector("#app");
    } else {
        app = document.body;
    }

    if (!app) return;

    // set component
    const url = `./src/html/${componentName}.html`;

    try {
        if (!componentName?.trim()) throw new Error();
        const htmlComponent = await fetch(url);
        if (!htmlComponent.ok) throw new Error(componentName + " is not found");

        await loadXData(componentName);

        // await sleep(2000)
        // console.log({ url })
        const text = await htmlComponent.text();

        app.innerHTML = text;
        // console.log(text)
    } catch (e) {
        try {
            const htmlComponent = await fetch(`./src/html/${defaultComponent}.html`);
            if (!htmlComponent.ok) throw new Error("even" + defaultComponent + " is not found");

            app.innerHTML = await htmlComponent.text();
            url_param.c = defaultComponent;
        } catch (e) {
            console.error("Error while fetching component...", e.message);
        }
    }

    if (window.initFlowbite) {
        initFlowbite();
    }
}

const IDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

// Alpine init
const alpineInitCallback = async () => {
    console.log("ALPINE");

    // const config = await getConfigJson();
    // console.log({ config });

    Alpine.data("conn", function () {
        return {
            IDR,
            numberFormat(x) {
                return IDR.format(x)?.replace(/^Rp/i, "");
            },
            url_param,
            auth,
            async logout() {
                const { isConfirmed } = await Swal.fire({ ...deafultConfirmProps, title: "Yakin ingin logout?", text: "Kamu harus login kembali untuk memasuki app ini nantinya." });

                if (!isConfirmed) return;

                encodeFetchedJson(await (await fetch(db_path + "staffs.php?m=clear")).text(), "Logout", () => {
                    this.auth.username = null;

                    setTimeout(() => {
                        location.href = "?c=login2";
                    }, 3000);
                });
            },
        };
    });

    Alpine.data("dropdown", (is_y_position_full = false) => ({
        isDropdownOpen: false,
        setDropdownPosition() {
            this.$nextTick(() => {
                const rect = this.$el.getBoundingClientRect();
                const dropdownMenu = this.$el.querySelector(".dropdown-menu");

                // console.log({
                //     rect,
                //     left: rect.left,
                //     offsetWidth: dropdownMenu.offsetWidth,
                //     windowWidth: window.innerWidth,
                // });

                if (rect.left + dropdownMenu.offsetWidth > window.innerWidth) {
                    dropdownMenu.classList.add(is_y_position_full ? "right-full" : "right-0");
                    dropdownMenu.classList.remove(is_y_position_full ? "left-full" : "left-0");

                    console.log("OPS 1");
                } else {
                    dropdownMenu.classList.remove(is_y_position_full ? "right-full" : "right-0");
                    dropdownMenu.classList.add(is_y_position_full ? "left-full" : "left-0");

                    console.log("OPS 2");
                }
            });
        },
        disableDropdown() {
            this.isDropdownOpen = false;
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        init() {
            const dropdownMenu = this.$el.querySelector(".dropdown-menu");

            // console.log(dropdownMenu);

            if (dropdownMenu) {
                ["top-0", "right-0", "bottom-0", "left-0", "top-full", "right-full", "bottom-full", "left-full"].forEach((className) => {
                    dropdownMenu.classList.remove(className);
                });

                dropdownMenu.classList.add(is_y_position_full ? "top-0" : "top-full");
            }
            this.$watch("isDropdownOpen", () => {
                console.log("trigger");
                if (this.isDropdownOpen) {
                    this.setDropdownPosition();
                }
            });

            let is_wait = false;

            window.addEventListener("resize", () => {
                if (is_wait) return;

                is_wait = true;

                this.setDropdownPosition();

                setTimeout(() => {
                    is_wait = false;
                }, 1000);
            });
        },
    }));

    // Alpine.data('app', () => ({
    //     // isOpenBlackBarrier: true,
    //     // IDR,
    //     // didOpen() {
    //     //     Swal.getConfirmButton()?.classList.add("bg-blue-400")
    //     //     Swal.getConfirmButton()?.classList.add("bg-blue-400")
    //     // },
    //     // success({ text, title = 'Selamat' } = {}) {
    //     //     return Swal.fire({
    //     //         title, text, didOpen: this.didOpen
    //     //     })
    //     // }
    // }))

    await loadComponent();
};

if (window.Alpine) alpineInitCallback();
else document.addEventListener("alpine:init", alpineInitCallback);
