/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./login.html", "./tail.html", "./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js", "./notif.html"],
	theme: {
		extend: {},
	},
	plugins: [
		require("flowbite/plugin"),
		// require('@tailwindcss/line-clamp'),
	],
	darkMode: "class",
};
