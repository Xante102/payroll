CREATE DATABASE  IF NOT EXISTS `payroll3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `payroll3`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: payroll3
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `salaries`
--

DROP TABLE IF EXISTS `salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `dpt_id` int NOT NULL,
  `paycycle_id` int NOT NULL,
  `hrs_id` int NOT NULL,
  `salary` double NOT NULL,
  `overtime` double NOT NULL,
  `total_salary` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK2_dpt_id_idx` (`dpt_id`),
  KEY `FK4_emp_id_idx` (`emp_id`),
  KEY `FK2_paycycle_id_idx` (`paycycle_id`),
  KEY `FK_hrs_id_idx` (`hrs_id`),
  CONSTRAINT `FK2_paycycle_id` FOREIGN KEY (`paycycle_id`) REFERENCES `paycycles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK3_dpt_id` FOREIGN KEY (`dpt_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK4_emp_id` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_hrs_id` FOREIGN KEY (`hrs_id`) REFERENCES `hours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salaries`
--

LOCK TABLES `salaries` WRITE;
/*!40000 ALTER TABLE `salaries` DISABLE KEYS */;
INSERT INTO `salaries` VALUES (1,4,4,1,1,56784,236,457648);
/*!40000 ALTER TABLE `salaries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-19 20:44:02
