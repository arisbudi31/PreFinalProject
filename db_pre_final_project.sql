-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: finalproject
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `is_like` tinyint NOT NULL DEFAULT '0',
  `created_at` varchar(45) NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES (19,'abfkabf ',NULL,0,0,'19 05 2022 in 11:31:51 pm',59),(20,'safsf baaabab','http://localhost:5000/stories/image_story-1652978220771.jpg',1,1,'19 05 2022 in 11:37:00 pm',59),(22,'yo bisa yoo','http://localhost:5000/stories/image_story-1652978620752.jpg',6,1,'19 05 2022 in 11:43:40 pm',59),(24,'Selamat malam','http://localhost:5000/stories/image_story-1653045681262.jpg',0,0,'20 05 2022 in 06:21:21 pm',60),(26,'post dengan gambar','http://localhost:5000/stories/image_story-1653049993550.jpg',0,0,'20 05 2022 in 07:33:13 pm',65);
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullname` varchar(45) NOT NULL DEFAULT 'Anonim',
  `bio` varchar(250) NOT NULL DEFAULT 'Bio not set yet',
  `image` varchar(250) NOT NULL DEFAULT 'no image',
  `status` varchar(45) NOT NULL DEFAULT 'unverified',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'9b32db43-f486-4789-8deb-a4552c2c6012','arisb31','arisb31@mail.com','$2b$10$veklSR2xQfbTdPTM1KrN3eDOc2/hpDvFwx3UMaxhnhSxs3xevs5Lq','aris budianto','apeper  bkjerbkjeb','aeoiehroaiwehr.jpg',''),(2,'72e2e06c-e6ea-4430-aa4f-b03f2fbe6876','aris_budiy','arisb31@mail.com','$2b$10$zt8URaoTfklHJEZP1DZxG.QO2njX4dohzx13F8qIY7y2VscnbINya','aris budianto','apeper  bkjerbkjeb','aeoiehroaiwehr.jpg',''),(65,'d351de1f-8e4b-4ab5-9bdb-e19a45628ae4','arisbudiyant31','arisbudiyant31@gmail.com','$2b$10$RjDi9AZCm56sSoPedYl28ONBVed.geCMcrupODAGZg7p0QSvJtqAy','Aris Budiyanto','Lorem ipsum dolor six amet','http://localhost:5000/profile/image-1653049953364.jpg','verified');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-20 21:28:40
