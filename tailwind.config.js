/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./tail.html", "./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {},
    },
    plugins: [
        require("flowbite/plugin"),
        // require('@tailwindcss/line-clamp'),
    ],
    darkMode: "class",
};
