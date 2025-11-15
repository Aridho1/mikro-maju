import encodeFetchedJson from "./libs/encodeFetchedJson.js";
import { deafultConfirmProps } from "./libs/swal2props.js";
import { url_param } from "./libs/urlParam.js";
// import { getConfigJson } from "./libs/getConfigJson.js";

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
	console.log("THISISISIS");
}

const exlusiveComponent = ["login", "login2", "login3", "pay", "tables"];

async function loadComponent() {
	const { c: componentName } = url_param;
	const defaultComponent = "dashboard";

	let app;

	// look for component exlusive
	if (!exlusiveComponent.includes(componentName)) {
		console.log(`${componentName} is not exlusive`);
		// check session
		let is_continue = false;

		encodeFetchedJson(await (await fetch(db_path + "staffs.php?m=get-session")).text(), "Cek Sesi", ({ auth: _auth } = {}) => {
			is_continue = true;

			if (_auth) Object.assign(auth, _auth);

			if (auth.username) {
				auth.username = auth.username.replace(/^[a-z]/, (char) => char.toUpperCase());
			}

			console.log({ auth });
		});

		if (!is_continue)
			return setTimeout(() => {
				location.href = "?c=login3";
			}, 3000);

		// console.log("WUUUUHUUUUUU", is_continue);

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
						location.href = "?c=login3";
					}, 3000);
				});
			},
			getReadMore(text, length = 100, endPrefix = "...") {
				const slices = text.slice(0, length);

				return text == slices ? text : slices.concat(endPrefix);
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

	Alpine.data("Dropdown", ({ trigger = "click" } = {}) => ({
		isOpen: false,
		trigger: ["click", "hover"].includes(trigger) ? trigger : "click",
		positions: {
			"bottom": "top-full left-0", // di bawah tombol
			"bottom-start": "top-full left-0", // di bawah, rata kiri
			"bottom-end": "top-full right-0", // di bawah, rata kanan

			"top": "bottom-full left-0", // di atas tombol
			"top-start": "bottom-full left-0", // di atas, rata kiri
			"top-end": "bottom-full right-0", // di atas, rata kanan

			"right": "left-full top-1/2 -translate-y-1/2", // kanan, tengah
			"right-start": "left-full top-0", // kanan, atas
			"right-end": "left-full bottom-0", // kanan, bawah

			"left": "right-full top-1/2 -translate-y-1/2", // kiri, tengah
			"left-start": "right-full top-0", // kiri, atas
			"left-end": "right-full bottom-0", // kiri, bawah
		},
		toggle() {
			this.isOpen = !this.isOpen;
		},
		activated() {
			this.isOpen = true;
		},
		deActivated() {
			this.isOpen = false;
		},
		init() {
			const { trigger } = this;
			const { button, dropdownMenu } = this.$refs;

			// add event for toggle
			if (!button) {
				console.warn("cannot find ref button in Dropdown!");
			} else {
				if (trigger == "click") {
					button.addEventListener("click", () => {
						this.toggle();
					});
					console.log("setto click");
				} else if (trigger == "hover") {
					button.addEventListener("mouseenter", () => {
						this.activated();
					});
					button.addEventListener("mouseleave", () => {
						this.deActivated();
					});
				}
			}

			// event for hover
			if (trigger == "hover" && dropdownMenu) {
				dropdownMenu.addEventListener("mouseenter", () => {
					this.activated();
				});

				dropdownMenu.addEventListener("mouseleave", () => {
					this.deActivated();
				});
			}
		},
	}));

	Alpine.data("Slide", () => {
		const allowed_method = ["next", "prev"];

		return {
			currentSlide: 0,
			slides: [],
			_method: "next",
			set method(val) {
				if (!allowed_method.includes(val)) {
					return console.log("_method value allowed list is:", allowed_method);
				}

				if (val !== this._method) this._method = val;

				return val;
			},

			get method() {
				return this._method;
			},

			get allowed_method() {
				return allowed_method;
			},

			init() {},
			nextSlide() {
				this.method = "next";
				this.$nextTick(() => {
					this.currentSlide = (this.currentSlide + 1) % this.slides.length;
				});
			},
			prevSlide() {
				this.method = "prev";
				this.$nextTick(() => {
					this.currentSlide = !this.currentSlide ? this.slides.length - 1 : (this.currentSlide - 1) % this.slides.length;
				});
			},
		};
	});

	Alpine.data("dateRangePicker", function (options) {
		console.log("options in dateRangePicker", options);

		let startDate = options?.startDate || null;
		let endDate = options?.endDate || null;

		if (startDate) {
			try {
				startDate = new Date(startDate);
			} catch (e) {}
		}

		if (endDate) {
			try {
				endDate = new Date(endDate);
			} catch (e) {}
		}

		return {
			startDate,
			endDate,
			open: null, // 'start' | 'end' | null
			currentMonth: new Date().getMonth(),
			currentYear: new Date().getFullYear(),
			days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			pickers: [
				{
					key: "start",
					label: options?.labels?.[0] || "Start Date",
				},
				{ key: "end", label: options?.labels?.[1] || "End Date" },
			],
			withToday: !!options?.withToday,
			withLabel: !!options?.withLabel,
			model: options?.model || {}, // { start, end }
			onChange: options?.onChange || null,

			// === Helpers ===
			monthName() {
				return new Date(this.currentYear, this.currentMonth).toLocaleString("default", { month: "long" });
			},
			format(date) {
				if (!date) return "";
				const y = date.getFullYear();
				const m = String(date.getMonth() + 1).padStart(2, "0");
				const d = String(date.getDate()).padStart(2, "0");
				return `${y}-${m}-${d}`;
			},
			normalizeToLocalMidnight(date) {
				if (!date) return null;
				return new Date(date.getFullYear(), date.getMonth(), date.getDate());
			},
			dateKey(date) {
				if (!date) return null;
				return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
			},
			isSameDate(a, b) {
				if (!a || !b) return false;
				return this.dateKey(a) === this.dateKey(b);
			},
			isInRange(day) {
				if (!this.startDate || !this.endDate || !day) return false;
				const k = this.dateKey(day);
				return k >= this.dateKey(this.startDate) && k <= this.dateKey(this.endDate);
			},
			daysInMonth() {
				const firstDay = new Date(this.currentYear, this.currentMonth, 1);
				const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
				const days = Array(firstDay.getDay()).fill(null);
				for (let i = 1; i <= lastDay.getDate(); i++) {
					days.push(new Date(this.currentYear, this.currentMonth, i));
				}
				return days;
			},

			// === Logic ===
			selectDay(day, type) {
				if (!day) return;
				const normalized = this.normalizeToLocalMidnight(day);

				if (type === "start") {
					this.startDate = normalized;
					if (this.endDate && this.dateKey(this.endDate) < this.dateKey(this.startDate)) [this.startDate, this.endDate] = [this.endDate, this.startDate];
					else if (!this.endDate) this.endDate = this.startDate;
				} else {
					this.endDate = normalized;
					if (this.startDate && this.dateKey(this.startDate) > this.dateKey(this.endDate)) [this.startDate, this.endDate] = [this.endDate, this.startDate];
					else if (!this.startDate) this.startDate = this.endDate;
				}

				// setelah update date, kirim event ke parent:
				this.dispatchChange();
			},
			isSelected(day, type) {
				return this.isSameDate(day, type === "start" ? this.startDate : this.endDate);
			},
			prevMonth() {
				if (this.currentMonth === 0) {
					this.currentMonth = 11;
					this.currentYear--;
				} else this.currentMonth--;
			},
			nextMonth() {
				if (this.currentMonth === 11) {
					this.currentMonth = 0;
					this.currentYear++;
				} else this.currentMonth++;
			},
			toggleCalendar(type) {
				this.open = this.open === type ? null : type;
			},
			clear() {
				this.startDate = null;
				this.endDate = null;
				this.dispatchChange();
			},
			dispatchChange() {
				this.$dispatch("date-range-change", {
					startDate: this.startDate,
					endDate: this.endDate,
				});
			},

			init() {
				// dengarkan event clear dari parent
				this.$el.addEventListener("clear-range", () => this.clear());

				console.log("INIT DATE RANGE PICKER");
			},
		};
	});

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
