// import Datepicker from "../../../node_modules/flowbite-datepicker/js/Datepicker.js";

// import { getDateByDatepickerEl } from "../libs/getDatepickerDate.js";

// const toDate = (timestamp) => new Date(timestamp).toISOString().split(/T/)[0].split(/\-/).reverse().join("-");

export default function () {
    const el_date_start = document.querySelector("#datepicker-range-start");
    const el_date_end = document.querySelector("#datepicker-range-end");

    return {
        formSearch: {
            date_start: null,
            date_end: null,
        },

        async init() {
            // const el_datepicker = document.querySelector("#datepicker");
            // set the target element of the input field
            // const $datepickerEl = document.getElementById("datepicker-custom");
            // // optional options with default values and callback functions
            // const options = {
            //     defaultDatepickerId: null,
            //     autohide: false,
            //     format: "mm/dd/yyyy",
            //     maxDate: null,
            //     minDate: null,
            //     orientation: "bottom",
            //     buttons: true,
            //     autoSelectToday: true,
            //     title: "Tanggal",
            //     rangePicker: false,
            //     onShow: () => {},
            //     onHide: () => {},
            // };
            // // const instanceOptions = {
            // //     id: "datepicker-custom-example",
            // //     override: true,
            // // };
            // const datepicker = new Datepicker($datepickerEl, options);
            // console.log({ ...el_datepicker });
            // setTimeout(() => {
            //     console.log(getDateByDatepickerEl(el_datepicker));
            // }, 5000);
            // setTimeout(() => {
            //     console.log(getDateByDatepickerEl(el_datepicker));
            //     // console.log({ ...el_datepicker });
            // }, 10000);

            const context = this;

            this.$watch("formSearch.date_start", () => {
                console.log({ s: this.formSearch.date_start });
            });

            this.$watch("formSearch.date_end", () => {
                console.log({ e: this.formSearch.date_end });
            });

            // Object.defineProperty(el_date_start, "value", {
            //     _value: null,
            //     set(newVal) {
            //         if (newVal == this._value) return;

            //         context.formSearch.date_start = newVal;
            //         this._value = newVal;

            //         console.log(context);

            //         return newVal;
            //     },
            //     get() {
            //         return this._value;
            //     },
            // });

            // Object.defineProperty(el_date_end, "value", {
            //     _value: null,
            //     set(newVal) {
            //         if (newVal == this._value) return;

            //         context.formSearch.date_end = newVal;
            //         this._value = newVal;

            //         console.log(context);

            //         return newVal;
            //     },
            //     get() {
            //         return this._value;
            //     },
            // });

            this.formSearch.date_start = "22/04/2025";

            setTimeout(() => {
                this.formSearch.date_start = "25/04/2025";
            }, 2000);
        },
    };
}
