-- MySQL dump 10.13  Distrib 8.4.8, for Win64 (x86_64)
--
-- Host: localhost    Database: mikro_maju
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attandance`
--

DROP TABLE IF EXISTS `attandance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attandance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(20) NOT NULL,
  `salary` int DEFAULT NULL,
  `date` varchar(50) NOT NULL,
  `time` varchar(20) NOT NULL,
  `timestamp` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attandance`
--

LOCK TABLES `attandance` WRITE;
/*!40000 ALTER TABLE `attandance` DISABLE KEYS */;
INSERT INTO `attandance` VALUES (3,1,'Hadir','Clock In',NULL,'2025-09-07','12 : 05','1757246747000'),(4,1,'Hadir','Clock out',NULL,'2025-09-07','12 : 07','1757246838000'),(5,1,'Tidak Hadir','Clock In',NULL,'2025-09-07','12:09','1757246966000'),(6,1,'Tidak Hadir','Clock In',NULL,'2025-09-07','19:12','1757247160000'),(7,1,'Hadir','Clock In',NULL,'2025-09-07','19:13','1757247235000'),(8,1,'Hadir','Clock In',NULL,'2025-09-07','19:14','1757247327000'),(18,1,'Hadir','Clock In',NULL,'2025-11-11','14:00','1762844448000'),(19,3,'Hadir','Clock In',NULL,'2025-11-14','09:47','1763088472000'),(20,3,'Hadir','Clock In',NULL,'2025-11-14','10:24','1763090699000'),(21,3,'Hadir','Clock out',NULL,'2025-11-14','10:43','1763091802000'),(22,3,'Hadir','Clock In',NULL,'2025-11-14','10:43','1763091821000'),(23,3,'Hadir','Clock In',NULL,'2025-11-14','10:44','1763091845000'),(24,1,'Hadir','Clock In',0,'2025-11-14','10:48','1763092141000'),(25,1,'Hadir','Clock out',50000,'2025-11-14','10:48','1763092156000'),(26,1,'Hadir','Clock In',0,'2025-11-14','11:21','1763094119000'),(27,1,'Hadir','Clock out',0,'2025-11-14','11:22','1763094155000'),(28,2,'Hadir','Clock In',0,'2025-11-14','11:23','1763094205000'),(29,1,'Hadir','Clock In',0,'2025-11-14','14:18','1763104707000'),(30,1,'Hadir','Clock In',NULL,'2025-11-15','16:35','1763199378000'),(31,1,'Hadir','Clock In',NULL,'2025-11-15','16:35','1763199405000'),(32,1,'Tidak Hadir','Clock In',NULL,'2025-11-15','16:36','1763199423000'),(33,1,'Hadir','Clock In',NULL,'2025-11-15','16:36','1763199433000'),(34,1,'Hadir','Clock In',NULL,'2025-11-15','16:36','1763199450000'),(35,1,'Hadir','Clock In',NULL,'2025-11-15','16:38','1763199490000'),(36,1,'Hadir','Clock In',NULL,'2025-11-15','16:38','1763199503000'),(37,1,'Tidak Hadir','Clock In',NULL,'2025-11-15','16:38','1763199515000'),(38,1,'Hadir','Clock In',NULL,'2025-11-15','16:38','1763199519000'),(39,1,'Hadir','Clock In',NULL,'2025-11-15','16:41','1763199682000'),(40,1,'Hadir','Clock In',NULL,'2025-11-15','16:46','1763199983000'),(41,1,'Hadir','Clock In',NULL,'2025-11-15','16:46','1763200010000'),(42,1,'Hadir','Clock In',NULL,'2025-11-15','16:47','1763200030000'),(43,1,'Hadir','Clock In',NULL,'2025-11-15','16:48','1763200120000'),(44,1,'Hadir','Clock In',NULL,'2025-11-15','17:04','1763201062000'),(45,1,'Hadir','Clock In',NULL,'2025-11-15','17:06','1763201201000'),(46,1,'Hadir','Clock In',NULL,'2025-11-15','17:07','1763201235000'),(49,1,'Hadir','Clock out',NULL,'2025-11-15','17:08','1763201293000'),(50,1,'Hadir','Clock In',NULL,'2025-11-15','17:08','1763201319000'),(51,1,'Hadir','Clock In',NULL,'2025-11-15','17:08','1763201328000'),(52,1,'Hadir','Clock In',NULL,'2025-11-15','17:14','1763201667000'),(53,1,'Hadir','Clock In',NULL,'2025-11-15','17:14','1763201694000'),(54,1,'Hadir','Clock out',NULL,'2025-11-15','17:15','1763201717000'),(55,1,'Hadir','Clock out',NULL,'2025-11-15','17:15','1763201730000'),(57,1,'Hadir','Clock In',0,'2025-11-16','15:19','1763281182000'),(58,2,'Hadir','Clock out',60000,'2025-11-16','15:19','1763281196000'),(59,2,'Hadir','Clock In',0,'2025-11-16','15:20','1763281229000'),(60,2,'Hadir','Clock out',70000,'2025-11-16','15:20','1763281259000');
/*!40000 ALTER TABLE `attandance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costs`
--

DROP TABLE IF EXISTS `costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` int NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costs`
--

