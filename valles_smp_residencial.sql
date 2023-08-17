-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2023 at 08:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `valles_smp_residencial`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `user` varchar(100) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `user`, `password`) VALUES
(1, 'de.rivasherrera@gmail.com', '$2b$05$AVZ/FplLC.7KKtR.s9D52uDd.nDpjPpjTMuGmVhQQsHTiTU7ztnOK');

-- --------------------------------------------------------

--
-- Table structure for table `entrys_and_exits`
--

CREATE TABLE `entrys_and_exits` (
  `id` int(11) NOT NULL,
  `iduser` int(11) DEFAULT NULL,
  `dateandhourentry` varchar(50) DEFAULT NULL,
  `dateandhourexit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `route` varchar(500) NOT NULL,
  `idrol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `name`, `route`, `idrol`) VALUES
(1, 'Dashboard', '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>', 1),
(2, 'Mantenimiento Residentes', '<li><a href=\"residents\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-people-fill\"></i></span><span>Mantenimiento Residentes</span></a></li>', 1),
(3, 'Crear Visitantes', '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>', 1),
(4, 'Ingreso de Visitas', '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>', 1),
(5, 'Reportes', '<li><a href=\"reports\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-file-earmark-bar-graph-fill\"></i></span><span>Reportes</span></a></li>', 1),
(6, 'Dashboard', '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>', 2),
(7, 'Mantenimiento Residentes', '<li><a href=\"residents\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-people-fill\"></i></span><span>Mantenimiento Residentes</span></a></li>', 2),
(8, 'Crear Visitantes', '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>', 2),
(9, 'Ingreso de Visitas', '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>', 2),
(10, 'Reportes', '<li><a href=\"reports\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-file-earmark-bar-graph-fill\"></i></span><span>Reportes</span></a></li>', 2),
(11, 'Dashboard', '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>', 3),
(12, 'Crear Visitantes', '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>', 3),
(13, 'Dashboard', '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>', 4),
(14, 'Ingreso de Visitas', '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>', 4);

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id`, `name`) VALUES
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Residente'),
(4, 'Seguridad');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(250) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cui` varchar(50) DEFAULT NULL,
  `housenumber` varchar(50) DEFAULT NULL,
  `idrol` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `photo` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `address`, `phonenumber`, `email`, `cui`, `housenumber`, `idrol`, `status`, `gender`, `photo`) VALUES
(1, 'Daniel Rivas', 'Petapa', '45024363', 'de.rivasherrera@gmail.com', '3050000040117', '7 1-52', 1, 1, 1, 0x6e6f2068617920666f746f67726166c3ad61);

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `accesscode` varchar(50) DEFAULT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `addresstovisit` varchar(250) DEFAULT NULL,
  `cui` varchar(50) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `tipeofvisit` varchar(50) DEFAULT NULL,
  `housenumber` varchar(50) DEFAULT NULL,
  `personalidentificationphoto` text DEFAULT NULL,
  `visitorphoto` text DEFAULT NULL,
  `createddate` varchar(50) DEFAULT NULL,
  `expireddate` varchar(50) DEFAULT NULL,
  `usergeneratedinvitation` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `entrys_and_exits`
--
ALTER TABLE `entrys_and_exits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `iduser` (`iduser`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idrol` (`idrol`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idrol` (`idrol`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usergeneratedinvitation` (`usergeneratedinvitation`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `entrys_and_exits`
--
ALTER TABLE `entrys_and_exits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `entrys_and_exits`
--
ALTER TABLE `entrys_and_exits`
  ADD CONSTRAINT `entrys_and_exits_ibfk_1` FOREIGN KEY (`iduser`) REFERENCES `users` (`id`);

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `rol` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `rol` (`id`);

--
-- Constraints for table `visitors`
--
ALTER TABLE `visitors`
  ADD CONSTRAINT `visitors_ibfk_1` FOREIGN KEY (`usergeneratedinvitation`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
