-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 10:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mikro_maju`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `description`, `price`, `image`) VALUES
(2, 'Bakso Kuah Asli Bantar Gebang', 'Kuah dengan kaldu spesial', '15000', '6822fe93ba376.webp'),
(5, 'Pembuatan meme (jasa)', 'Dijamin lucu', '2000', '681ef1d2bb11d.jpg'),
(6, 'Dakimakura', 'Limited edition', '470000', '681ef9aebbfeb.jpeg'),
(14, 'Plushie', 'Limited edition', '700000', '6820195552699.jpeg'),
(17, 'Galon', 'Isi ulang - murah meriah', '5000', 'default.jpg'),
(18, 'Ink Art', 'Bergaya tinta asli', '200000', '6821b5d064e39.jpeg'),
(19, 'Hack Wifi', 'Bisa hack wifi nasa', '1200000', 'default.jpg'),
(20, 'Rumah', 'Harus cash', '4000000000', 'default.jpg'),
(21, 'Nasi Padang', 'Bumbu asli khas padang', '11000', '68230a0080fc4.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '12345', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `total` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL,
  `payment_key` varchar(255) NOT NULL,
  `payment_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `name`, `date`, `total`, `payment_method`, `payment_status`, `payment_key`, `payment_token`) VALUES
(7, 'Jokowi', '13-05-2025', '1900000', 'Transfer', 'Belum dibayar', '1884529121', ''),
(8, 'Ujang', '14-05-2025', '4000700000', 'Cash', 'Belum dibayar', '', ''),
(9, 'Wendi', '14-05-2025', '3810000', 'Transfer', 'Pending', '836114295', ''),
(10, 'Rama', '14-05-2025', '747000', 'Cash', 'Belum dibayar', '', ''),
(11, 'Cecep', '14-05-2025', '4001227000', 'Cash', 'Belum dibayar', '', ''),
(12, 'Madun', '14-05-2025', '940000', 'Cash', 'Belum dibayar', '', ''),
(13, 'Surya', '14-05-2025', '111000', 'Cash', 'Belum dibayar', '', ''),
(14, 'Fatih', '14-05-2025', '192000', 'Cash', 'Belum dibayar', '', ''),
(15, 'Sarah', '14-05-2025', '4000400000', 'Cash', 'Belum dibayar', '', ''),
(16, 'Nasim', '14-05-2025', '1210000', 'Cash', 'Belum dibayar', '', ''),
(17, 'Mamat', '14-05-2025', '952000', 'Cash', 'Belum dibayar', '', ''),
(18, 'Rosi', '14-05-2025', '51000', 'Cash', 'Belum dibayar', '', ''),
(19, 'Anas', '14-05-2025', '64000', 'Cash', 'Sudah dibayar', '', ''),
(20, 'Denis', '15-05-2025', '4000022000', 'Transfer', 'Pending', '528233437', '56a703b7-4ee7-4e29-8824-133bf324307f'),
(21, 'Denis', '15-05-2025', '4000022000', 'Transfer', 'Pending', '780517145', '67acb98f-56b0-46cc-aa42-a8cf55b24f7f'),
(22, 'Damar', '15-05-2025', '15000', 'Transfer', 'Pending', '2049335249', '0eefd66c-4afc-4d53-bd35-b3c1a81abcd6'),
(23, 'Damar', '15-05-2025', '15000', 'Transfer', 'Pending', '1200930790', '64befa88-a32e-45fb-9f2b-0a15c1ef8172'),
(24, 'Kokom', '15-05-2025', '15000', 'Transfer', 'Pending', '164917417', 'ffc26b1c-65f9-4885-924f-a0e92917f319'),
(25, 'Toni', '15-05-2025', '19000', 'Transfer', 'Pending', '1892599758', '650e443d-6a81-4be8-9680-b9c5c69bd8cc'),
(26, 'Ilham', '15-05-2025', '45000', 'Transfer', 'Pending', '932513052', '3ed605c8-c339-41ca-b058-4bcb2daf2c19'),
(27, 'Wawan', '15-05-2025', '21000', 'Transfer', 'Pending', '906609098', '74a55bf3-70d6-4d3f-90c7-47798f747362'),
(28, 'Rudi', '15-05-2025', '30000', 'Transfer', 'Pending', '2054011081', '4610b8ab-46ec-4c4c-a230-f122191c6f02'),
(29, 'Budi', '15-05-2025', '12000', 'Transfer', 'Pending', '859089107', 'be1c8e9b-4fdd-41c9-a3a1-abc9d5a155fe'),
(30, 'aaa', '15-05-2025', '4000', 'Cash', 'Belum dibayar', '', ''),
(31, 'bbb', '15-05-2025', '4000', 'Transfer', 'Pending', '358849898', '8253760d-708b-4238-9078-1c7aa4e8e050'),
(32, 'ccc', '15-05-2025', '6000', 'Transfer', 'Pending', '1819424275', 'a7502d06-42f5-4287-ba78-a3dd6a23b0db'),
(33, 'Rido', '15-05-2025', '36000', 'Transfer', 'Pending', '755589087', '1bc44d0b-fe32-4590-a119-13f571d914d4'),
(34, 'Ali', '15-05-2025', '38000', 'Transfer', 'Pending', '1127125588', '6a3c3bb8-b6f5-49bb-94ee-fd1b04c169d4'),
(35, 'Nanang', '15-05-2025', '17000', 'Transfer', 'Pending', '1549936008', 'ef329193-bb0d-4164-8116-e3e383eb3ea5'),
(36, 'Rido', '15-05-2025', '23000', 'Transfer', 'settlement', '539836220', '30e62b66-7293-424e-9369-f6d69cd21749');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `item_id` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `sub_total` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_details`
--

INSERT INTO `transaction_details` (`id`, `transaction_id`, `item_id`, `quantity`, `sub_total`) VALUES
(7, '4', '14', '52', '36400000'),
(8, '4', '6', '5', '2350000'),
(9, '4', '19', '2', '2400000'),
(10, '4', '20', '52', '208000000000'),
(11, '4', '17', '1', '5000'),
(12, '4', '18', '1', '200000'),
(13, '5', '2', '1', '15000'),
(14, '5', '14', '1', '700000'),
(15, '6', '6', '2', '940000'),
(16, '6', '14', '1', '700000'),
(17, '7', '14', '1', '700000'),
(18, '7', '19', '1', '1200000'),
(19, '8', '20', '1', '4000000000'),
(20, '8', '14', '1', '700000'),
(21, '9', '6', '3', '1410000'),
(22, '9', '19', '2', '2400000'),
(23, '10', '2', '3', '45000'),
(24, '10', '5', '1', '2000'),
(25, '10', '14', '1', '700000'),
(26, '11', '5', '3', '6000'),
(27, '11', '20', '1', '4000000000'),
(28, '11', '17', '2', '10000'),
(29, '11', '21', '1', '11000'),
(30, '11', '19', '1', '1200000'),
(31, '12', '6', '2', '940000'),
(32, '13', '21', '1', '11000'),
(33, '13', '17', '2', '10000'),
(34, '13', '2', '6', '90000'),
(35, '14', '21', '2', '22000'),
(36, '14', '17', '4', '20000'),
(37, '14', '2', '10', '150000'),
(38, '15', '20', '1', '4000000000'),
(39, '15', '18', '2', '400000'),
(40, '16', '19', '1', '1200000'),
(41, '16', '17', '2', '10000'),
(42, '17', '17', '2', '10000'),
(43, '17', '6', '2', '940000'),
(44, '17', '5', '1', '2000'),
(45, '18', '17', '2', '10000'),
(46, '18', '2', '2', '30000'),
(47, '18', '21', '1', '11000'),
(48, '19', '21', '4', '44000'),
(49, '19', '2', '1', '15000'),
(50, '19', '17', '1', '5000'),
(51, '20', '21', '2', '22000'),
(52, '20', '20', '1', '4000000000'),
(53, '21', '21', '2', '22000'),
(54, '21', '20', '1', '4000000000'),
(55, '22', '2', '1', '15000'),
(56, '23', '2', '1', '15000'),
(57, '24', '2', '1', '15000'),
(58, '25', '17', '3', '15000'),
(59, '25', '5', '2', '4000'),
(60, '26', '2', '3', '45000'),
(61, '27', '5', '3', '6000'),
(62, '27', '2', '1', '15000'),
(63, '28', '2', '2', '30000'),
(64, '29', '5', '6', '12000'),
(65, '30', '5', '2', '4000'),
(66, '31', '5', '2', '4000'),
(67, '32', '5', '3', '6000'),
(68, '33', '2', '2', '30000'),
(69, '33', '5', '3', '6000'),
(70, '34', '2', '2', '30000'),
(71, '34', '5', '4', '8000'),
(72, '35', '2', '1', '15000'),
(73, '35', '5', '1', '2000'),
(74, '36', '2', '1', '15000'),
(75, '36', '5', '4', '8000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