LOCK TABLES `costs` WRITE;
/*!40000 ALTER TABLE `costs` DISABLE KEYS */;
INSERT INTO `costs` VALUES (1,'2025-07-01',125000,'Sewa','Bayar sewa tanah'),(3,'2025-07-01',60000,'Bahan-bahan','Beli bakso, kerupuk, cabai'),(4,'2025-07-02',45000,'Listrik','Bayar listrik bulanan'),(5,'2025-07-02',220000,'Bahan-bahan','Beli cabai 1kg, saus 10 botol, kerupuk 20 toples, garam sebungkus, miyak 10 liter, kecap 5 botol, es batu 1 kulkas, kopi abc 20 renceng, kopi kapal api 10 renceng, susu 2 renceng'),(6,'2025-07-10',20000,'Perbaikan','Perbaikan Lampu'),(7,'2025-07-10',150000,'Sewa','Sewa Warung'),(8,'2025-07-10',50000,'Listrik','Bayar Air + listrik'),(10,'2025-07-11',40000,'Bahan-bahan','Restok Kerupuk'),(11,'2025-07-24',30000,'Listrik','Listril + lampi'),(12,'2025-08-03',40000,'Listrik','Listrik'),(13,'2025-08-03',60000,'Bahan-bahan','Bahan dagangan'),(14,'2025-08-08',40000,'Sewa','Tes aja'),(15,'2025-11-16',500000,'Bahan-bahan','Tes aja'),(16,'2025-11-15',6000,'Listrik','Tes'),(17,'2025-11-14',2000000,'Sewa','Tes aja'),(18,'2025-12-18',200000,'sewa','sewa');
/*!40000 ALTER TABLE `costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_fingerprints`
--

DROP TABLE IF EXISTS `device_fingerprints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_fingerprints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fingerprint` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_seen` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fingerprint` (`fingerprint`),
  KEY `idx_fingerprint` (`fingerprint`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_last_seen` (`last_seen`),
  KEY `idx_device_fingerprints_composite` (`fingerprint`,`last_seen`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_fingerprints`
--

LOCK TABLES `device_fingerprints` WRITE;
/*!40000 ALTER TABLE `device_fingerprints` DISABLE KEYS */;
INSERT INTO `device_fingerprints` VALUES (1,'ff1a2c632d94e581d85896da509a468725bf5159328e3e2fe703b409fdda28b4','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',NULL,'2025-10-15 20:48:04','2025-10-16 00:02:45',1),(2,'fa0843436c5ee8044f559656cee43bef17a31831732ba399f81ea5cb7f5b0827','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',NULL,'2025-10-30 20:08:23','2025-10-30 20:08:23',1),(3,'d7429cb4d6b1ed24f7cf3435c150e704378d28cb27d61168102cbc00da888a04','127.0.0.1','Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',NULL,'2025-10-30 20:40:04','2025-10-30 20:40:04',1),(4,'ed2aa1414a0abb3f428a8134f31d0da4dddfa248a9fa46997341e45451f5afd5','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL,'2025-11-06 23:34:34','2025-11-13 19:51:27',1),(5,'a87b981c787e0c3b38d73483c35a5b3f8c321e14ac1b2fc6b2b2b738f7240fcf','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',NULL,'2025-11-13 19:44:08','2025-11-22 03:22:59',1),(6,'0b398f87b6653c233c583fe3d080d2dea420d255971aa1afcc32c4618954b301','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,'2025-12-18 03:16:30','2026-01-17 18:23:54',1);
/*!40000 ALTER TABLE `device_fingerprints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_metadata`
--

DROP TABLE IF EXISTS `device_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_metadata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_fingerprint_id` int NOT NULL,
  `screen_resolution` varchar(50) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `canvas_fingerprint` varchar(255) DEFAULT NULL,
  `webgl_fingerprint` varchar(255) DEFAULT NULL,
  `browser_info` text,
  `os_info` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device_fingerprint_id` (`device_fingerprint_id`),
  CONSTRAINT `fk_device_metadata_fingerprint` FOREIGN KEY (`device_fingerprint_id`) REFERENCES `device_fingerprints` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_metadata`
--

LOCK TABLES `device_metadata` WRITE;
/*!40000 ALTER TABLE `device_metadata` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `midtrans_settings`
--

DROP TABLE IF EXISTS `midtrans_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `midtrans_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_production` tinyint(1) NOT NULL,
  `merchant_server_key` varchar(100) NOT NULL,
  `client_key` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `midtrans_settings`
--

LOCK TABLES `midtrans_settings` WRITE;
/*!40000 ALTER TABLE `midtrans_settings` DISABLE KEYS */;
INSERT INTO `midtrans_settings` VALUES (1,0,'SB-Mid-server-LmcKxJVkNmmASwHGc2JDV6qw','SB-Mid-client-uj7hKX_GDknpM6wl','Default config. Milik programmer. Hanya untuktest',1);
/*!40000 ALTER TABLE `midtrans_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_discounts`
--

DROP TABLE IF EXISTS `product_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_discounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(20,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `flag_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_discount_active` (`product_id`,`flag_active`,`is_active`,`start_date`,`end_date`),
  CONSTRAINT `fk_discount_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_discounts`
--

LOCK TABLES `product_discounts` WRITE;
/*!40000 ALTER TABLE `product_discounts` DISABLE KEYS */;
INSERT INTO `product_discounts` VALUES (1,70,'percent',20.00,NULL,NULL,1,1,'2025-12-20 21:55:22','2025-12-20 21:55:22'),(2,71,'percent',20.00,NULL,NULL,1,1,'2025-12-20 21:55:56','2025-12-20 21:55:56'),(3,101,'percent',10.00,NULL,NULL,1,0,'2025-12-22 09:03:11','2026-01-02 09:24:51'),(4,91,'percent',50.00,NULL,NULL,1,0,'2025-12-24 02:55:23','2026-01-02 09:24:51'),(5,92,'percent',10.00,NULL,NULL,0,0,'2025-12-24 02:57:34','2026-01-02 09:24:51'),(6,95,'percent',10.00,NULL,NULL,0,1,'2025-12-24 03:00:05','2026-01-02 09:24:51'),(7,93,'percent',10.00,NULL,NULL,1,1,'2025-12-24 03:01:58','2025-12-24 03:01:58'),(8,101,'percent',10.00,NULL,NULL,0,1,'2025-12-24 03:27:57','2025-12-24 03:29:49'),(9,101,'percent',10.00,NULL,NULL,0,1,'2025-12-24 03:32:29','2025-12-24 10:25:54'),(10,101,'fixed',8500.00,NULL,NULL,1,1,'2025-12-24 10:26:23','2025-12-24 10:26:23'),(11,103,'percent',1.00,'2025-12-23','2025-12-25',1,1,'2025-12-24 10:27:55','2025-12-24 10:27:55'),(12,102,'percent',20.00,'2025-12-17',NULL,1,1,'2025-12-24 10:28:26','2025-12-24 10:28:26'),(13,100,'percent',20.00,NULL,'2025-12-25',1,1,'2025-12-24 10:28:46','2025-12-24 10:28:46'),(14,98,'percent',50.00,NULL,'2025-12-23',1,1,'2025-12-24 10:41:26','2025-12-24 10:41:26'),(15,92,'percent',10.00,'2025-12-25',NULL,1,1,'2025-12-24 11:09:17','2025-12-24 11:09:17'),(16,95,'percent',20.00,'2025-12-25',NULL,1,1,'2025-12-24 11:16:48','2025-12-24 11:16:48'),(17,98,'percent',10.00,NULL,NULL,1,1,'2025-12-24 13:22:10','2025-12-24 13:22:10'),(18,91,'percent',20.00,NULL,NULL,1,1,'2025-12-24 13:22:43','2025-12-24 13:22:43'),(19,95,'percent',50.00,NULL,NULL,0,1,'2025-12-24 13:24:16','2025-12-24 13:24:19'),(20,103,'percent',10.00,'2025-12-26',NULL,1,1,'2025-12-24 13:44:23','2025-12-24 13:44:23'),(21,111,'percent',20.00,NULL,NULL,1,1,'2026-01-02 08:53:13','2026-01-02 08:53:13'),(22,112,'percent',10.00,NULL,NULL,1,1,'2026-01-02 09:01:42','2026-01-02 09:01:42');
/*!40000 ALTER TABLE `product_discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `purchase_price` int NOT NULL,
  `price` int NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `subcategory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deprecated_code` int NOT NULL,
  `origin_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (70,'Bakso Cuangki',3000,5000,'687b3fd6cb080.jpeg','Makanan','Bakso',2,0),(71,'Bakso Malang',4000,10000,'687b40177f14f.jpeg','Makanan','Bakso',2,0),(72,'Bakso Mercon',7000,15000,'687b403550cb4.jpeg','Makanan','Bakso',2,72),(73,'Bakso Mercon',7000,16000,'687b403550cb4.jpeg','Makanan','Bakso',2,72),(75,'Nasi Goreng Spesial',5000,10000,'687bde756e030.webp','Makanan','Nasi Goreng',2,0),(76,'Nasi Goreng Pedas',5000,10000,'687bdea1400bf.jpeg','Makanan','Nasi Goreng',2,0),(77,'Kopi Luak',2000,5000,'687be0c43dce2.jpeg','Minuman','Kopi',2,0),(78,'Es Teh Manis',1000,4000,'687be0fe4e274.jpeg','Minuman','Teh',2,0),(79,'Bakso Mercon',10000,20000,'687c5614f0e70.jpeg','Makanan','Bakso',2,0),(80,'Mie balado',3000,10000,'687c5686310a5.jpeg','Makanan','Mie',2,0),(81,'Ayam Geprek',6000,14000,'687c56eb83c6e.jpeg','Makanan','Ayam',2,0),(82,'Kopi ABC',1000,4000,'687c57a90b756.png','Minuman','Kopi',2,0),(83,'Sosis',500,1000,'687c57d247d47.png','Makanan','Sosis',2,0),(84,'Kerupuk Udang',1000,2000,'687c5811a75d9.jpeg','Makanan','Kerupuk',2,0),(85,'Kerupuk Jengkol',1000,2000,'687c582dad158.jpeg','Makanan','Kerupuk',2,0),(86,'Bakso Mercon',8000,20000,'687c5ac4adfb5.jpeg','Makanan','Bakso',0,0),(87,'Bakso Tusuk',2000,5000,'687c5b32ceff8.jpeg','Makanan','Bakso',0,0),(88,'Nasi Putih',3000,5000,'687c5bd5423f2.jpeg','Makanan','Nasi',0,0),(89,'Soto Bekasi',8000,13000,'687c5c3735850.jpeg','Makanan','Soto',0,0),(90,'Aqua Botol - M 600ml',3000,5000,'687c5ca077b7d.jpeg','Minuman','Aqua',0,0),(91,'Aqua Botol - L 1500ml',5000,8000,'687c5d2f93853.jpeg','Minuman','Aqua',0,0),(92,'Teh Pucuk Harum',2500,4000,'687c5d8e7ce26.jpeg','Minuman','Teh',0,0),(93,'Kopi ABC Susu',3000,6000,'687c5e48c1a5e.jpeg','Minuman','Kopi',0,0),(94,'Susu Indomil - Botol 450ml',1500,3000,'687c5efc0d964.jpeg','Minuman','Susu',0,0),(95,'Susu Indomilk - Kotak 800ml',5000,8000,'687c5f2004e87.jpeg','Minuman','Susu',1,95),(96,'Sosis',500,1000,'687c605e08d36.jpeg','Makanan','Sosis',1,96),(97,'Sosis',500,2000,'687c605e08d36.jpeg','Makanan','Sosis',1,96),(98,'Sosis',500,1500,'687c605e08d36.jpeg','Makanan','Sosis',0,96),(100,'Jasa mabar Minecarft',1000,5000,'68bbab36c25dc.png','Jasa',' ',0,0),(101,'Ramen kususss',6000,10000,'68c0f5c3baa14.jpg','Makanan','',0,0),(102,'a',1000,1000,'6943e2c039356.png','Makanan','',0,0),(103,'a',10001,100011,'6943e2da1bfa1.jpg','Makanan','',0,0),(106,'Test produk',10000,15000,'default.jpg','Makanan',NULL,0,0),(107,'test produk 2',10000,20000,'default.jpg','Makanan',NULL,0,107),(108,'test produk 3',10000,20000,'default.jpg','Makanan',NULL,0,0),(109,'Test produk 4',10000,20000,'default.jpg','Makanan',NULL,1,109),(110,'Test produk 4',10000,10000,'default.jpg','Makanan',NULL,0,109),(111,'test produk 5',5000,15000,'default.jpg','Makanan',NULL,1,111),(112,'test produk 5',10000,40000,'default.jpg','Makanan',NULL,1,111),(113,'test produk 5',10000,15000,'default.jpg','Makanan',NULL,0,111);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate_limit_config`
--

DROP TABLE IF EXISTS `rate_limit_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rate_limit_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `endpoint` varchar(255) NOT NULL,
  `max_requests` int DEFAULT '100',
  `time_window` int DEFAULT '3600',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_endpoint` (`endpoint`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate_limit_config`
--

LOCK TABLES `rate_limit_config` WRITE;
/*!40000 ALTER TABLE `rate_limit_config` DISABLE KEYS */;
INSERT INTO `rate_limit_config` VALUES (1,'login',5,900,1,'2025-10-16 03:47:56','2025-10-16 03:47:56'),(2,'api/*',100,3600,1,'2025-10-16 03:47:56','2025-10-16 03:47:56'),(3,'dashboard',200,3600,1,'2025-10-16 03:47:56','2025-10-16 03:47:56'),(4,'*',1000,3600,1,'2025-10-16 03:47:56','2025-10-16 03:47:56');
/*!40000 ALTER TABLE `rate_limit_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate_limit_logs`
--

DROP TABLE IF EXISTS `rate_limit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rate_limit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `request_time` int NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `user_agent` text,
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_request_time` (`request_time`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_rate_limit_composite` (`device_id`,`request_time`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate_limit_logs`
--

LOCK TABLES `rate_limit_logs` WRITE;
/*!40000 ALTER TABLE `rate_limit_logs` DISABLE KEYS */;
INSERT INTO `rate_limit_logs` VALUES (68,'dev_0b398f87b6653c23_1768699230',1768699230,'127.0.0.1',NULL,NULL),(69,'dev_0b398f87b6653c23_1768699233',1768699233,'127.0.0.1',NULL,NULL),(70,'dev_0b398f87b6653c23_1768699435',1768699435,'127.0.0.1',NULL,NULL);
/*!40000 ALTER TABLE `rate_limit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `rate_limit_monitoring`
--

DROP TABLE IF EXISTS `rate_limit_monitoring`;
/*!50001 DROP VIEW IF EXISTS `rate_limit_monitoring`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `rate_limit_monitoring` AS SELECT 
 1 AS `device_id`,
 1 AS `ip_address`,
 1 AS `user_agent`,
 1 AS `request_count`,
 1 AS `first_request`,
 1 AS `last_request`,
 1 AS `last_seen`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staffs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
INSERT INTO `staffs` VALUES (1,'admin','12345',NULL),(2,'developer','54321',NULL),(3,'owner','owner',1);
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (2,'meja-1'),(3,'meja-2'),(4,'meja-3'),(5,'meja-4');
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_details`
--

DROP TABLE IF EXISTS `transaction_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_discount_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `sub_total` int NOT NULL,
  `sub_profit` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transaction_details_product_discount` (`product_discount_id`),
  KEY `idx_td_transaction_id` (`transaction_id`),
  CONSTRAINT `fk_transaction_details_product_discount` FOREIGN KEY (`product_discount_id`) REFERENCES `product_discounts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=487 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_details`
--

LOCK TABLES `transaction_details` WRITE;
/*!40000 ALTER TABLE `transaction_details` DISABLE KEYS */;
INSERT INTO `transaction_details` VALUES (239,111,70,NULL,1,5000,5000),(240,111,72,NULL,1,15000,15000),(241,112,73,NULL,2,32000,32000),(242,113,70,NULL,1,5000,5000),(243,113,71,NULL,1,10000,10000),(244,113,76,NULL,2,20000,20000),(245,113,75,NULL,2,20000,20000),(246,114,70,NULL,2,10000,10000),(247,114,71,NULL,1,10000,10000),(248,114,75,NULL,1,10000,10000),(249,114,78,NULL,3,12000,12000),(250,114,77,NULL,2,10000,10000),(251,114,76,NULL,2,20000,20000),(252,115,70,NULL,2,10000,10000),(253,115,78,NULL,1,4000,4000),(254,116,71,NULL,1,10000,10000),(255,116,78,NULL,1,4000,4000),(256,117,77,NULL,1,5000,5000),(257,117,76,NULL,1,10000,10000),(258,118,86,NULL,1,20000,20000),(259,118,92,NULL,2,8000,8000),(260,119,86,NULL,1,20000,20000),(261,119,88,NULL,1,5000,5000),(262,119,93,NULL,1,6000,6000),(263,120,89,NULL,1,13000,13000),(264,120,88,NULL,1,5000,5000),(265,120,91,NULL,1,8000,8000),(266,120,96,NULL,2,2000,2000),(267,121,93,NULL,1,6000,6000),(268,122,86,NULL,1,20000,20000),(269,122,92,NULL,2,8000,8000),(270,123,89,NULL,2,26000,26000),(271,123,92,NULL,1,4000,4000),(272,123,96,NULL,1,1000,1000),(273,124,87,NULL,2,10000,10000),(274,124,94,NULL,1,3000,3000),(275,125,94,NULL,2,6000,6000),(276,126,88,NULL,2,10000,10000),(277,127,92,NULL,2,8000,8000),(278,128,90,NULL,1,5000,5000),(279,129,95,NULL,2,16000,16000),(280,130,86,NULL,2,40000,40000),(281,130,87,NULL,2,10000,10000),(282,130,88,NULL,2,10000,10000),(283,130,89,NULL,1,13000,13000),(284,130,90,NULL,1,5000,5000),(285,130,91,NULL,2,16000,16000),(286,130,92,NULL,2,8000,8000),(287,130,93,NULL,2,12000,12000),(288,130,94,NULL,2,6000,6000),(289,130,95,NULL,1,8000,8000),(290,130,96,NULL,2,2000,2000),(291,131,86,NULL,2,40000,40000),(292,131,87,NULL,2,10000,10000),(293,131,90,NULL,2,10000,10000),(294,131,93,NULL,2,12000,12000),(295,131,94,NULL,2,6000,6000),(296,132,93,NULL,4,24000,24000),(297,132,89,NULL,2,26000,26000),(298,133,93,NULL,1,6000,6000),(299,134,93,NULL,8,48000,48000),(300,134,96,NULL,4,4000,4000),(301,135,86,NULL,1,20000,20000),(302,136,88,NULL,1,5000,5000),(303,136,94,NULL,2,6000,6000),(304,136,96,NULL,1,1000,1000),(305,137,88,NULL,2,10000,10000),(306,137,89,NULL,2,26000,26000),(307,138,94,NULL,1,3000,3000),(308,139,97,NULL,2,4000,4000),(309,139,93,NULL,2,12000,12000),(310,140,98,NULL,2,3000,3000),(311,140,87,NULL,1,5000,5000),(312,140,92,NULL,2,8000,8000),(313,141,92,NULL,2,8000,8000),(314,142,88,NULL,2,10000,10000),(315,142,89,NULL,2,26000,26000),(316,143,86,NULL,2,40000,40000),(317,143,87,NULL,1,5000,5000),(318,143,88,NULL,1,5000,5000),(319,144,98,NULL,1,1500,1500),(320,144,88,NULL,4,20000,20000),(321,144,89,NULL,2,26000,26000),(322,144,87,NULL,1,5000,5000),(323,144,86,NULL,2,40000,40000),(324,145,94,NULL,1,3000,3000),(325,145,95,NULL,2,16000,16000),(326,146,94,NULL,1,3000,3000),(327,147,87,NULL,1,5000,5000),(328,147,94,NULL,2,6000,6000),(329,148,88,NULL,1,5000,5000),(330,148,87,NULL,1,5000,5000),(331,148,91,NULL,2,16000,16000),(332,149,86,NULL,2,40000,40000),(333,149,90,NULL,2,10000,10000),(334,149,93,NULL,2,12000,12000),(335,149,95,NULL,6,48000,48000),(336,150,94,NULL,2,6000,6000),(337,150,90,NULL,2,10000,10000),(338,151,91,NULL,2,16000,16000),(339,151,87,NULL,1,5000,5000),(340,152,93,NULL,1,6000,6000),(341,152,91,NULL,2,16000,16000),(342,153,87,NULL,2,10000,10000),(343,153,89,NULL,2,26000,26000),(344,154,87,NULL,2,10000,10000),(345,154,89,NULL,2,26000,26000),(346,155,86,NULL,1,20000,20000),(347,155,89,NULL,1,13000,13000),(348,155,94,NULL,2,6000,6000),(349,156,92,NULL,1,4000,4000),(350,157,86,NULL,2,40000,40000),(351,158,86,NULL,6,120000,120000),(352,158,87,NULL,2,10000,10000),(353,158,88,NULL,2,10000,10000),(354,158,89,NULL,3,39000,39000),(355,158,90,NULL,2,10000,10000),(356,158,95,NULL,4,32000,32000),(357,158,98,NULL,2,3000,3000),(358,158,91,NULL,2,16000,16000),(359,158,92,NULL,2,8000,8000),(360,158,94,NULL,2,6000,6000),(361,158,93,NULL,2,12000,12000),(362,159,89,NULL,1,13000,13000),(363,160,87,NULL,1,5000,5000),(364,161,86,NULL,1,20000,20000),(365,161,89,NULL,1,13000,13000),(366,162,87,NULL,1,5000,5000),(367,162,89,NULL,1,13000,13000),(368,162,98,NULL,1,1500,1500),(369,163,100,NULL,2,10000,10000),(370,164,100,NULL,2,10000,10000),(371,165,88,NULL,1,5000,5000),(372,166,93,NULL,1,6000,6000),(373,167,98,NULL,1,1500,1500),(374,168,94,NULL,1,3000,3000),(375,168,95,NULL,1,8000,8000),(376,169,95,NULL,1,8000,8000),(377,170,94,NULL,1,3000,3000),(378,171,87,NULL,1,5000,5000),(379,171,88,NULL,1,5000,5000),(380,172,94,NULL,1,3000,3000),(381,172,95,NULL,1,8000,8000),(382,173,91,NULL,1,8000,8000),(383,174,91,NULL,1,8000,8000),(384,175,86,NULL,1,20000,20000),(385,176,87,NULL,1,5000,5000),(386,177,95,NULL,1,8000,8000),(387,178,95,NULL,1,8000,8000),(388,178,98,NULL,1,1500,1500),(389,178,94,NULL,1,3000,3000),(390,179,94,NULL,1,3000,3000),(391,179,98,NULL,2,3000,3000),(392,180,86,NULL,1,20000,20000),(393,180,87,NULL,1,5000,5000),(394,181,98,NULL,1,1500,1500),(395,181,95,NULL,1,8000,8000),(396,182,98,NULL,1,1500,1500),(397,182,95,NULL,1,8000,8000),(398,183,94,NULL,1,3000,3000),(399,183,95,NULL,1,8000,8000),(400,184,101,NULL,1,10000,10000),(401,184,98,NULL,1,1500,1500),(402,185,87,NULL,4,20000,20000),(403,186,93,NULL,2,12000,12000),(404,187,86,NULL,2,40000,40000),(405,188,88,NULL,2,10000,10000),(406,188,89,NULL,1,13000,13000),(407,189,98,NULL,1,1500,1500),(408,190,87,NULL,1,5000,5000),(409,191,88,NULL,1,5000,5000),(410,191,98,NULL,3,4500,4500),(411,192,88,NULL,3,15000,15000),(412,192,89,NULL,1,13000,13000),(413,193,90,NULL,1,5000,5000),(414,193,89,NULL,1,13000,13000),(415,194,88,NULL,2,10000,10000),(416,195,87,NULL,1,5000,5000),(417,195,94,NULL,1,3000,3000),(418,195,86,NULL,4,80000,80000),(419,196,95,NULL,2,16000,16000),(420,196,101,NULL,1,10000,10000),(421,196,86,NULL,3,60000,60000),(422,196,88,NULL,1,5000,5000),(423,197,86,NULL,3,60000,60000),(424,197,87,NULL,3,15000,15000),(425,197,88,NULL,1,5000,5000),(426,198,98,NULL,1,1500,1500),(427,198,95,NULL,1,8000,8000),(428,198,94,NULL,1,3000,3000),(429,199,87,NULL,1,5000,5000),(430,199,86,NULL,1,20000,20000),(431,200,100,NULL,1,5000,5000),(432,200,98,NULL,1,1500,1500),(433,201,87,NULL,1,5000,5000),(434,201,88,NULL,1,5000,5000),(435,201,95,NULL,1,8000,8000),(436,201,98,NULL,1,1500,1500),(437,202,86,NULL,1,20000,20000),(438,202,87,NULL,1,5000,5000),(439,202,88,NULL,1,5000,5000),(440,202,89,NULL,1,13000,13000),(441,203,86,NULL,1,20000,20000),(442,203,87,NULL,1,5000,5000),(443,203,88,NULL,1,5000,5000),(444,203,89,NULL,1,13000,13000),(445,204,94,NULL,1,3000,3000),(446,204,95,NULL,1,8000,8000),(447,205,86,NULL,1,20000,20000),(448,205,87,NULL,1,5000,5000),(449,206,87,NULL,1,5000,5000),(450,206,89,NULL,1,13000,13000),(459,212,102,12,4,3200,3200),(460,212,103,11,3,297033,297033),(461,212,101,10,3,4500,4500),(462,212,89,NULL,3,39000,39000),(463,213,102,12,4,3200,3200),(464,213,103,11,3,297033,297033),(465,213,101,10,3,4500,4500),(466,213,89,NULL,3,39000,39000),(467,213,98,17,2,2700,2700),(468,213,93,7,2,10800,10800),(469,213,94,NULL,2,6000,6000),(470,214,91,18,1,6400,6400),(471,214,102,12,2,1600,1600),(472,214,95,NULL,1,8000,8000),(473,215,91,18,2,12800,12800),(474,215,86,NULL,1,20000,20000),(475,216,95,16,2,12800,2800),(476,216,86,NULL,1,20000,12000),(477,216,87,NULL,1,5000,3000),(478,217,109,NULL,2,40000,20000),(479,217,100,NULL,1,5000,4000),(480,218,110,NULL,1,10000,0),(481,219,111,NULL,1,15000,10000),(482,220,111,21,1,12000,7000),(483,221,112,NULL,1,40000,30000),(484,222,112,22,1,36000,26000),(485,223,86,NULL,3,60000,36000),(486,224,87,NULL,1,5000,3000);
/*!40000 ALTER TABLE `transaction_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date NOT NULL,
  `total` int NOT NULL,
  `profit` int NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_key` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_req_by_user` int DEFAULT NULL,
  `table_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_search` (`payment_method`,`payment_status`,`date`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (122,NULL,'2025-07-21',28000,28000,'Transfer','Settlement','861248119','b350ea7a-24f0-4dc5-b480-35d1316c3318',NULL,NULL),(123,NULL,'2025-07-22',31000,31000,'Transfer','Pending','577803106','137158b9-df35-4c9d-9ce5-d3ae7dcd808f',NULL,NULL),(124,NULL,'2025-07-23',13000,13000,'Transfer','Pending','294719876','bccd5cf4-6c84-4ee2-8251-e3e0d8513986',NULL,NULL),(125,NULL,'2025-07-24',6000,6000,'Transfer','Pending','735384494','428555b0-8533-44e9-af9f-ca3be74cc5a3',NULL,NULL),(126,NULL,'2025-07-25',10000,10000,'Tunai','Sudah dibayar','','',NULL,NULL),(127,NULL,'2025-07-26',8000,8000,'Tunai','Sudah dibayar','','',NULL,NULL),(128,NULL,'2025-07-20',5000,5000,'Tunai','Sudah dibayar','','',NULL,NULL),(129,NULL,'2025-07-20',16000,16000,'Transfer','Pending','916979305','de3bc173-0ec6-4e16-b951-836f5e418be5',NULL,NULL),(131,NULL,'2025-07-20',78000,78000,'Transfer','Pending','547581206','b8e959c2-c733-4003-98ae-01394bb3b48e',NULL,NULL),(132,NULL,'2025-07-20',50000,50000,'Transfer','Pending','298661500','93235913-59dc-4fb0-823d-8edb359a6bbb',NULL,NULL),(133,NULL,'2025-07-20',6000,6000,'Tunai','Sudah dibayar','','',NULL,NULL),(134,NULL,'2025-07-24',52000,52000,'Tunai','Sudah dibayar','','',NULL,NULL),(135,NULL,'2025-07-24',20000,20000,'Tunai','Sudah dibayar','','',NULL,NULL),(136,NULL,'2025-08-03',12000,12000,'Tunai','Sudah dibayar','','',NULL,NULL),(137,NULL,'2025-08-03',36000,36000,'Transfer','Pending','1850346221','6838cc5c-67d7-4e66-b243-1f1847667572',NULL,NULL),(138,NULL,'2025-08-03',3000,3000,'Transfer','Pending','1087301967','aab47785-c328-488a-b58d-805fa8c13552',NULL,NULL),(139,NULL,'2025-08-03',16000,16000,'Transfer','Pending','1749318529','b3a78725-1355-4a05-a5a6-30e360247fa9',NULL,NULL),(140,NULL,'2025-08-03',16000,16000,'Transfer','Pending','573552804','09d8eb05-1935-42d6-a99a-3a8f06d61084',NULL,NULL),(141,NULL,'2025-08-03',8000,8000,'Tunai','Sudah dibayar','','',NULL,NULL),(142,NULL,'2025-08-03',36000,36000,'Tunai','Sudah dibayar','','',NULL,NULL),(143,NULL,'2025-08-04',50000,50000,'Tunai','Sudah dibayar','','',NULL,NULL),(144,NULL,'2025-08-04',92500,92500,'Transfer','Pending','1357594187','2f0c4568-5e23-4421-b8fa-2e0bae3a8ec2',NULL,NULL),(145,NULL,'2025-08-05',19000,19000,'Transfer','Pending','1573814266','8e14a0fc-ffcb-493a-9ce6-d4b5cd2f69b5',NULL,NULL),(146,NULL,'2025-08-05',3000,3000,'Tunai','Belum dibayar','','',NULL,NULL),(147,NULL,'2025-08-06',11000,11000,'Transfer','Pending','397992734','9c1954c4-2564-4853-a236-0749f07335b5',NULL,NULL),(148,NULL,'2025-07-15',26000,26000,'Transfer','Pending','932528205','1e2b19a5-cc7b-4385-9e98-ad9d98bacf4c',NULL,NULL),(149,NULL,'2025-07-16',110000,110000,'Transfer','Pending','959134605','d406ddec-f0cf-4d37-b3da-8241b3f535c5',NULL,NULL),(150,NULL,'2025-07-18',16000,16000,'Tunai','Belum dibayar','','',NULL,NULL),(151,NULL,'2025-07-19',21000,21000,'Transfer','Settlement','352298822','8e5e7a5c-c87b-465d-bfe8-6d75d8bb4792',NULL,NULL),(152,NULL,'2025-07-20',22000,22000,'Transfer','Settlement','1006495072','4bfc781e-af2a-4e70-afde-a656dfefdb47',NULL,NULL),(153,NULL,'2025-07-21',36000,36000,'Transfer','Settlement','1820456580','9d0ccf04-7238-477d-96a8-9d4879443cd8',NULL,NULL),(154,NULL,'2025-07-22',36000,36000,'Tunai','Sudah dibayar','','',NULL,NULL),(155,NULL,'2025-07-23',39000,39000,'Transfer','Settlement','2100297288','1f515a99-65a4-466f-8a8d-719f4e3e865a',NULL,NULL),(156,NULL,'2025-08-07',4000,4000,'Transfer','Settlement','1674086016','8cf7e8c7-b36d-4c67-ac93-b5d420cbf2af',NULL,NULL),(157,NULL,'2025-08-08',40000,40000,'Tunai','Sudah dibayar','','',NULL,NULL),(158,NULL,'2025-08-08',266000,266000,'Transfer','Pending','1615718826','6e3e35bb-a974-4a3a-8ea2-f7b368e2d745',NULL,NULL),(159,NULL,'2025-08-16',13000,13000,'Tunai','Sudah dibayar','','',NULL,NULL),(160,NULL,'2025-08-16',5000,5000,'Tunai','Sudah dibayar','','',NULL,NULL),(161,NULL,'2025-09-06',33000,33000,'Tunai','Sudah dibayar','','',NULL,NULL),(162,NULL,'2025-09-06',19500,19500,'QRIS','Sudah dibayar','','',NULL,NULL),(163,NULL,'2025-09-06',10000,10000,'QRIS','Sudah dibayar','','',NULL,NULL),(164,NULL,'2025-09-06',10000,8000,'QRIS','Sudah dibayar','','',NULL,NULL),(165,NULL,'2025-09-08',5000,2000,'Transfer','Settlement','677630907','9f1c2688-3225-4639-9044-7bdef78879cd',NULL,NULL),(166,NULL,'2025-09-08',6000,3000,'Transfer','Pending','734389597','b86d69ca-fe8a-4c1b-bb2f-e6c59af1678d',NULL,NULL),(167,NULL,'2025-09-08',1500,1000,'Transfer','Settlement','141564511','778a1614-cf65-4888-a213-2c38c17e888a',NULL,NULL),(168,NULL,'2025-09-10',11000,4500,'Tunai','Sudah dibayar','','',NULL,NULL),(169,NULL,'2025-09-10',8000,3000,'QRIS','Sudah dibayar','','',NULL,NULL),(170,NULL,'2025-09-10',3000,1500,'Transfer','Pending','1475846783','11934fe7-35f2-4d0f-a920-e33954c0f653',NULL,NULL),(171,NULL,'2025-10-07',10000,5000,'Tunai','Sudah dibayar','','',NULL,NULL),(172,NULL,'2025-10-31',11000,4500,'Tunai','Sudah dibayar','','',1,NULL),(173,NULL,'2025-11-15',8000,3000,'Tunai','Sudah dibayar','','',NULL,NULL),(175,NULL,'2025-11-15',20000,12000,'Tunai','Sudah dibayar','','',NULL,NULL),(176,NULL,'2025-11-15',5000,3000,'Tunai','Sudah dibayar','','',NULL,NULL),(177,NULL,'2025-11-15',8000,3000,'Tunai','Sudah dibayar','','',NULL,NULL),(178,NULL,'2025-11-15',12500,5500,'Tunai','Sudah dibayar','','',NULL,NULL),(179,NULL,'2025-11-15',6000,3500,'Tunai','Sudah dibayar','','',NULL,NULL),(180,NULL,'2025-11-15',25000,15000,'Tunai','Sudah dibayar','','',1,NULL),(181,NULL,'2025-11-15',9500,4000,'Tunai','Sudah dibayar','','',NULL,NULL),(182,'Bambang','2025-11-15',9500,4000,'Tunai','Sudah dibayar','','',NULL,NULL),(183,'Budi','2025-11-15',11000,4500,'Tunai','Sudah dibayar','','',1,NULL),(184,'Budi','2025-11-15',11500,5000,'Tunai','Sudah dibayar','','',1,NULL),(185,'Joko','2025-11-15',20000,12000,'Tunai','Sudah dibayar','','',1,NULL),(186,'a','2025-11-15',12000,6000,'Tunai','Sudah dibayar','','',1,NULL),(187,'a','2025-11-15',40000,24000,'Tunai','Sudah dibayar','','',1,NULL),(189,'a','2025-11-15',1500,1000,'Tunai','Sudah dibayar','','',1,NULL),(190,'a','2025-11-15',5000,3000,'Tunai','Sudah dibayar','','',NULL,NULL),(191,'budi','2025-11-15',9500,5000,'Tunai','Sudah dibayar','','',1,NULL),(192,'Joko','2025-11-15',28000,11000,'Tunai','Sudah dibayar','','',1,NULL),(193,'a','2025-11-15',18000,7000,'Tunai','Sudah dibayar','','',1,NULL),(194,'a','2025-11-15',10000,4000,'Tunai','Sudah dibayar','','',1,NULL),(195,'Damar','2025-11-16',88000,52500,'Tunai','Sudah dibayar','','',NULL,NULL),(196,NULL,'2025-11-16',91000,48000,'Tunai','Sudah dibayar','','',NULL,NULL),(197,'2000000','2025-11-16',80000,47000,'QRIS','Sudah dibayar','','',NULL,NULL),(198,NULL,'2025-11-19',12500,5500,'Tunai','Sudah dibayar','','',NULL,NULL),(199,NULL,'2025-11-20',25000,15000,'Tunai','Sudah dibayar','','',NULL,NULL),(200,'a','2025-11-20',6500,5000,'Tunai','Sudah dibayar','','',1,NULL),(201,'budi','2025-11-21',19500,9000,'QRIS','Sudah dibayar','','',NULL,NULL),(202,'budi','2025-11-21',43000,22000,'Tunai','Sudah dibayar','','',1,NULL),(203,'budi','2025-11-21',43000,22000,'Tunai','Sudah dibayar','','',1,NULL),(204,'dimas','2025-11-21',11000,4500,'Tunai','Sudah dibayar','','',1,NULL),(205,'bambang','2025-11-21',25000,15000,'Tunai','Belum dibayar','','',1,'meja-1'),(206,NULL,'2025-12-20',18000,8000,'Tunai','Belum dibayar','','',NULL,NULL),(207,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(208,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(209,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(210,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(211,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(212,'Rido','2025-12-24',343733,267730,'Tunai','Belum dibayar','','',NULL,NULL),(213,'Sultan','2025-12-24',363233,277230,'Tunai','Belum dibayar','','',NULL,NULL),(214,'fariz','2025-12-24',16000,4000,'Tunai','Belum dibayar','','',NULL,NULL),(215,NULL,'2025-12-24',32800,14800,'Tunai','Belum dibayar','','',NULL,NULL),(216,NULL,'2025-12-24',37800,17800,'Tunai','Belum dibayar','','',NULL,NULL),(217,NULL,'2026-01-02',45000,24000,'Tunai','Belum dibayar','','',NULL,NULL),(218,NULL,'2026-01-02',10000,0,'Tunai','Belum dibayar','','',NULL,NULL),(219,NULL,'2026-01-02',15000,10000,'Tunai','Belum dibayar','','',NULL,NULL),(220,NULL,'2026-01-02',12000,7000,'Tunai','Belum dibayar','','',NULL,NULL),(221,NULL,'2026-01-02',40000,30000,'Tunai','Belum dibayar','','',NULL,NULL),(222,NULL,'2026-01-02',36000,26000,'Tunai','Belum dibayar','','',NULL,NULL),(223,NULL,'2026-01-02',60000,36000,'Tunai','Belum dibayar','','',NULL,NULL),(224,NULL,'2026-01-03',5000,3000,'Tunai','Belum dibayar','','',NULL,NULL);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_products_with_discount`
--

DROP TABLE IF EXISTS `view_products_with_discount`;
/*!50001 DROP VIEW IF EXISTS `view_products_with_discount`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_products_with_discount` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `purchase_price`,
 1 AS `price`,
 1 AS `image`,
 1 AS `category`,
 1 AS `subcategory`,
 1 AS `deprecated_code`,
 1 AS `origin_id`,
 1 AS `discount_type`,
 1 AS `discount_value`,
 1 AS `discount_id`,
 1 AS `final_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_transaction_details`
--

DROP TABLE IF EXISTS `view_transaction_details`;
/*!50001 DROP VIEW IF EXISTS `view_transaction_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_transaction_details` AS SELECT 
 1 AS `transaction_detail_id`,
 1 AS `transaction_id`,
 1 AS `product_id`,
 1 AS `product_discount_id`,
 1 AS `quantity`,
 1 AS `sub_total`,
 1 AS `sub_profit`,
 1 AS `product_name`,
 1 AS `product_price`,
 1 AS `purchase_price`,
 1 AS `image`,
 1 AS `category`,
 1 AS `subcategory`,
 1 AS `deprecated_code`,
 1 AS `profit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_transactions`
--

DROP TABLE IF EXISTS `view_transactions`;
/*!50001 DROP VIEW IF EXISTS `view_transactions`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_transactions` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `date`,
 1 AS `total`,
 1 AS `profit`,
 1 AS `payment_method`,
 1 AS `payment_status`,
 1 AS `payment_key`,
 1 AS `payment_token`,
 1 AS `is_req_by_user`,
 1 AS `table_name`,
 1 AS `total_amount`,
 1 AS `total_profit`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'mikro_maju'
--
/*!50003 DROP PROCEDURE IF EXISTS `CleanupOldRateLimitData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CleanupOldRateLimitData`()
BEGIN
    -- Hapus log rate limiting > 7 hari
    DELETE FROM rate_limit_logs WHERE request_time < (UNIX_TIMESTAMP() - (7 * 24 * 3600));

    -- Hapus device fingerprints nonaktif > 30 hari
    DELETE FROM device_fingerprints 
    WHERE is_active = 0 
      AND last_seen < (NOW() - INTERVAL 30 DAY);

    -- Optimasi tabel
    OPTIMIZE TABLE rate_limit_logs;
    OPTIMIZE TABLE device_fingerprints;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `rate_limit_monitoring`
--

/*!50001 DROP VIEW IF EXISTS `rate_limit_monitoring`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `rate_limit_monitoring` AS select `rl`.`device_id` AS `device_id`,`df`.`ip_address` AS `ip_address`,`df`.`user_agent` AS `user_agent`,count(`rl`.`id`) AS `request_count`,min(`rl`.`request_time`) AS `first_request`,max(`rl`.`request_time`) AS `last_request`,`df`.`last_seen` AS `last_seen` from (`rate_limit_logs` `rl` left join `device_fingerprints` `df` on((`rl`.`device_id` like concat('%',`df`.`fingerprint`,'%')))) where (`rl`.`request_time` >= (unix_timestamp() - 3600)) group by `rl`.`device_id`,`df`.`ip_address`,`df`.`user_agent`,`df`.`last_seen` order by `request_count` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_products_with_discount`
--

/*!50001 DROP VIEW IF EXISTS `view_products_with_discount`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_products_with_discount` AS select `p`.`id` AS `id`,`p`.`name` AS `name`,`p`.`purchase_price` AS `purchase_price`,`p`.`price` AS `price`,`p`.`image` AS `image`,`p`.`category` AS `category`,`p`.`subcategory` AS `subcategory`,`p`.`deprecated_code` AS `deprecated_code`,`p`.`origin_id` AS `origin_id`,`d`.`type` AS `discount_type`,`d`.`value` AS `discount_value`,`d`.`id` AS `discount_id`,(case when (`d`.`type` = 'percent') then (`p`.`price` - ((`p`.`price` * `d`.`value`) / 100)) when (`d`.`type` = 'fixed') then (`p`.`price` - `d`.`value`) else `p`.`price` end) AS `final_price` from (`products` `p` left join `product_discounts` `d` on(((`d`.`product_id` = `p`.`id`) and (`d`.`flag_active` = 1) and (`d`.`is_active` = 1) and ((`d`.`start_date` is null) or (`d`.`start_date` <= curdate())) and ((`d`.`end_date` is null) or (`d`.`end_date` >= curdate()))))) where (`p`.`deprecated_code` = '') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_transaction_details`
--

/*!50001 DROP VIEW IF EXISTS `view_transaction_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_transaction_details` AS select `td`.`id` AS `transaction_detail_id`,`td`.`transaction_id` AS `transaction_id`,`td`.`product_id` AS `product_id`,`td`.`product_discount_id` AS `product_discount_id`,`td`.`quantity` AS `quantity`,`td`.`sub_total` AS `sub_total`,`td`.`sub_profit` AS `sub_profit`,`p`.`name` AS `product_name`,`p`.`price` AS `product_price`,`p`.`purchase_price` AS `purchase_price`,`p`.`image` AS `image`,`p`.`category` AS `category`,`p`.`subcategory` AS `subcategory`,`p`.`deprecated_code` AS `deprecated_code`,((`p`.`price` - `p`.`purchase_price`) * `td`.`quantity`) AS `profit` from (`transaction_details` `td` join `products` `p` on((`p`.`id` = `td`.`product_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_transactions`
--

/*!50001 DROP VIEW IF EXISTS `view_transactions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_transactions` AS select `t`.`id` AS `id`,`t`.`name` AS `name`,`t`.`date` AS `date`,`t`.`total` AS `total`,`t`.`profit` AS `profit`,`t`.`payment_method` AS `payment_method`,`t`.`payment_status` AS `payment_status`,`t`.`payment_key` AS `payment_key`,`t`.`payment_token` AS `payment_token`,`t`.`is_req_by_user` AS `is_req_by_user`,`t`.`table_name` AS `table_name`,sum(`vtd`.`sub_total`) AS `total_amount`,sum(`vtd`.`profit`) AS `total_profit` from (`transactions` `t` join `view_transaction_details` `vtd` on((`vtd`.`transaction_id` = `t`.`id`))) group by `t`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01  8:11:14
