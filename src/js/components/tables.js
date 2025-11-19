import { TaskQueue } from "../libs/TaskQueue.js";

const q = new TaskQueue();

export default function () {
	const db_path = "./src/php/tables.php?m=";

	return {
		appName: "Tables",
		link: "#",

		async init() {
			const canvas = document.getElementById("qr-code");

			const qr = await new QRCode("qr-code", {
				text: "HALO SEMUA",
				width: 128,
				height: 128,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRCode.CorrectLevel.H,
			});

			await qr;

			this.$nextTick(() => {
				const link = qr._el.querySelector("img").src;

				console.log({ link });
			});

			// this.link = link;
		},
	};
}
