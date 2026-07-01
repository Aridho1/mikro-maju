
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

LOCK TABLES `midtrans_settings` WRITE;
/*!40000 ALTER TABLE `midtrans_settings` DISABLE KEYS */;
INSERT INTO `midtrans_settings` VALUES (1,0,'SB-Mid-server-LmcKxJVkNmmASwHGc2JDV6qw','SB-Mid-client-uj7hKX_GDknpM6wl','Default config. Milik programmer. Hanya untuktest',1);
/*!40000 ALTER TABLE `midtrans_settings` ENABLE KEYS */;
UNLOCK TABLES;