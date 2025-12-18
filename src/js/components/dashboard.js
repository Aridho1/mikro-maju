import bindAndFillFormData from "../libs/bindAndFillFormData.js";
import encodeFetchedJson from "../libs/encodeFetchedJson.js";
import fillFormsByUrlParam from "../libs/fillFormsByUrlParam.js";
import rewriteUrl from "../libs/rewriteUrl.js";
import { TaskQueue } from "../libs/TaskQueue.js";
import { url_param } from "../libs/urlParam.js";

const q = new TaskQueue();

export default function () {
	console.log("Chart", Chart);
	Chart.defaults.font.size = 10;

	const db_path = "./src/php/dashboard.php?m=";

	const dateNow = new Date().toISOString().split("T")[0];

	// Sold product count
	const elChart1 = document.querySelector("#chart-1");
	const elChart2 = document.querySelector("#chart-2");
	const elChart3 = document.querySelector("#chart-3");
	const elChart4 = document.querySelector("#chart-4");

	let chart1, chart2, chart3, chart4;

	const count = {
		revenue: 0,
		margin: 0,
		cost: 0,
	};

	if (elChart1) {
		// const chart1 = new Chart(elChart1, {
		//     type: 'line',
		//     data: {
		//         labels: ["Soto", "Kerupuk Udang", "Es Kelapa", "Bubur Kacang Hijau"],
		//         datasets: [{
		//             label: "Nama Produk",
		//             data: [12, 3, 5, 1],
		//             backgroundColor: 'rgba(255,255,255,.1)',
		//             borderColor: 'rgba(255,255,255,.55)',
		//         }]
		//     },
		//     options: {
		//         responsive: true,
		//         maintainAspectRatio: false,
		//         plugins: {
		//             legend: {
		//                 labels: {
		//                     color: '#fff' // agar label legend bisa terlihat di latar gelap
		//                 }
		//             }
		//         },
		//         layout: {
		//             padding: {
		//                 left: 0,
		//                 right: 0,
		//                 top: 0,
		//                 bottom: 0
		//             }
		//         },
		//         scales: {
		//             x: {
		//                 ticks: {
		//                     color: '#fff' // biar label sumbu X terlihat
		//                 }
		//             },
		//             y: {
		//                 ticks: {
		//                     color: '#fff'
		//                 }
		//             }
		//         },

		//         elements: {
		//             line: {
		//                 // borderWidth: 0
		//             },
		//             point: {
		//                 radius: 0,
		//                 hitRadius: 10,
		//                 hoverRadius: 4
		//             }
		//         }
		//     }
		// })

		chart1 = new Chart(elChart1, {
			type: "line",
			data: {
				labels: ["Soto", "Kerupuk Udang", "Es Kelapa", "Bubur Kacang Hijau"],
				datasets: [
					{
						label: "Nama Produk",
						data: [12, 3, 5, 1],
						borderColor: "rgba(255,255,255,0.7)",
						backgroundColor: "transparent",
						tension: 0.4,
						pointRadius: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						enabled: true,
						callbacks: {
							label: function (context) {
								const label = context.label || "";
								const value = context.parsed.y;
								return `${label}: ${value}`;
							},
						},
					},
				},
				layout: {
					padding: { left: 0, right: 0, top: 0, bottom: 0 },
				},
				scales: {
					x: { display: false },
					y: { display: false },
				},
				elements: {
					line: {
						borderWidth: 2,
					},
					point: {
						radius: 0,
						hitRadius: 10,
						hoverRadius: 4,
					},
				},
			},
		});
	}

	return {
		revenue: 0,
		revenues: [],
		margin: 0,
		margins: [],
		monthly_cost: 0,
		monthly_costs: [],
		formSearch: {
			_revenue_date_start: null,
			_revenue_date_end: null,

			_margin_date_start: null,
			_margin_date_end: null,

			_cost_date_start: null,
			_cost_date_end: null,
		},

		async init() {
			const isInit = true;

			// const keyss = Object.keys(this.formSearch);

			// console.warn(keyss);

			fillFormsByUrlParam(
				{
					string: ["_revenue_date_start", "_revenue_date_end", "_margin_date_start", "_margin_date_end", "_cost_date_start", "_cost_date_end"],
				},
				this.formSearch,
				url_param
			);

			this.getRevenue(isInit);
			this.getMargin(isInit);
			this.getCosts(isInit);

			window.addEventListener("date-range-change-revenue", ({ detail }) => {
				const { startDate, endDate } = detail;

				const _start = startDate ? startDate.toISOString().split("T")[0] : startDate;
				const _end = endDate ? endDate.toISOString().split("T")[0] : endDate;

				this.formSearch._revenue_date_start = _start;
				this.formSearch._revenue_date_end = _end;

				console.warn({
					_start,
					_end,
					startDate,
					endDate,
				});
			});

			window.addEventListener("date-range-change-margin", ({ detail }) => {
				const { startDate, endDate } = detail;

				const _start = startDate ? startDate.toISOString().split("T")[0] : startDate;
				const _end = endDate ? endDate.toISOString().split("T")[0] : endDate;

				this.formSearch._margin_date_start = _start;
				this.formSearch._margin_date_end = _end;
			});

			window.addEventListener("date-range-change-costs", ({ detail }) => {
				const { startDate, endDate } = detail;

				const _start = startDate ? startDate.toISOString().split("T")[0] : startDate;
				const _end = endDate ? endDate.toISOString().split("T")[0] : endDate;

				this.formSearch._cost_date_start = _start;
				this.formSearch._cost_date_end = _end;
			});
		},

		makeFormData(isInit) {
			const formData = new FormData();
			bindAndFillFormData(formData, this.formSearch);

			console.warn(this.formSearch);

			if (!rewriteUrl(formData, url_param) && !isInit) {
				this.$dispatch("notify", { variant: "warning", title: "Pencarian dibatalkan", message: "Ganti tanggal nya untuk melakukan pencarian!" });

				return false;
			}

			return formData;
		},

		async getRevenue(isInit) {
			q.add(
				"get-revenue",
				async () => {
					const formData = this.makeFormData(isInit);

					if (!formData) return;

					encodeFetchedJson(await (await fetch(db_path + "get-revenue", { method: "POST", body: formData })).text(), "get-revenue", ({ revenue, revenues, sql }) => {
						revenues.reverse();

						this.revenues = revenues;

						this.revenue = revenue;

						const labels = revenues.map(({ date }) => (date == dateNow ? "Hari Ini" : date));
						const tunai = revenues.map(({ tunai }) => tunai);
						const transfer = revenues.map(({ transfer }) => transfer);
						const QRIS = revenues.map(({ QRIS }) => QRIS);
						const total = revenues.map(({ total }) => total);

						const data = {
							labels,
							datasets: [
								{
									label: "Tunai",
									data: tunai,
									borderColor: "rgb(75, 192, 192)",
									backgroundColor: "rgba(75, 192, 192, 0.2)",
									tension: 0.4,
								},
								{
									label: "QRIS",
									data: QRIS,
									borderColor: "rgb(255, 99, 162)",
									backgroundColor: "rgba(255, 99, 172, 0.2)",
									tension: 0.4,
								},
								{
									label: "Transfer",
									data: transfer,
									borderColor: "rgb(255, 99, 132)",
									backgroundColor: "rgba(255, 99, 132, 0.2)",
									tension: 0.4,
								},
								// {
								// 	label: "Total",
								// 	data: total,
								// 	borderColor: "rgb(255, 206, 86)",
								// 	backgroundColor: "rgba(255, 206, 86, 0.2)",
								// 	borderDash: [5, 5], // supaya garisnya beda
								// 	tension: 0.4,
								// },
							],
						};

						if (!count.revenue)
							chart2 = new Chart(elChart2, {
								type: "line",
								data,
								options: {
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											labels: {
												color: "#fff",
											},
										},
									},
									scales: {
										x: {
											ticks: {
												color: "#fff",
												autoSkip: false, // tampilkan semua label meski mepet
												maxRotation: 180, // putar label supaya lebih muat
												minRotation: 0,
											},
										},
										y: {
											ticks: {
												color: "#fff",
												callback: (val) => {
													return this.IDR.format(val);
												},
											},
										},
									},
									plugins: {
										legend: {
											labels: {
												color: "#fff",
											},
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													const label = context.dataset.label || "";
													const value = context.parsed.y || 0;
													return `${label}: Rp ${value.toLocaleString("id-ID")}`;
												},
											},
										},
									},
								},
							});
						else {
							chart2.data = data;
							chart2.update();

							this.$dispatch("notify", { variant: "info", title: "Info", message: "Chart `revenue` berhasil di update." });
						}

						count.revenue++;
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Sedang memproses pencarian revenue! Mohon tunggu beberapa saat untuk melakukan aksi lainnya." }),
				}
			);
		},
		async getMargin(isInit) {
			q.add(
				"get-margin",
				async () => {
					const formData = this.makeFormData(isInit);
					if (!formData) return;

					encodeFetchedJson(await (await fetch(db_path + "get-margin", { method: "POST", body: formData })).text(), "get-margin", ({ margin, margins }) => {
						margins.reverse();

						this.margins = margins;
						this.margin = margin;

						const labels = margins.map(({ date }) => (date == dateNow ? "Hari Ini" : date));
						const profit = margins.map(({ profit }) => profit);
						const total = margins.map(({ total }) => total);

						console.log("margins", margins);

						const data = {
							labels,
							datasets: [
								{
									label: "Profit",
									data: profit,
									borderColor: "rgb(255, 206, 86)",
									backgroundColor: "rgba(255, 206, 86, 0.2)",
									tension: 0.4,
								},
								{
									label: "Total",
									data: total,
									borderColor: "rgb(255, 99, 132)",
									backgroundColor: "rgba(255, 99, 132, 0.2)",
									tension: 0.4,
								},
								// {
								// 	label: "Total",
								// 	data: total,
								// 	borderColor: "rgb(255, 206, 86)",
								// 	backgroundColor: "rgba(255, 206, 86, 0.2)",
								// 	borderDash: [5, 5], // supaya garisnya beda
								// 	tension: 0.4,
								// },
							],
						};

						if (!count.margin)
							chart4 = new Chart(elChart4, {
								type: "line",
								data,
								options: {
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											labels: {
												color: "#fff",
											},
										},
									},
									scales: {
										x: {
											ticks: {
												color: "#fff",
												autoSkip: false, // tampilkan semua label meski mepet
												maxRotation: 180, // putar label supaya lebih muat
												minRotation: 0,
											},
										},
										y: {
											ticks: {
												color: "#fff",
												callback: (val) => {
													return this.IDR.format(val);
												},
											},
										},
									},
									plugins: {
										legend: {
											labels: {
												color: "#fff",
											},
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													const label = context.dataset.label || "";
													const value = context.parsed.y || 0;
													return `${label}: Rp ${value.toLocaleString("id-ID")}`;
												},
											},
										},
									},
								},
							});
						else {
							chart4.data = data;
							chart4.update();

							this.$dispatch("notify", { variant: "info", title: "Info", message: "Chart `margin` berhasil di update." });
						}

						count.margin++;
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Sedang memproses pencarian margin! Mohon tunggu beberapa saat untuk melakukan aksi lainnya." }),
				}
			);
		},
		async getCosts(isInit) {
			q.add(
				"get-cost",
				async () => {
					const formData = this.makeFormData(isInit);
					if (!formData) return;

					encodeFetchedJson(await (await fetch(db_path + "get-monthly-cost", { method: "POST", body: formData })).text(), "get-monthly-cost", ({ monthly_cost, monthly_costs }) => {
						this.monthly_cost = monthly_cost;
						this.monthly_costs = monthly_costs;

						const labels = monthly_costs.map(({ category }) => category);
						const _data = monthly_costs.map(({ total }) => total);

						console.warn("monthly_costs", monthly_costs);

						// console.log("labels", labels);
						// console.log("_data", _data);

						const data = {
							labels,
							datasets: [
								{
									data: _data,
									backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
									borderWidth: 1,
								},
							],
						};

						if (!count.cost)
							chart3 = new Chart(elChart3, {
								type: "doughnut",
								data,
								options: {
									plugins: {
										legend: {
											labels: {
												color: "#fff",
											},
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													return `${context.label}: Rp ${context.parsed.toLocaleString("id-ID")}`;
												},
											},
										},
									},
								},
							});
						else {
							chart3.data = data;
							chart3.update();

							console.warn(data);

							this.$dispatch("notify", { variant: "info", title: "Info", message: "Chart `costs` berhasil di update." });
						}

						count.cost++;
					});
				},
				{
					cancelIfAlreadyInQueue: true,
					callbackForCancelled: () => this.$dispatch("notify", { variant: "warning", title: "Warning", message: "Sedang memproses pencarian costs! Mohon tunggu beberapa saat untuk melakukan aksi lainnya." }),
				}
			);
		},
	};
}
