-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 05 Agu 2025 pada 16.06
-- Versi server: 10.11.13-MariaDB-cll-lve
-- Versi PHP: 8.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobo7639_mikro_maju`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `costs`
--

CREATE TABLE `costs` (
  `id` int(11) NOT NULL,
  `date` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `costs`
--

INSERT INTO `costs` (`id`, `date`, `amount`, `category`, `description`) VALUES
(1, '2025-07-01', 125000, 'Sewa', 'Bayar sewa tanah'),
(3, '2025-07-01', 60000, 'Bahan-bahan', 'Beli bakso, kerupuk, cabai'),
(4, '2025-07-02', 45000, 'Listrik', 'Bayar listrik bulanan'),
(5, '2025-07-02', 220000, 'Bahan-bahan', 'Beli cabai 1kg, saus 10 botol, kerupuk 20 toples, garam sebungkus, miyak 10 liter, kecap 5 botol, es batu 1 kulkas, kopi abc 20 renceng, kopi kapal api 10 renceng, susu 2 renceng'),
(6, '2025-07-10', 20000, 'Perbaikan', 'Perbaikan Lampu'),
(7, '2025-07-10', 150000, 'Sewa', 'Sewa Warung'),
(8, '2025-07-10', 50000, 'Listrik', 'Bayar Air + listrik'),
(10, '2025-07-11', 40000, 'Bahan-bahan', 'Restok Kerupuk'),
(11, '2025-07-24', 30000, 'Listrik', 'Listril + lampi'),
(12, '2025-08-03', 40000, 'Listrik', 'Listrik'),
(13, '2025-08-03', 60000, 'Bahan-bahan', 'Bahan dagangan');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `purchase_price` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `subcategory` varchar(255) NOT NULL,
  `deprecated_code` int(1) NOT NULL,
  `origin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `purchase_price`, `price`, `image`, `category`, `subcategory`, `deprecated_code`, `origin_id`) VALUES
(70, 'Bakso Cuangki', '-', 3000, 5000, '687b3fd6cb080.jpeg', 'Makanan', 'Bakso', 2, 0),
(71, 'Bakso Malang', '-', 4000, 10000, '687b40177f14f.jpeg', 'Makanan', 'Bakso', 2, 0),
(72, 'Bakso Mercon', '-', 7000, 15000, '687b403550cb4.jpeg', 'Makanan', 'Bakso', 2, 72),
(73, 'Bakso Mercon', '-', 7000, 16000, '687b403550cb4.jpeg', 'Makanan', 'Bakso', 2, 72),
(75, 'Nasi Goreng Spesial', '-', 5000, 10000, '687bde756e030.webp', 'Makanan', 'Nasi Goreng', 2, 0),
(76, 'Nasi Goreng Pedas', '-', 5000, 10000, '687bdea1400bf.jpeg', 'Makanan', 'Nasi Goreng', 2, 0),
(77, 'Kopi Luak', '-', 2000, 5000, '687be0c43dce2.jpeg', 'Minuman', 'Kopi', 2, 0),
(78, 'Es Teh Manis', '-', 1000, 4000, '687be0fe4e274.jpeg', 'Minuman', 'Teh', 2, 0),
(79, 'Bakso Mercon', '-', 10000, 20000, '687c5614f0e70.jpeg', 'Makanan', 'Bakso', 2, 0),
(80, 'Mie balado', '-', 3000, 10000, '687c5686310a5.jpeg', 'Makanan', 'Mie', 2, 0),
(81, 'Ayam Geprek', '-', 6000, 14000, '687c56eb83c6e.jpeg', 'Makanan', 'Ayam', 2, 0),
(82, 'Kopi ABC', '-', 1000, 4000, '687c57a90b756.png', 'Minuman', 'Kopi', 2, 0),
(83, 'Sosis', '-', 500, 1000, '687c57d247d47.png', 'Makanan', 'Sosis', 2, 0),
(84, 'Kerupuk Udang', '-', 1000, 2000, '687c5811a75d9.jpeg', 'Makanan', 'Kerupuk', 2, 0),
(85, 'Kerupuk Jengkol', '-', 1000, 2000, '687c582dad158.jpeg', 'Makanan', 'Kerupuk', 2, 0),
(86, 'Bakso Mercon', '-', 8000, 20000, '687c5ac4adfb5.jpeg', 'Makanan', 'Bakso', 0, 0),
(87, 'Bakso Tusuk', '-', 2000, 5000, '687c5b32ceff8.jpeg', 'Makanan', 'Bakso', 0, 0),
(88, 'Nasi Putih', '-', 3000, 5000, '687c5bd5423f2.jpeg', 'Makanan', 'Nasi', 0, 0),
(89, 'Soto Bekasi', '-', 8000, 13000, '687c5c3735850.jpeg', 'Makanan', 'Soto', 0, 0),
(90, 'Aqua Botol - M 600ml', '-', 3000, 5000, '687c5ca077b7d.jpeg', 'Minuman', 'Aqua', 0, 0),
(91, 'Aqua Botol - L 1500ml', '-', 5000, 8000, '687c5d2f93853.jpeg', 'Minuman', 'Aqua', 0, 0),
(92, 'Teh Pucuk Harum', '-', 2500, 4000, '687c5d8e7ce26.jpeg', 'Minuman', 'Teh', 0, 0),
(93, 'Kopi ABC Susu', '-', 3000, 6000, '687c5e48c1a5e.jpeg', 'Minuman', 'Kopi', 0, 0),
(94, 'Susu Indomil - Botol 450ml', '-', 1500, 3000, '687c5efc0d964.jpeg', 'Minuman', 'Susu', 0, 0),
(95, 'Susu Indomilk - Kotak 800ml', '-', 5000, 8000, '687c5f2004e87.jpeg', 'Minuman', 'Susu', 0, 0),
(96, 'Sosis', '-', 500, 1000, '687c605e08d36.jpeg', 'Makanan', 'Sosis', 1, 96),
(97, 'Sosis', '-', 500, 2000, '687c605e08d36.jpeg', 'Makanan', 'Sosis', 1, 96),
(98, 'Sosis', '-', 500, 1500, '687c605e08d36.jpeg', 'Makanan', 'Sosis', 0, 96);

