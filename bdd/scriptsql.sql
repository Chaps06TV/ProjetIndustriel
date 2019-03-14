-- MySQL dump 10.16  Distrib 10.1.30-MariaDB, for Win32 (AMD64)
--
-- Host: localhost    Database: bdd_industriel
-- ------------------------------------------------------
-- Server version	10.1.30-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblclient`
--

DROP TABLE IF EXISTS `tblclient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblclient` (
  `clientId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `prenom` varchar(20) DEFAULT NULL,
  `nom` varchar(30) DEFAULT NULL,
  `adresse` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`clientId`),
  UNIQUE KEY `clientId_UNIQUE` (`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbldetail`
--

DROP TABLE IF EXISTS `tbldetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbldetail` (
  `productId` int(10) unsigned NOT NULL,
  `temperature` int(11) DEFAULT NULL,
  `dateProduction` datetime DEFAULT NULL,
  `niveau` float unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblproduction`
--

DROP TABLE IF EXISTS `tblproduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproduction` (
  `productId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(10) unsigned NOT NULL,
  `quantite` float unsigned DEFAULT NULL,
  `echeance` datetime DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`productId`),
  UNIQUE KEY `productId_UNIQUE` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

USE `bdd_industriel`;
DROP function IF EXISTS `sysEmbBackup`;

DELIMITER $$
USE `bdd_industriel`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `sysEmbBackup`(clientIdIn INT) RETURNS int(11)
BEGIN
	
	INSERT INTO tblProduction (clientId) VALUES (clientIdIn);
    RETURN (SELECT LAST_INSERT_ID() FROM tblProduction LIMIT 1);
END$$

DELIMITER ;

USE `bdd_industriel`;
DROP procedure IF EXISTS `production_detail`;

DELIMITER $$
USE `bdd_industriel`$$
CREATE PROCEDURE `production_detail` (clientIdIn INT)
BEGIN
	SELECT p.productId, nom, temperature, niveau, dateProduction
	FROM tblProduction p
	INNER JOIN (SELECT productId, temperature, niveau, dateProduction
			FROM tblDetail
            		ORDER BY dateProduction DESC LIMIT 9223372036854775807) d
	ON p.productId = d.productId
	WHERE clientId = clientIdIn
	GROUP BY productId;
END$$

DELIMITER ;

-- Dump completed on 2019-03-07 14:18:09
