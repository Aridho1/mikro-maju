
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