-- --------------------------------------------------------

--
-- Struktur dari tabel `staffs`
--

CREATE TABLE `staffs` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `staffs`
--

INSERT INTO `staffs` (`id`, `username`, `password`) VALUES
(1, 'admin', '12345'),
(2, 'developer', '54321');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `date` varchar(255) NOT NULL,
  `total` int(11) NOT NULL,
  `profit` int(11) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL,
  `payment_key` varchar(255) NOT NULL,
  `payment_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `date`, `total`, `profit`, `payment_method`, `payment_status`, `payment_key`, `payment_token`) VALUES
(122, '2025-07-20', 28000, 28000, 'Transfer', 'Settlement', '861248119', 'b350ea7a-24f0-4dc5-b480-35d1316c3318'),
(123, '2025-07-20', 31000, 31000, 'Transfer', 'Pending', '577803106', '137158b9-df35-4c9d-9ce5-d3ae7dcd808f'),
(124, '2025-07-20', 13000, 13000, 'Transfer', 'Pending', '294719876', 'bccd5cf4-6c84-4ee2-8251-e3e0d8513986'),
(125, '2025-07-20', 6000, 6000, 'Transfer', 'Pending', '735384494', '428555b0-8533-44e9-af9f-ca3be74cc5a3'),
(126, '2025-07-20', 10000, 10000, 'Tunai', 'Sudah dibayar', '', ''),
(127, '2025-07-20', 8000, 8000, 'Tunai', 'Sudah dibayar', '', ''),
(128, '2025-07-20', 5000, 5000, 'Tunai', 'Sudah dibayar', '', ''),
(129, '2025-07-20', 16000, 16000, 'Transfer', 'Pending', '916979305', 'de3bc173-0ec6-4e16-b951-836f5e418be5'),
(131, '2025-07-20', 78000, 78000, 'Transfer', 'Pending', '547581206', 'b8e959c2-c733-4003-98ae-01394bb3b48e'),
(132, '2025-07-20', 50000, 50000, 'Transfer', 'Pending', '298661500', '93235913-59dc-4fb0-823d-8edb359a6bbb'),
(133, '2025-07-20', 6000, 6000, 'Tunai', 'Sudah dibayar', '', ''),
(134, '2025-07-24', 52000, 52000, 'Tunai', 'Sudah dibayar', '', ''),
(135, '2025-07-24', 20000, 20000, 'Tunai', 'Sudah dibayar', '', ''),
(136, '2025-08-03', 12000, 12000, 'Tunai', 'Sudah dibayar', '', ''),
(137, '2025-08-03', 36000, 36000, 'Transfer', 'Pending', '1850346221', '6838cc5c-67d7-4e66-b243-1f1847667572'),
(138, '2025-08-03', 3000, 3000, 'Transfer', 'Pending', '1087301967', 'aab47785-c328-488a-b58d-805fa8c13552'),
(139, '2025-08-03', 16000, 16000, 'Transfer', 'Pending', '1749318529', 'b3a78725-1355-4a05-a5a6-30e360247fa9'),
(140, '2025-08-03', 16000, 16000, 'Transfer', 'Pending', '573552804', '09d8eb05-1935-42d6-a99a-3a8f06d61084'),
(141, '2025-08-03', 8000, 8000, 'Tunai', 'Sudah dibayar', '', ''),
(142, '2025-08-03', 36000, 36000, 'Tunai', 'Sudah dibayar', '', ''),
(143, '2025-08-04', 50000, 50000, 'Tunai', 'Sudah dibayar', '', ''),
(144, '2025-08-04', 92500, 92500, 'Transfer', 'Pending', '1357594187', '2f0c4568-5e23-4421-b8fa-2e0bae3a8ec2');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `sub_total` int(11) NOT NULL,
  `sub_profit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaction_details`
--

INSERT INTO `transaction_details` (`id`, `transaction_id`, `product_id`, `quantity`, `sub_total`, `sub_profit`) VALUES
(239, 111, 70, 1, 5000, 5000),
(240, 111, 72, 1, 15000, 15000),
(241, 112, 73, 2, 32000, 32000),
(242, 113, 70, 1, 5000, 5000),
(243, 113, 71, 1, 10000, 10000),
(244, 113, 76, 2, 20000, 20000),
(245, 113, 75, 2, 20000, 20000),
(246, 114, 70, 2, 10000, 10000),
(247, 114, 71, 1, 10000, 10000),
(248, 114, 75, 1, 10000, 10000),
(249, 114, 78, 3, 12000, 12000),
(250, 114, 77, 2, 10000, 10000),
(251, 114, 76, 2, 20000, 20000),
(252, 115, 70, 2, 10000, 10000),
(253, 115, 78, 1, 4000, 4000),
(254, 116, 71, 1, 10000, 10000),
(255, 116, 78, 1, 4000, 4000),
(256, 117, 77, 1, 5000, 5000),
(257, 117, 76, 1, 10000, 10000),
(258, 118, 86, 1, 20000, 20000),
(259, 118, 92, 2, 8000, 8000),
(260, 119, 86, 1, 20000, 20000),
(261, 119, 88, 1, 5000, 5000),
(262, 119, 93, 1, 6000, 6000),
(263, 120, 89, 1, 13000, 13000),
(264, 120, 88, 1, 5000, 5000),
(265, 120, 91, 1, 8000, 8000),
(266, 120, 96, 2, 2000, 2000),
(267, 121, 93, 1, 6000, 6000),
(268, 122, 86, 1, 20000, 20000),
(269, 122, 92, 2, 8000, 8000),
(270, 123, 89, 2, 26000, 26000),
(271, 123, 92, 1, 4000, 4000),
(272, 123, 96, 1, 1000, 1000),
(273, 124, 87, 2, 10000, 10000),
(274, 124, 94, 1, 3000, 3000),
(275, 125, 94, 2, 6000, 6000),
(276, 126, 88, 2, 10000, 10000),
(277, 127, 92, 2, 8000, 8000),
(278, 128, 90, 1, 5000, 5000),
(279, 129, 95, 2, 16000, 16000),
(280, 130, 86, 2, 40000, 40000),
(281, 130, 87, 2, 10000, 10000),
(282, 130, 88, 2, 10000, 10000),
(283, 130, 89, 1, 13000, 13000),
(284, 130, 90, 1, 5000, 5000),
(285, 130, 91, 2, 16000, 16000),
(286, 130, 92, 2, 8000, 8000),
(287, 130, 93, 2, 12000, 12000),
(288, 130, 94, 2, 6000, 6000),
(289, 130, 95, 1, 8000, 8000),
(290, 130, 96, 2, 2000, 2000),
(291, 131, 86, 2, 40000, 40000),
(292, 131, 87, 2, 10000, 10000),
(293, 131, 90, 2, 10000, 10000),
(294, 131, 93, 2, 12000, 12000),
(295, 131, 94, 2, 6000, 6000),
(296, 132, 93, 4, 24000, 24000),
(297, 132, 89, 2, 26000, 26000),
(298, 133, 93, 1, 6000, 6000),
(299, 134, 93, 8, 48000, 48000),
(300, 134, 96, 4, 4000, 4000),
(301, 135, 86, 1, 20000, 20000),
(302, 136, 88, 1, 5000, 5000),
(303, 136, 94, 2, 6000, 6000),
(304, 136, 96, 1, 1000, 1000),
(305, 137, 88, 2, 10000, 10000),
(306, 137, 89, 2, 26000, 26000),
(307, 138, 94, 1, 3000, 3000),
(308, 139, 97, 2, 4000, 4000),
(309, 139, 93, 2, 12000, 12000),
(310, 140, 98, 2, 3000, 3000),
(311, 140, 87, 1, 5000, 5000),
(312, 140, 92, 2, 8000, 8000),
(313, 141, 92, 2, 8000, 8000),
(314, 142, 88, 2, 10000, 10000),
(315, 142, 89, 2, 26000, 26000),
(316, 143, 86, 2, 40000, 40000),
(317, 143, 87, 1, 5000, 5000),
(318, 143, 88, 1, 5000, 5000),
(319, 144, 98, 1, 1500, 1500),
(320, 144, 88, 4, 20000, 20000),
(321, 144, 89, 2, 26000, 26000),
(322, 144, 87, 1, 5000, 5000),
(323, 144, 86, 2, 40000, 40000);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `costs`
--
ALTER TABLE `costs`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `costs`
--
ALTER TABLE `costs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT untuk tabel `staffs`
--
ALTER TABLE `staffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
