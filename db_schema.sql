-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2026 at 01:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_login_history`
--

CREATE TABLE `admin_login_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email_attempted` varchar(190) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_status` enum('success','failed','blocked') NOT NULL,
  `failure_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_login_history`
--

INSERT INTO `admin_login_history` (`id`, `admin_user_id`, `email_attempted`, `ip_address`, `user_agent`, `login_status`, `failure_reason`, `created_at`) VALUES
(1, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-14 17:33:33'),
(2, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-14 17:35:04'),
(3, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-14 17:35:06'),
(4, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-14 17:35:50'),
(5, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'blocked', 'Too many failed login attempts', '2026-04-14 17:35:52'),
(6, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'blocked', 'Too many failed login attempts', '2026-04-14 17:36:24'),
(7, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-14 18:29:33'),
(8, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-14 18:32:12'),
(9, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-15 07:17:53'),
(10, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-16 08:57:38'),
(11, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-16 19:31:34'),
(12, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'blocked', 'Too many failed login attempts', '2026-04-16 19:31:39'),
(13, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'blocked', 'Too many failed login attempts', '2026-04-16 19:31:48'),
(14, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-17 08:22:02'),
(15, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-18 10:52:56'),
(16, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-04-18 11:12:14'),
(17, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-18 11:12:50'),
(18, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-04-19 07:13:10'),
(19, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'failed', 'Invalid credentials', '2026-05-07 10:42:15'),
(20, NULL, 'admin@example.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'blocked', 'Too many failed login attempts', '2026-05-07 10:42:26'),
(21, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-05-07 10:47:22'),
(22, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-05-08 10:11:02'),
(23, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'success', NULL, '2026-05-09 13:24:32'),
(24, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-11 13:30:13'),
(25, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-12 19:37:37'),
(26, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 'success', NULL, '2026-05-12 20:31:55'),
(27, NULL, 'homere.abayo@gmail.com', '::1', 'node', 'failed', 'Invalid credentials', '2026-05-12 20:37:53'),
(28, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 20:37:53'),
(29, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 20:38:12'),
(30, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 20:39:17'),
(31, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 20:55:39'),
(32, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 20:56:07'),
(33, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-12 21:04:52'),
(34, 1, 'homere.abayo@gmail.com', '::1', 'node', 'success', NULL, '2026-05-12 21:09:53'),
(35, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 'success', NULL, '2026-05-12 21:14:59'),
(36, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 'success', NULL, '2026-05-12 21:15:18'),
(37, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 'success', NULL, '2026-05-12 21:15:31'),
(38, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-14 08:05:08'),
(39, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.120.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'success', NULL, '2026-05-14 12:19:42'),
(40, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-14 12:53:59'),
(41, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-20 07:13:38'),
(42, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-20 07:32:45'),
(43, 1, 'homere.abayo@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'success', NULL, '2026-05-28 03:01:39');

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE `admin_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` datetime NOT NULL,
  `last_seen_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_sessions`
--

INSERT INTO `admin_sessions` (`id`, `admin_user_id`, `session_token`, `ip_address`, `user_agent`, `is_active`, `expires_at`, `last_seen_at`, `created_at`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzYxOTE1MzIsImV4cCI6MTc3NjIzNDczMn0.jzf9aITIKYgXFXSG6DQEHmXqtpFXhnzFeSyOyYFaJhw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-04-15 08:32:12', '2026-04-14 21:58:05', '2026-04-14 18:32:12'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzYyMzc0NzMsImV4cCI6MTc3NjI4MDY3M30.GlCdmoOZaJtMZXjfg464cHZajK_Qq7DnbIahXM2NMZM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-04-15 21:17:53', '2026-04-15 16:47:13', '2026-04-15 07:17:53'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzYzMjk4NTgsImV4cCI6MTc3NjM3MzA1OH0.NbD-VHw1034Aatqq27xJqD_kyNUcRr0sSE58h_JKncE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 0, '2026-04-16 22:57:38', '2026-04-16 21:31:23', '2026-04-16 08:57:38'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzY0MTQxMjEsImV4cCI6MTc3NjQ1NzMyMX0.dtNPKZQExosLhNrgdly1gf_m8fKQWxofpthsDR0tYVI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-04-17 22:22:02', '2026-04-17 22:06:07', '2026-04-17 08:22:02'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzY1MDk1NzYsImV4cCI6MTc3NjU1Mjc3Nn0.KriiEWOGCLki2MQUERrmsIDe4_bPtd5I-QDSS7MzaDU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 0, '2026-04-19 00:52:56', '2026-04-18 13:12:12', '2026-04-18 10:52:56'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzY1MTA3NzAsImV4cCI6MTc3NjU1Mzk3MH0.RmW9ZimOnxGo4dNNoU-eNtIK2cd1-nwd-p7uIg67I3E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-04-19 01:12:50', '2026-04-18 13:49:51', '2026-04-18 11:12:50'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzY1ODI3ODksImV4cCI6MTc3NjYyNTk4OX0.Nsxt9kouWSYulH-PFNZI5nB9dHWGeAdfZ3uT5VEZkeg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-04-19 21:13:09', '2026-04-19 21:00:49', '2026-04-19 07:13:09'),
(8, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzgxNTA4NDEsImV4cCI6MTc3ODE5NDA0MX0.gfD2gI462L_P_QJMHZJhWfXGmtaRhihMI8MYIh_pKFU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-05-08 00:47:21', '2026-05-07 14:12:05', '2026-05-07 10:47:21'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzgyMzUwNjIsImV4cCI6MTc3ODI3ODI2Mn0.MXuZycfn6vf__RO4L7Dc73vLNL6-ZKuAIcFHOeiIMLo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-05-09 00:11:02', '2026-05-08 17:53:29', '2026-05-08 10:11:02'),
(10, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzgzMzMwNzIsImV4cCI6MTc3ODM3NjI3Mn0.ogoYmTYR8JShc4DI3BSgapfC_oK5PIHZu_YwUKiju2o', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '2026-05-10 03:24:32', '2026-05-09 15:31:18', '2026-05-09 13:24:32'),
(11, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg1MDYyMTMsImV4cCI6MTc3ODU0OTQxM30.Ou21BgIj93oVDf2of0hVtfrLah_3VricaB4h6amak-I', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-12 03:30:13', '2026-05-11 21:57:55', '2026-05-11 13:30:13'),
(12, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTQ2NTcsImV4cCI6MTc3ODY1Nzg1N30.dux-HGpuHHjh9FBwJ0X0y11quITcHeNx_bOiQvFhHLE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-13 09:37:37', '2026-05-12 22:44:25', '2026-05-12 19:37:37'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTc5MTIsImV4cCI6MTc3ODY2MTExMn0.In9CpI4-hCg5_PQg_aP7vm0V_DnPsH22aQGhA6VGv_U', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 1, '2026-05-13 10:31:54', '2026-05-12 22:31:54', '2026-05-12 20:31:54'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTgyNzMsImV4cCI6MTc3ODY2MTQ3M30.LKAg9ituz955-cFF2ylDkgPjgH_tBNPVw5JyoWZTBOE', '::1', 'node', 1, '2026-05-13 10:37:53', '2026-05-12 22:37:53', '2026-05-12 20:37:53'),
(16, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTgyOTIsImV4cCI6MTc3ODY2MTQ5Mn0.gGEK0WjAMFUZnzwSIv7dxTSqUwRU7FHfmNuEilrZsLc', '::1', 'node', 1, '2026-05-13 10:38:12', '2026-05-12 22:38:13', '2026-05-12 20:38:12'),
(18, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTgzNTcsImV4cCI6MTc3ODY2MTU1N30.XK7FMtWkTNFs2_lLYFITlOpRnQvrVHOMPu0jSBBKJlk', '::1', 'node', 1, '2026-05-13 10:39:17', '2026-05-12 22:39:17', '2026-05-12 20:39:17'),
(19, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTkzMzgsImV4cCI6MTc3ODY2MjUzOH0.MRvpp0scdFQVreRi5zemNZUAoRhglWovbNzO-aUj2TA', '::1', 'node', 1, '2026-05-13 10:55:38', '2026-05-12 22:55:39', '2026-05-12 20:55:38'),
(21, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTkzNjcsImV4cCI6MTc3ODY2MjU2N30.jab0a9Y4hmzd2Xrby3YWz0yZcCRoZdsIYxSPNb7ww4k', '::1', 'node', 1, '2026-05-13 10:56:07', '2026-05-12 22:56:07', '2026-05-12 20:56:07'),
(22, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MTk4OTIsImV4cCI6MTc3ODY2MzA5Mn0.nDXqr_WjGYOWJA6bpWfRHNyy180WZuDcBpLB7POaQ7g', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-13 11:04:52', '2026-05-13 01:01:55', '2026-05-12 21:04:52'),
(23, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MjAxOTIsImV4cCI6MTc3ODY2MzM5Mn0.SZcpuaajzY2zqGn0-pjxJuig5kgtTydOjmJ0GRI3g-U', '::1', 'node', 1, '2026-05-13 11:09:52', '2026-05-12 23:09:53', '2026-05-12 21:09:52'),
(25, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MjA0OTksImV4cCI6MTc3ODY2MzY5OX0.Q4n-_RRF9f8kfpHEapGavlHqWjgjTR0iuDkx3yMRFDY', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 1, '2026-05-13 11:14:59', '2026-05-12 23:14:59', '2026-05-12 21:14:59'),
(26, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MjA1MTgsImV4cCI6MTc3ODY2MzcxOH0.n_28UGdXH3du_BHWFETQYpv_IQUXWQK9C5vyVBAgR7U', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 1, '2026-05-13 11:15:18', '2026-05-12 23:15:18', '2026-05-12 21:15:18'),
(27, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg2MjA1MzEsImV4cCI6MTc3ODY2MzczMX0.0lEC75xfBqDBF4mQrAfhElsN-sJa5vXDCQtj7KqipPA', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7920', 1, '2026-05-13 11:15:31', '2026-05-12 23:15:31', '2026-05-12 21:15:31'),
(28, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg3NDU5MDgsImV4cCI6MTc3ODc4OTEwOH0.jzq-PcX0N-kOuuDWLJthfdv80CbahTP2R8UG18wT868', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-14 22:05:08', '2026-05-14 13:47:37', '2026-05-14 08:05:08'),
(29, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg3NjExODIsImV4cCI6MTc3ODgwNDM4Mn0.aKlCT5eF58q-kAU0y3NYs88zLRkc1389Ggi_WDhO3Pk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.120.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 1, '2026-05-15 02:19:42', '2026-05-14 14:22:54', '2026-05-14 12:19:42'),
(30, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzg3NjMyMzksImV4cCI6MTc3ODgwNjQzOX0.GSipVz-JUFqJVw3MuHTRj6lqIO_w8q4wVvOIWBi7L-U', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-15 02:53:59', '2026-05-14 19:34:51', '2026-05-14 12:53:59'),
(31, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzkyNjEyMTgsImV4cCI6MTc3OTMwNDQxOH0.qSo-Bp6OnGD81p45uoBznb_zPT7u6KvFeX2tux_ALsQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 0, '2026-05-20 21:13:38', '2026-05-20 09:32:42', '2026-05-20 07:13:38'),
(32, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3NzkyNjIzNjQsImV4cCI6MTc3OTMwNTU2NH0.ewVYzZicdUxGn86tidfWC1XmIfwHdiJE-0zUW4bKi30', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-20 21:32:44', '2026-05-20 09:33:44', '2026-05-20 07:32:44'),
(33, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJpYXQiOjE3Nzk5MzcyOTgsImV4cCI6MTc3OTk4MDQ5OH0.TX7GiVYMeH_hIPfrV7TK3FRAkp-BJqOX6FHQe_qd16w', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 1, '2026-05-28 17:01:38', '2026-05-28 10:03:26', '2026-05-28 03:01:38');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `must_change_password` tinyint(1) NOT NULL DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `avatar_url`, `status`, `must_change_password`, `last_login_at`, `last_login_ip`, `email_verified_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '$2a$10$ZZdgzq4kbx12LYQPIV/92O7DzBweqzuy0rlyKsfIISfDhdwKqDISW', NULL, 'active', 0, '2026-05-28 05:01:38', '::1', '2026-04-14 20:30:46', NULL, '2026-04-14 16:46:39', '2026-05-28 03:01:38');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `background_color` varchar(20) DEFAULT NULL,
  `text_color` varchar(20) DEFAULT NULL,
  `cta_text` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action_type` varchar(100) NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `target_type` varchar(100) DEFAULT NULL,
  `target_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `admin_user_id`, `action_type`, `module_name`, `target_type`, `target_id`, `description`, `old_values`, `new_values`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, NULL, 'setup_account_created', 'auth', 'admin_user', 1, 'Initial admin account created for homere.abayo@gmail.com', NULL, '{\"email\":\"homere.abayo@gmail.com\",\"roleCode\":\"super_admin\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-14 18:30:46'),
(2, 1, 'create', 'products', 'product', 1, 'Created product Pizza', NULL, '{\"name\":\"Pizza\",\"sku\":\"23\",\"shortDescription\":\"test for piza\",\"description\":\"pizzzzzzzzzzzzzzzzaaaaaaaaaaaaazaaaa\",\"price\":8000,\"discountPrice\":null,\"stockQuantity\":79,\"lowStockThreshold\":5,\"weightUnit\":\"kg\",\"brand\":\"us\",\"status\":\"active\",\"productCondition\":\"new\",\"featuredProduct\":false,\"bestSeller\":true,\"newArrival\":false,\"isSearchable\":true,\"autoHideWhenOutOfStock\":false,\"visibility\":\"public\",\"ogImageUrl\":\"/uploads/Products/1776348699286-easy_pizza_recipe_800x800.webp\",\"categoryAssignments\":[{\"categoryId\":2,\"subcategoryId\":1,\"isPrimary\":true}],\"tagIds\":[2],\"filterOptionIds\":[],\"images\":[{\"imageUrl\":\"/uploads/Products/1776348699286-easy_pizza_recipe_800x800.webp\",\"altText\":null,\"sortOrder\":0,\"isPrimary\":true},{\"imageUrl\":\"/uploads/Products/1776348699243-images-(1).jfif\",\"altText\":null,\"sortOrder\":1,\"isPrimary\":false}]}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-16 14:11:40'),
(3, 1, 'create', 'products', 'product', 1, 'Created product UI Validation Placeholder', NULL, '{\"name\":\"UI Validation Placeholder\",\"sku\":\"UI-VALIDATION-PLACEHOLDER\",\"shortDescription\":\"Validation only\",\"description\":\"Validation only\",\"price\":1000,\"discountPrice\":null,\"costPrice\":null,\"stockQuantity\":1,\"lowStockThreshold\":1,\"weight\":null,\"weightUnit\":\"kg\",\"brand\":\"Validation\",\"status\":\"active\",\"productCondition\":\"new\",\"featuredProduct\":false,\"bestSeller\":false,\"newArrival\":false,\"isSearchable\":true,\"autoHideWhenOutOfStock\":false,\"visibility\":\"public\",\"metaTitle\":null,\"metaDescription\":null,\"ogImageUrl\":null,\"publishedAt\":null,\"categoryAssignments\":[],\"tagIds\":[],\"filterOptionIds\":[],\"images\":[]}', '::1', 'node', '2026-05-12 20:38:14'),
(4, 1, 'create', 'products', 'product', 999999, 'Created product test', NULL, '{\"sku\":\"SKU-1\"}', '::1', 'node', '2026-05-12 21:10:20');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `cta_text` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `position_code` varchar(100) NOT NULL DEFAULT 'homepage_hero',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_url`, `cta_text`, `cta_link`, `position_code`, `sort_order`, `is_active`, `starts_at`, `ends_at`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '', '', '/uploads/Hero/1776583321791-tomato.webp', '', '', '', 0, 1, NULL, NULL, 1, 1, '2026-04-19 07:22:05', '2026-04-19 07:22:16');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `customer_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(7, 2, 280, 4, '2026-05-14 14:29:07', '2026-05-14 16:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `show_on_homepage` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image_url`, `icon`, `description`, `status`, `sort_order`, `show_on_homepage`, `is_featured`, `seo_title`, `seo_description`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(101, NULL, 'Vegetables', 'vegetables', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80', 'Leaf', 'Discover our wide selection of fresh, organic vegetables sourced directly from local farms. Perfect for healthy, nutritious meals.', 'active', 1, 1, 1, NULL, NULL, 1, 1, '2026-05-07 14:33:12', '2026-05-08 00:50:24'),
(102, NULL, 'Fruits', 'fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80', 'Apple', 'Enjoy the sweetest, juiciest seasonal fruits hand-picked at peak ripeness. Packed with essential vitamins and natural energy.', 'active', 2, 1, 1, NULL, NULL, 1, 1, '2026-05-07 14:33:12', '2026-05-08 00:50:24'),
(108, NULL, 'Beans & Legumes', 'beans-legumes', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80', 'Bean', 'Hearty and nutritious beans and legumes. A fantastic source of plant-based protein, fiber, and complex carbohydrates.', 'active', 8, 1, 0, NULL, NULL, 1, 1, '2026-05-07 14:33:12', '2026-05-08 00:50:25'),
(109, NULL, 'Herbs & Spices', 'herbs-spices', 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80', 'Leaf', 'Elevate your cooking with our fresh herbs and aromatic spices. Carefully sourced to bring authentic flavors to your kitchen.', 'active', 9, 1, 0, NULL, NULL, 1, 1, '2026-05-07 14:33:12', '2026-05-08 00:50:25'),
(110, NULL, 'Nuts & Seeds', 'nuts-seeds', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80', 'Nut', 'Healthy, crunchy nuts and seeds. Excellent for snacking, baking, or adding a nutritious boost to your salads and bowls.', 'active', 10, 1, 0, NULL, NULL, 1, 1, '2026-05-07 14:33:12', '2026-05-08 00:50:25'),
(111, NULL, 'Others', 'others', '/uploads/Categories/1778747240429-composition-fresh-vegetables-blurred-vegetable-garden-background_169016-40138.avif', 'Milk', 'Discover the versatile ingredients that form the foundation of healthy home cooking. Whether it’s nutrient-rich eggs or heart-healthy oils, we’ve gathered the freshest and most reliable products.', 'active', 11, 1, 0, NULL, NULL, 1, 1, '2026-05-11 15:12:42', '2026-05-14 12:55:19'),
(9991, NULL, 'Roots & Staples', 'roots-staples', '/uploads/Categories/1778747312765-Root-crops-e1736695271825.jpg', 'Carrot', 'Fresh root crops and staple items prepared for everyday kitchen use.', 'active', 12, 1, 0, NULL, NULL, 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:28:37');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(80) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed','free_delivery') NOT NULL,
  `discount_value` decimal(14,2) NOT NULL DEFAULT 0.00,
  `minimum_order_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_limit_per_user` int(11) DEFAULT NULL,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `applies_to` enum('all','categories','products') NOT NULL DEFAULT 'all',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_categories`
--

CREATE TABLE `coupon_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `coupon_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_products`
--

CREATE TABLE `coupon_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `coupon_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_usage`
--

CREATE TABLE `coupon_usage` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `coupon_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `used_at` datetime NOT NULL,
  `discount_amount` decimal(14,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `account_status` enum('active','blocked','inactive') NOT NULL DEFAULT 'active',
  `email_verified_at` datetime DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `total_spent` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `avatar_url`, `gender`, `date_of_birth`, `account_status`, `email_verified_at`, `phone_verified_at`, `last_login_at`, `total_spent`, `total_orders`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'gmail', 'test', 'test@gmail.com', '0781233246', '$2a$10$Sgs5N9Je6QQrQLjsy74boedzHA4dAnSOag2rO2bFX8.anyYIR6tim', NULL, NULL, NULL, 'active', '2026-04-17 10:26:47', NULL, '2026-06-10 17:45:34', 51185.00, 7, NULL, '2026-04-17 08:26:47', '2026-06-10 15:46:03', NULL),
(2, 'homere', 'abayo', 'homeredot@gmail.com', '0781322698', '$2a$10$43wwFKq9vjzgQGsVfs21z.Ae93XhxT7XWPA/R8EuPFdORo6zcJhmK', NULL, NULL, NULL, 'active', '2026-05-14 16:28:20', NULL, '2026-05-14 16:29:06', 0.00, 0, NULL, '2026-05-14 14:28:20', '2026-05-14 14:29:06', NULL),
(4, 'Test', 'User', 'test@eliteagrisolution.com', '0780000000', NULL, NULL, NULL, NULL, 'active', NULL, NULL, NULL, 3500.00, 1, NULL, '2026-06-08 02:09:28', '2026-06-08 02:09:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_addresses`
--

CREATE TABLE `customer_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(120) NOT NULL,
  `recipient_name` varchar(190) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `region` varchar(120) DEFAULT NULL,
  `country` varchar(120) DEFAULT NULL,
  `address_type` enum('shipping','billing','both') NOT NULL DEFAULT 'shipping',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_addresses`
--

INSERT INTO `customer_addresses` (`id`, `customer_id`, `label`, `recipient_name`, `phone`, `address_line1`, `address_line2`, `city`, `region`, `country`, `address_type`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 2, 'school', 'Abayo Homere', '+250781322698', 'Ruhengeri, Musanze', NULL, 'Ruhengeri', 'eastren provence', 'Rwanda', 'billing', 1, '2026-05-14 14:52:51', '2026-05-14 14:52:51');

-- --------------------------------------------------------

--
-- Table structure for table `customer_notes`
--

CREATE TABLE `customer_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_zones`
--

CREATE TABLE `delivery_zones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(80) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `base_fee` decimal(14,2) NOT NULL DEFAULT 0.00,
  `estimated_delivery_hours` int(11) DEFAULT NULL,
  `free_delivery_threshold` decimal(14,2) DEFAULT NULL,
  `delivery_partner_name` varchar(150) DEFAULT NULL,
  `delivery_partner_phone` varchar(30) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_zones`
--

INSERT INTO `delivery_zones` (`id`, `name`, `code`, `country`, `city`, `district`, `sector`, `base_fee`, `estimated_delivery_hours`, `free_delivery_threshold`, `delivery_partner_name`, `delivery_partner_phone`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'kalisimbi', '01', 'Rwanda', 'Ruhengeri', 'Musanze', 'Ruhengeri', 1997.00, 1, 0.00, 'kamanzi store', '078111111', 1, '2026-05-14 15:06:20', '2026-05-14 15:06:20');

-- --------------------------------------------------------

--
-- Table structure for table `failed_login_attempts`
--

CREATE TABLE `failed_login_attempts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(190) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 1,
  `last_attempt_at` datetime NOT NULL,
  `blocked_until` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `failed_login_attempts`
--

INSERT INTO `failed_login_attempts` (`id`, `email`, `ip_address`, `attempts`, `last_attempt_at`, `blocked_until`, `created_at`, `updated_at`) VALUES
(1, 'admin@example.com', '::1', 8, '2026-05-07 12:42:15', '2026-05-07 12:57:15', '2026-04-14 17:33:33', '2026-05-07 10:42:15');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` longtext NOT NULL,
  `category` varchar(120) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `filter_groups`
--

CREATE TABLE `filter_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(120) NOT NULL,
  `display_on_frontend` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `filter_options`
--

CREATE TABLE `filter_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `filter_group_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(120) NOT NULL,
  `value` varchar(120) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_name` varchar(100) NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `homepage_sections`
--

CREATE TABLE `homepage_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_key` varchar(120) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `content_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `show_on_homepage` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `homepage_sections`
--

INSERT INTO `homepage_sections` (`id`, `section_key`, `title`, `subtitle`, `content`, `content_json`, `sort_order`, `is_active`, `show_on_homepage`, `created_at`, `updated_at`) VALUES
(1, 'hero', 'Welcome to our store', 'Offers a 50% discount on your first order', 'Hero content block', '{}', 1, 1, 1, '2026-04-14 16:46:39', '2026-05-08 14:58:06'),
(2, 'featured_categories', 'Featured Categories', 'Top picks', NULL, NULL, 2, 1, 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(3, 'featured_products', 'Featured Products', 'Best sellers and new arrivals', NULL, NULL, 3, 1, 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(4, 'promo_strip', 'Special Offers S', 'Configure promotions from admin', NULL, NULL, 4, 1, 1, '2026-04-14 16:46:39', '2026-04-16 15:53:09');

-- --------------------------------------------------------

--
-- Table structure for table `legal_pages`
--

CREATE TABLE `legal_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_key` enum('about','terms','privacy') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `legal_pages`
--

INSERT INTO `legal_pages` (`id`, `page_key`, `title`, `content`, `meta_title`, `meta_description`, `updated_by`, `updated_at`) VALUES
(1, 'about', 'hello', 'hello', NULL, NULL, 1, '2026-05-20 07:33:25'),
(2, 'terms', 'Terms & Conditions', '<h2>1. Introduction</h2>\n<p>Welcome to <strong>Elite Agri-Solution</strong>. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. Please read them carefully before placing any order.</p>\n\n<h2>2. Eligibility</h2>\n<p>You must be at least 18 years old to use our services. By using this site you warrant that you meet this age requirement and that the information you provide is accurate and complete.</p>\n\n<h2>3. Products &amp; Pricing</h2>\n<p>All product descriptions, images, and prices are provided in good faith and are subject to change without notice. We reserve the right to correct any errors or inaccuracies at any time, even after you have submitted an order.</p>\n<p>Prices are displayed in Rwandan Francs (RWF) and include any applicable taxes unless stated otherwise.</p>\n\n<h2>4. Orders &amp; Payment</h2>\n<p>Placing an order constitutes an offer to purchase. An order is only confirmed once you receive a confirmation notification from us. We reserve the right to refuse or cancel any order at our discretion, including but not limited to cases of suspected fraud, pricing errors, or stock unavailability.</p>\n<p>Payment must be completed at checkout via one of our supported payment methods. All transactions are encrypted and processed securely.</p>\n\n<h2>5. Delivery</h2>\n<p>Delivery times are estimates and may vary due to factors outside our control. Elite Agri-Solution is not liable for delays caused by third-party couriers, customs, weather, or other unforeseen circumstances. Risk of loss passes to you upon delivery.</p>\n\n<h2>6. Returns &amp; Refunds</h2>\n<p>Fresh and perishable items may not be returned unless they are demonstrably defective or incorrectly supplied. For non-perishable goods, you may request a return within 7 days of delivery, provided the product is unused and in its original packaging. Refunds are processed within 5???10 business days after we receive and inspect the returned item.</p>\n\n<h2>7. Intellectual Property</h2>\n<p>All content on this website ??? including text, graphics, logos, and images ??? is the property of Elite Agri-Solution or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or exploit any content without our express written permission.</p>\n\n<h2>8. Limitation of Liability</h2>\n<p>To the fullest extent permitted by law, Elite Agri-Solution shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or products.</p>\n\n<h2>9. Governing Law</h2>\n<p>These Terms are governed by and construed in accordance with the laws of the Republic of Rwanda. Any disputes shall be subject to the exclusive jurisdiction of the courts of Rwanda.</p>\n\n<h2>10. Changes to These Terms</h2>\n<p>We reserve the right to update these Terms at any time. Changes will be posted on this page with a revised date. Continued use of our services after any changes constitutes your acceptance of the new Terms.</p>\n\n<h2>11. Contact</h2>\n<p>If you have any questions about these Terms, please contact us at <a href=\"/contact\">our contact page</a> or by email at the address listed in the site settings.</p>', 'Terms & Conditions ??? Elite Agri-Solution', 'Read the Terms & Conditions that govern your use of the Elite Agri-Solution website and services, including ordering, payment, delivery, and returns policies.', NULL, '2026-05-28 08:48:45'),
(3, 'privacy', 'Privacy Policy', '<h2>1. Introduction</h2>\n<p><strong>Elite Agri-Solution</strong> is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices available to you.</p>\n\n<h2>2. Information We Collect</h2>\n<p>We may collect the following categories of personal information when you use our website:</p>\n<ul>\n  <li><strong>Identity &amp; Contact Data:</strong> your name, email address, phone number, and delivery address.</li>\n  <li><strong>Transaction Data:</strong> details of products you purchase and payment references.</li>\n  <li><strong>Technical Data:</strong> your IP address, browser type, and pages visited (collected automatically via cookies and server logs).</li>\n  <li><strong>Communications Data:</strong> messages you send us via our contact form or customer support channels.</li>\n</ul>\n\n<h2>3. How We Use Your Information</h2>\n<p>We use your personal data to:</p>\n<ul>\n  <li>Process and fulfil your orders and deliver products to you.</li>\n  <li>Manage your account and authenticate your identity.</li>\n  <li>Send you order confirmations, delivery updates, and customer service communications.</li>\n  <li>Improve our website, products, and services based on usage analytics.</li>\n  <li>Comply with legal obligations and prevent fraud.</li>\n</ul>\n<p>We will only contact you for marketing purposes if you have opted in, and you may withdraw your consent at any time.</p>\n\n<h2>4. Legal Basis for Processing</h2>\n<p>We process your data on the following legal grounds:</p>\n<ul>\n  <li><strong>Contract:</strong> Processing is necessary to fulfil orders you place with us.</li>\n  <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure website security.</li>\n  <li><strong>Consent:</strong> For any optional marketing communications.</li>\n  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations.</li>\n</ul>\n\n<h2>5. Data Sharing</h2>\n<p>We do not sell your personal information. We may share your data with trusted third parties only where necessary:</p>\n<ul>\n  <li>Delivery partners to fulfil your orders.</li>\n  <li>Payment processors to complete secure transactions.</li>\n  <li>IT service providers who support our website infrastructure.</li>\n</ul>\n<p>All third parties are required to handle your data securely and in accordance with applicable law.</p>\n\n<h2>6. Data Retention</h2>\n<p>We retain your personal data only as long as necessary to fulfil the purposes described in this policy, or as required by law. Account information is retained for as long as your account remains active. Order records are retained for up to 7 years for accounting and legal compliance purposes.</p>\n\n<h2>7. Your Rights</h2>\n<p>You have the right to:</p>\n<ul>\n  <li>Access the personal data we hold about you.</li>\n  <li>Request correction of inaccurate data.</li>\n  <li>Request deletion of your data (subject to legal obligations).</li>\n  <li>Object to or restrict certain processing activities.</li>\n  <li>Withdraw consent for marketing communications at any time.</li>\n</ul>\n<p>To exercise any of these rights, please contact us at the address listed in our site settings.</p>\n\n<h2>8. Cookies</h2>\n<p>Our website uses cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can control cookie settings through your browser. Disabling cookies may affect the functionality of some parts of the website.</p>\n\n<h2>9. Security</h2>\n<p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or disclosure. All payment transactions are encrypted using industry-standard SSL technology.</p>\n\n<h2>10. Changes to This Policy</h2>\n<p>We may update this Privacy Policy periodically. Changes will be posted on this page with a revised date. We encourage you to review this page regularly to stay informed about how we protect your data.</p>\n\n<h2>11. Contact Us</h2>\n<p>If you have any questions or concerns about this Privacy Policy, please <a href=\"/contact\">contact us</a> or write to us at the address provided in our site settings.</p>', 'Privacy Policy ??? Elite Agri-Solution', 'Learn how Elite Agri-Solution collects, uses, and protects your personal information when you use our website and services.', NULL, '2026-05-28 08:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `media_files`
--

CREATE TABLE `media_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `extension` varchar(20) DEFAULT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_files`
--

INSERT INTO `media_files` (`id`, `file_name`, `file_path`, `file_url`, `mime_type`, `extension`, `file_size`, `width`, `height`, `alt_text`, `uploaded_by`, `is_used`, `created_at`, `updated_at`) VALUES
(1, 'images (1).jfif', 'uploads/Categories/1776341997734-images-(1).jfif', '/uploads/Categories/1776341997734-images-(1).jfif', 'image/jpeg', 'jfif', 14167, NULL, NULL, NULL, 1, 1, '2026-04-16 12:19:57', '2026-04-16 12:19:57'),
(2, 'easy_pizza_recipe_800x800.webp', 'uploads/Categories/1776343603899-easy_pizza_recipe_800x800.webp', '/uploads/Categories/1776343603899-easy_pizza_recipe_800x800.webp', 'image/webp', 'webp', 237392, NULL, NULL, NULL, 1, 1, '2026-04-16 12:46:43', '2026-04-16 12:46:43'),
(3, 'easy_pizza_recipe_800x800.webp', 'uploads/Categories/1776344056256-easy_pizza_recipe_800x800.webp', '/uploads/Categories/1776344056256-easy_pizza_recipe_800x800.webp', 'image/webp', 'webp', 237392, NULL, NULL, NULL, 1, 1, '2026-04-16 12:54:16', '2026-04-16 12:54:16'),
(4, 'image.png', 'uploads/Categories/1776345179420-image.png', '/uploads/Categories/1776345179420-image.png', 'image/png', 'png', 4092740, NULL, NULL, NULL, 1, 1, '2026-04-16 13:12:59', '2026-04-16 13:12:59'),
(5, 'images (1).jfif', 'uploads/Products/1776348699243-images-(1).jfif', '/uploads/Products/1776348699243-images-(1).jfif', 'image/jpeg', 'jfif', 14167, NULL, NULL, NULL, 1, 1, '2026-04-16 14:11:39', '2026-04-16 14:11:39'),
(6, 'easy_pizza_recipe_800x800.webp', 'uploads/Products/1776348699286-easy_pizza_recipe_800x800.webp', '/uploads/Products/1776348699286-easy_pizza_recipe_800x800.webp', 'image/webp', 'webp', 237392, NULL, NULL, NULL, 1, 1, '2026-04-16 14:11:39', '2026-04-16 14:11:39'),
(7, 'meat.jpg', 'uploads/Categories/1776455483898-meat.jpg', '/uploads/Categories/1776455483898-meat.jpg', 'image/jpeg', 'jpg', 55741, NULL, NULL, NULL, 1, 1, '2026-04-17 19:51:24', '2026-04-17 19:51:24'),
(8, 'easy_pizza_recipe_800x800.webp', 'uploads/Homepage/1776455738138-easy_pizza_recipe_800x800.webp', '/uploads/Homepage/1776455738138-easy_pizza_recipe_800x800.webp', 'image/webp', 'webp', 237392, NULL, NULL, NULL, 1, 1, '2026-04-17 19:55:38', '2026-04-17 19:55:38'),
(9, 'tomato.webp', 'uploads/Hero/1776583321791-tomato.webp', '/uploads/Hero/1776583321791-tomato.webp', 'image/webp', 'webp', 16424, NULL, NULL, NULL, 1, 1, '2026-04-19 07:22:02', '2026-04-19 07:22:02'),
(10, 'salmon-fish-raw-whole-ice-1296x728-header-1296x728.avif', 'uploads/Categories/1778153348784-salmon-fish-raw-whole-ice-1296x728-header-1296x728.avif', '/uploads/Categories/1778153348784-salmon-fish-raw-whole-ice-1296x728-header-1296x728.avif', 'image/avif', 'avif', 179318, NULL, NULL, NULL, 1, 1, '2026-05-07 11:29:15', '2026-05-07 11:29:15'),
(11, 'Green-banana-kg-murukali-com-6092_467x700.webp', 'uploads/Categories/1778154587577-Green-banana-kg-murukali-com-6092_467x700.webp', '/uploads/Categories/1778154587577-Green-banana-kg-murukali-com-6092_467x700.webp', 'image/webp', 'webp', 11344, NULL, NULL, NULL, 1, 1, '2026-05-07 11:49:48', '2026-05-07 11:49:48'),
(12, 'images (2).jfif', 'uploads/Categories/1778252771323-images-(2).jfif', '/uploads/Categories/1778252771323-images-(2).jfif', 'image/jpeg', 'jfif', 7676, NULL, NULL, NULL, 1, 1, '2026-05-08 15:06:14', '2026-05-08 15:06:14'),
(13, 'ChatGPT Image May 11, 2026, 04_55_38 PM.png', 'uploads/Products/1778512127718-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', '/uploads/Products/1778512127718-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', 'image/png', 'png', 1297728, NULL, NULL, NULL, 1, 1, '2026-05-11 15:08:48', '2026-05-11 15:08:48'),
(14, 'ChatGPT Image May 11, 2026, 04_55_38 PM.png', 'uploads/Products/1778512127337-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', '/uploads/Products/1778512127337-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', 'image/png', 'png', 1297728, NULL, NULL, NULL, 1, 1, '2026-05-11 15:08:48', '2026-05-11 15:08:48'),
(15, 'ChatGPT Image May 11, 2026, 04_55_38 PM.png', 'uploads/Products/1778512890773-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', '/uploads/Products/1778512890773-ChatGPT-Image-May-11,-2026,-04_55_38-PM.png', 'image/png', 'png', 1297728, NULL, NULL, NULL, 1, 1, '2026-05-11 15:21:30', '2026-05-11 15:21:30'),
(16, 'shutterstock_750895588.jpg', 'uploads/Categories/1778746971361-shutterstock_750895588.jpg', '/uploads/Categories/1778746971361-shutterstock_750895588.jpg', 'image/jpeg', 'jpg', 127304, NULL, NULL, NULL, 1, 1, '2026-05-14 08:22:51', '2026-05-14 08:22:51'),
(17, 'composition-fresh-vegetables-blurred-vegetable-garden-background_169016-40138.avif', 'uploads/Categories/1778747240429-composition-fresh-vegetables-blurred-vegetable-garden-background_169016-40138.avif', '/uploads/Categories/1778747240429-composition-fresh-vegetables-blurred-vegetable-garden-background_169016-40138.avif', 'image/avif', 'avif', 69969, NULL, NULL, NULL, 1, 1, '2026-05-14 08:27:20', '2026-05-14 08:27:20'),
(18, 'Root-crops-e1736695271825.jpg', 'uploads/Categories/1778747312765-Root-crops-e1736695271825.jpg', '/uploads/Categories/1778747312765-Root-crops-e1736695271825.jpg', 'image/jpeg', 'jpg', 72324, NULL, NULL, NULL, 1, 1, '2026-05-14 08:28:32', '2026-05-14 08:28:32');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `recipient_type` enum('admin','customer') NOT NULL DEFAULT 'admin',
  `recipient_admin_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `recipient_customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notification_type` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `channel` enum('in_app','email','sms','push') NOT NULL DEFAULT 'in_app',
  `status` enum('pending','sent','read','failed') NOT NULL DEFAULT 'pending',
  `related_type` varchar(100) DEFAULT NULL,
  `related_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED DEFAULT NULL,
  `coupon_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded','partially_refunded') NOT NULL DEFAULT 'pending',
  `delivery_status` enum('pending','assigned','in_transit','delivered','failed','returned') NOT NULL DEFAULT 'pending',
  `currency_code` varchar(10) NOT NULL DEFAULT 'RWF',
  `subtotal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `refund_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `customer_notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `billing_first_name` varchar(100) NOT NULL,
  `billing_last_name` varchar(100) DEFAULT NULL,
  `billing_email` varchar(190) NOT NULL,
  `billing_phone` varchar(30) DEFAULT NULL,
  `billing_address_line1` varchar(255) DEFAULT NULL,
  `billing_address_line2` varchar(255) DEFAULT NULL,
  `billing_city` varchar(100) DEFAULT NULL,
  `billing_region` varchar(100) DEFAULT NULL,
  `billing_country` varchar(100) DEFAULT NULL,
  `shipping_first_name` varchar(100) NOT NULL,
  `shipping_last_name` varchar(100) DEFAULT NULL,
  `shipping_phone` varchar(30) DEFAULT NULL,
  `shipping_address_line1` varchar(255) DEFAULT NULL,
  `shipping_address_line2` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_region` varchar(100) DEFAULT NULL,
  `shipping_country` varchar(100) DEFAULT NULL,
  `placed_at` datetime NOT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `delivery_zone_id`, `coupon_id`, `order_status`, `payment_status`, `delivery_status`, `currency_code`, `subtotal`, `discount_amount`, `shipping_amount`, `tax_amount`, `total_amount`, `refund_amount`, `customer_notes`, `admin_notes`, `billing_first_name`, `billing_last_name`, `billing_email`, `billing_phone`, `billing_address_line1`, `billing_address_line2`, `billing_city`, `billing_region`, `billing_country`, `shipping_first_name`, `shipping_last_name`, `shipping_phone`, `shipping_address_line1`, `shipping_address_line2`, `shipping_city`, `shipping_region`, `shipping_country`, `placed_at`, `confirmed_at`, `shipped_at`, `delivered_at`, `cancelled_at`, `created_at`, `updated_at`) VALUES
(3, 'ORD-20260607-C6TOBE', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 1200.00, 0.00, 1997.00, 0.00, 3197.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-07 19:18:08', NULL, NULL, NULL, NULL, '2026-06-07 17:18:08', '2026-06-07 17:18:08'),
(4, 'ORD-20260607-Z6QXZ9', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 1200.00, 0.00, 1997.00, 0.00, 3197.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-07 20:55:07', NULL, NULL, NULL, NULL, '2026-06-07 18:55:07', '2026-06-07 18:55:07'),
(6, 'ORD-20260608-OZOJG0', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 18800.00, 0.00, 1997.00, 0.00, 20797.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-08 04:02:36', NULL, NULL, NULL, NULL, '2026-06-08 02:02:36', '2026-06-08 02:02:36'),
(7, 'ORD-20260608-LC2916', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 18800.00, 0.00, 1997.00, 0.00, 20797.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-08 04:02:42', NULL, NULL, NULL, NULL, '2026-06-08 02:02:42', '2026-06-08 02:02:42'),
(8, 'ORD-20260608-163FKG', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 18800.00, 0.00, 1997.00, 0.00, 20797.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-08 04:02:43', NULL, NULL, NULL, NULL, '2026-06-08 02:02:43', '2026-06-08 02:02:43'),
(9, 'ORD-20260608-755N88', 4, NULL, NULL, 'pending', 'pending', 'pending', 'RWF', 3500.00, 0.00, 0.00, 0.00, 3500.00, 0.00, NULL, NULL, 'Test', 'User', 'test@eliteagrisolution.com', '0780000000', 'Kigali', NULL, 'Kigali', NULL, 'Rwanda', 'Test', 'User', '0780000000', 'Kigali', NULL, 'Kigali', NULL, 'Rwanda', '2026-06-08 04:09:28', NULL, NULL, NULL, NULL, '2026-06-08 02:09:28', '2026-06-08 02:09:28'),
(10, 'ORD-20260608-XZTIUN', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 1500.00, 0.00, 1997.00, 0.00, 3497.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', NULL, 'Kigali City', NULL, 'Rwanda', '2026-06-08 04:17:37', NULL, NULL, NULL, NULL, '2026-06-08 02:17:37', '2026-06-08 02:17:37'),
(11, 'ORD-20260610-ZKIKJY', 1, 2, NULL, 'pending', 'pending', 'pending', 'RWF', 2500.00, 0.00, 1997.00, 0.00, 4497.00, 0.00, NULL, NULL, 'ABAYO', 'Homere', 'homere.abayo@gmail.com', '0781322698', '2668+Jrr, Kabuga', 'Suite #BVO125', 'Kigali City', 'CA', 'Rwanda', 'ABAYO', 'Homere', '0781322698', '2668+Jrr, Kabuga', 'Suite #BVO125', 'Kigali City', 'CA', 'Rwanda', '2026-06-10 17:46:00', NULL, NULL, NULL, NULL, '2026-06-10 15:46:00', '2026-06-10 15:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(14,2) NOT NULL,
  `discount_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(14,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `sku`, `quantity`, `unit_price`, `discount_amount`, `tax_amount`, `line_total`, `created_at`) VALUES
(1, 1, 1, 'Pizza', '23', 1, 8000.00, 0.00, 0.00, 8000.00, '2026-04-17 17:10:11'),
(2, 2, 1, 'Pizza', '23', 1, 8000.00, 0.00, 0.00, 8000.00, '2026-04-19 12:58:51'),
(5, 3, 361, 'Tomato fresh local', 'PL-104', 1, 1200.00, 0.00, 0.00, 1200.00, '2026-06-07 17:18:08'),
(6, 4, 332, 'Onion red', 'PL-075', 1, 1200.00, 0.00, 0.00, 1200.00, '2026-06-07 18:55:07'),
(8, 6, 317, 'Kiwi Fruits', 'PL-060', 1, 18000.00, 0.00, 0.00, 18000.00, '2026-06-08 02:02:36'),
(9, 6, 342, 'Pineapple', 'PL-085', 1, 800.00, 0.00, 0.00, 800.00, '2026-06-08 02:02:36'),
(10, 7, 317, 'Kiwi Fruits', 'PL-060', 1, 18000.00, 0.00, 0.00, 18000.00, '2026-06-08 02:02:42'),
(11, 7, 342, 'Pineapple', 'PL-085', 1, 800.00, 0.00, 0.00, 800.00, '2026-06-08 02:02:42'),
(12, 8, 317, 'Kiwi Fruits', 'PL-060', 1, 18000.00, 0.00, 0.00, 18000.00, '2026-06-08 02:02:43'),
(13, 8, 342, 'Pineapple', 'PL-085', 1, 800.00, 0.00, 0.00, 800.00, '2026-06-08 02:02:43'),
(14, 9, 256, 'Amamesa(palm oil)', 'PL-001', 1, 3500.00, 0.00, 0.00, 3500.00, '2026-06-08 02:09:28'),
(15, 10, 360, 'Thyme', 'PL-103', 1, 1500.00, 0.00, 0.00, 1500.00, '2026-06-08 02:17:37'),
(16, 11, 381, 'Shallot onion', 'PL-123', 1, 2500.00, 0.00, 0.00, 2500.00, '2026-06-10 15:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_notes`
--

CREATE TABLE `order_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` bigint(20) UNSIGNED NOT NULL,
  `note` text NOT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_notes`
--

INSERT INTO `order_notes` (`id`, `order_id`, `admin_user_id`, `note`, `is_internal`, `created_at`) VALUES
(1, 1, 1, 'Order processing', 1, '2026-04-19 08:15:09'),
(2, 1, 1, 'Order confirmed', 1, '2026-04-19 08:19:07'),
(3, 1, 1, 'V-Pay payment manually verified', 1, '2026-04-19 12:47:52'),
(4, 2, 1, 'V-Pay payment manually verified', 1, '2026-05-11 13:30:48');

-- --------------------------------------------------------

--
-- Table structure for table `order_timeline`
--

CREATE TABLE `order_timeline` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `status_type` enum('order','payment','delivery') NOT NULL,
  `old_status` varchar(100) DEFAULT NULL,
  `new_status` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `changed_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_timeline`
--

INSERT INTO `order_timeline` (`id`, `order_id`, `status_type`, `old_status`, `new_status`, `description`, `changed_by`, `changed_at`, `created_at`) VALUES
(1, 1, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-04-17 19:10:11', '2026-04-17 17:10:11'),
(2, 1, 'order', 'pending', 'processing', 'Order processing', 1, '2026-04-19 10:15:09', '2026-04-19 08:15:09'),
(3, 1, 'order', 'processing', 'shipped', 'order status updated', 1, '2026-04-19 10:18:47', '2026-04-19 08:18:47'),
(4, 1, 'delivery', 'pending', 'in_transit', 'delivery status updated', 1, '2026-04-19 10:18:47', '2026-04-19 08:18:47'),
(5, 1, 'order', 'shipped', 'delivered', 'order status updated', 1, '2026-04-19 10:19:02', '2026-04-19 08:19:02'),
(6, 1, 'delivery', 'in_transit', 'delivered', 'delivery status updated', 1, '2026-04-19 10:19:02', '2026-04-19 08:19:02'),
(7, 1, 'order', 'delivered', 'confirmed', 'Order confirmed', 1, '2026-04-19 10:19:07', '2026-04-19 08:19:07'),
(8, 1, 'order', 'confirmed', 'delivered', 'order status updated', 1, '2026-04-19 10:19:17', '2026-04-19 08:19:17'),
(9, 1, 'payment', 'pending', 'paid', 'V-Pay payment manually verified', 1, '2026-04-19 14:47:52', '2026-04-19 12:47:52'),
(10, 2, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-04-19 14:58:51', '2026-04-19 12:58:51'),
(11, 2, 'payment', NULL, 'pending', 'V-Pay payment initiated from storefront checkout', NULL, '2026-04-19 14:58:51', '2026-04-19 12:58:51'),
(12, 2, 'order', 'pending', 'confirmed', 'V-Pay payment manually verified', 1, '2026-05-11 15:30:48', '2026-05-11 13:30:48'),
(13, 2, 'payment', 'pending', 'paid', 'V-Pay payment manually verified', 1, '2026-05-11 15:30:48', '2026-05-11 13:30:48'),
(16, 3, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-07 19:18:10', '2026-06-07 17:18:10'),
(17, 3, 'payment', NULL, 'pending', 'V-Pay payment initiated from storefront checkout', NULL, '2026-06-07 19:18:10', '2026-06-07 17:18:10'),
(18, 4, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-07 20:55:07', '2026-06-07 18:55:07'),
(19, 4, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-07 20:55:07', '2026-06-07 18:55:07'),
(21, 6, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-08 04:02:36', '2026-06-08 02:02:36'),
(22, 6, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-08 04:02:42', '2026-06-08 02:02:42'),
(23, 7, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-08 04:02:42', '2026-06-08 02:02:42'),
(24, 7, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-08 04:02:43', '2026-06-08 02:02:43'),
(25, 8, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-08 04:02:43', '2026-06-08 02:02:43'),
(26, 8, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-08 04:02:45', '2026-06-08 02:02:45'),
(27, 9, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-08 04:09:28', '2026-06-08 02:09:28'),
(28, 9, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-08 04:09:34', '2026-06-08 02:09:34'),
(29, 10, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-08 04:17:37', '2026-06-08 02:17:37'),
(30, 10, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-08 04:17:41', '2026-06-08 02:17:41'),
(31, 11, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, '2026-06-10 17:46:00', '2026-06-10 15:46:00'),
(32, 11, 'payment', NULL, 'pending', 'PesaPal payment initiated from storefront checkout', NULL, '2026-06-10 17:46:03', '2026-06-10 15:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_type` enum('admin','customer') NOT NULL,
  `email` varchar(190) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(80) NOT NULL,
  `provider` enum('cash','manual','other','pesapal') NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `requires_manual_verification` tinyint(1) NOT NULL DEFAULT 0,
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `code`, `provider`, `is_enabled`, `requires_manual_verification`, `config_json`, `created_at`, `updated_at`) VALUES
(2, 'V-Pay', 'vpay', '', 0, 0, '{\"api_key\": \"\", \"api_user\": \"\", \"base_url\": \"https://pay.vonsung.rw/api\", \"payment_method\": \"MTN\"}', '2026-04-14 16:46:39', '2026-06-07 18:02:34'),
(5, 'PesaPal', 'pesapal', 'pesapal', 1, 0, '{}', '2026-06-07 18:00:01', '2026-06-07 19:46:22');

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method_id` bigint(20) UNSIGNED NOT NULL,
  `provider_reference` varchar(150) DEFAULT NULL,
  `merchant_reference` varchar(150) DEFAULT NULL,
  `transaction_type` enum('charge','refund','verification') NOT NULL DEFAULT 'charge',
  `amount` decimal(14,2) NOT NULL,
  `currency_code` varchar(10) NOT NULL DEFAULT 'RWF',
  `status` enum('pending','success','failed','cancelled','refunded','manual_review') NOT NULL DEFAULT 'pending',
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `response_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `failure_message` text DEFAULT NULL,
  `verified_manually_by` bigint(20) UNSIGNED DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `payment_transactions`
--

INSERT INTO `payment_transactions` (`id`, `order_id`, `payment_method_id`, `provider_reference`, `merchant_reference`, `transaction_type`, `amount`, `currency_code`, `status`, `request_payload`, `response_payload`, `failure_message`, `verified_manually_by`, `verified_at`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, NULL, 'charge', 8000.00, 'RWF', 'success', '{\"provider\": \"vpay\", \"orderNumber\": \"ORD-20260417-WDOF4I\", \"customerEmail\": \"homere.abayo@gmail.com\"}', NULL, NULL, 1, '2026-04-19 14:47:52', '2026-04-17 17:10:11', '2026-05-14 14:25:21'),
(2, 2, 2, NULL, 'VPAY-ORD-20260419-2MPW8N-2', 'charge', 8000.00, 'RWF', 'success', '{\"amount\": 8000, \"orderId\": 2, \"provider\": \"vpay\", \"orderNumber\": \"ORD-20260419-2MPW8N\", \"currencyCode\": \"RWF\", \"customerEmail\": \"homere.abayo@gmail.com\", \"customerPhone\": \"0781322698\", \"transactionId\": 2}', NULL, NULL, 1, '2026-05-11 15:30:48', '2026-04-19 12:58:51', '2026-05-14 14:25:21'),
(5, 3, 2, NULL, 'VPAY-ORD-20260607-C6TOBE-5', 'charge', 3197.00, 'RWF', 'pending', '{\"orderId\":3,\"orderNumber\":\"ORD-20260607-C6TOBE\",\"provider\":\"vpay\",\"transactionId\":5,\"amount\":3197,\"currencyCode\":\"RWF\",\"customerEmail\":\"homere.abayo@gmail.com\",\"customerPhone\":\"0781322698\"}', NULL, NULL, NULL, NULL, '2026-06-07 17:18:10', '2026-06-07 17:18:10'),
(6, 4, 5, NULL, 'PESAPAL-ORD-20260607-Z6QXZ9-6', 'charge', 3197.00, 'RWF', 'pending', '{\"orderId\":4,\"orderNumber\":\"ORD-20260607-Z6QXZ9\",\"provider\":\"\",\"transactionId\":6,\"amount\":3197,\"currencyCode\":\"RWF\",\"customerEmail\":\"homere.abayo@gmail.com\",\"customerPhone\":\"0781322698\"}', NULL, NULL, NULL, NULL, '2026-06-07 18:55:07', '2026-06-07 18:55:07'),
(8, 6, 5, NULL, 'PP-ORD-20260608-OZOJG0-8', 'charge', 20797.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260608-OZOJG0-8\",\"currency\":\"RWF\",\"amount\":20797,\"description\":\"Payment for order ORD-20260608-OZOJG0\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=6&orderNumber=ORD-20260608-OZOJG0&ref=PP-ORD-20260608-OZOJG0-8\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"homere.abayo@gmail.com\",\"phone_number\":\"0781322698\",\"country_code\":\"RW\",\"first_name\":\"ABAYO\",\"middle_name\":\"\",\"last_name\":\"Homere\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}}', '{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}', NULL, NULL, NULL, '2026-06-08 02:02:36', '2026-06-08 02:02:42'),
(9, 7, 5, NULL, 'PP-ORD-20260608-LC2916-9', 'charge', 20797.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260608-LC2916-9\",\"currency\":\"RWF\",\"amount\":20797,\"description\":\"Payment for order ORD-20260608-LC2916\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=7&orderNumber=ORD-20260608-LC2916&ref=PP-ORD-20260608-LC2916-9\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"homere.abayo@gmail.com\",\"phone_number\":\"0781322698\",\"country_code\":\"RW\",\"first_name\":\"ABAYO\",\"middle_name\":\"\",\"last_name\":\"Homere\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}}', '{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}', NULL, NULL, NULL, '2026-06-08 02:02:42', '2026-06-08 02:02:43'),
(10, 8, 5, NULL, 'PP-ORD-20260608-163FKG-10', 'charge', 20797.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260608-163FKG-10\",\"currency\":\"RWF\",\"amount\":20797,\"description\":\"Payment for order ORD-20260608-163FKG\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=8&orderNumber=ORD-20260608-163FKG&ref=PP-ORD-20260608-163FKG-10\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"homere.abayo@gmail.com\",\"phone_number\":\"0781322698\",\"country_code\":\"RW\",\"first_name\":\"ABAYO\",\"middle_name\":\"\",\"last_name\":\"Homere\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}}', '{\"error\":{\"error_type\":\"contractual_error\",\"code\":\"amount_exceeds_default_limit\",\"message\":\"Transaction amount exceeds limit.Contact support for assistance\"},\"status\":\"500\"}', NULL, NULL, NULL, '2026-06-08 02:02:43', '2026-06-08 02:02:45'),
(11, 9, 5, '0e0b8c09-8f03-4111-acab-da49dd42ac13', 'PP-ORD-20260608-755N88-11', 'charge', 3500.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260608-755N88-11\",\"currency\":\"RWF\",\"amount\":3500,\"description\":\"Payment for order ORD-20260608-755N88\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=9&orderNumber=ORD-20260608-755N88&ref=PP-ORD-20260608-755N88-11\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"test@eliteagrisolution.com\",\"phone_number\":\"0780000000\",\"country_code\":\"RW\",\"first_name\":\"Test\",\"middle_name\":\"\",\"last_name\":\"User\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"order_tracking_id\":\"0e0b8c09-8f03-4111-acab-da49dd42ac13\",\"merchant_reference\":\"PP-ORD-20260608-755N88-11\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=0e0b8c09-8f03-4111-acab-da49dd42ac13\",\"error\":null,\"status\":\"200\"}}', '{\"order_tracking_id\":\"0e0b8c09-8f03-4111-acab-da49dd42ac13\",\"merchant_reference\":\"PP-ORD-20260608-755N88-11\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=0e0b8c09-8f03-4111-acab-da49dd42ac13\",\"error\":null,\"status\":\"200\"}', NULL, NULL, NULL, '2026-06-08 02:09:28', '2026-06-08 02:09:34'),
(12, 10, 5, 'be835b5b-4875-4472-9ccf-da4957cc124f', 'PP-ORD-20260608-XZTIUN-12', 'charge', 3497.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260608-XZTIUN-12\",\"currency\":\"RWF\",\"amount\":3497,\"description\":\"Payment for order ORD-20260608-XZTIUN\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=10&orderNumber=ORD-20260608-XZTIUN&ref=PP-ORD-20260608-XZTIUN-12\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"homere.abayo@gmail.com\",\"phone_number\":\"0781322698\",\"country_code\":\"RW\",\"first_name\":\"ABAYO\",\"middle_name\":\"\",\"last_name\":\"Homere\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"order_tracking_id\":\"be835b5b-4875-4472-9ccf-da4957cc124f\",\"merchant_reference\":\"PP-ORD-20260608-XZTIUN-12\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=be835b5b-4875-4472-9ccf-da4957cc124f\",\"error\":null,\"status\":\"200\"}}', '{\"order_tracking_id\":\"be835b5b-4875-4472-9ccf-da4957cc124f\",\"merchant_reference\":\"PP-ORD-20260608-XZTIUN-12\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=be835b5b-4875-4472-9ccf-da4957cc124f\",\"error\":null,\"status\":\"200\"}', NULL, NULL, NULL, '2026-06-08 02:17:37', '2026-06-08 02:17:41'),
(13, 11, 5, 'a8b1e90a-8034-45aa-9d93-da4746d4c3b2', 'PP-ORD-20260610-ZKIKJY-13', 'charge', 4497.00, 'RWF', 'pending', '{\"id\":\"PP-ORD-20260610-ZKIKJY-13\",\"currency\":\"RWF\",\"amount\":4497,\"description\":\"Payment for order ORD-20260610-ZKIKJY\",\"callback_url\":\"https://eliteagrisolution.com/order-success?orderId=11&orderNumber=ORD-20260610-ZKIKJY&ref=PP-ORD-20260610-ZKIKJY-13\",\"redirect_mode\":\"TOP_WINDOW\",\"notification_id\":\"30314bc7-2d09-4fe0-a15d-da498fac2176\",\"branch\":\"Elite Agri Solution\",\"billing_address\":{\"email_address\":\"homere.abayo@gmail.com\",\"phone_number\":\"0781322698\",\"country_code\":\"RW\",\"first_name\":\"ABAYO\",\"middle_name\":\"\",\"last_name\":\"Homere\",\"line_1\":\"\",\"line_2\":\"\",\"city\":\"\",\"state\":\"\",\"postal_code\":\"\",\"zip_code\":\"\"},\"providerResponse\":{\"order_tracking_id\":\"a8b1e90a-8034-45aa-9d93-da4746d4c3b2\",\"merchant_reference\":\"PP-ORD-20260610-ZKIKJY-13\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=a8b1e90a-8034-45aa-9d93-da4746d4c3b2\",\"error\":null,\"status\":\"200\"}}', '{\"order_tracking_id\":\"a8b1e90a-8034-45aa-9d93-da4746d4c3b2\",\"merchant_reference\":\"PP-ORD-20260610-ZKIKJY-13\",\"redirect_url\":\"https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=a8b1e90a-8034-45aa-9d93-da4746d4c3b2\",\"error\":null,\"status\":\"200\"}', NULL, NULL, NULL, '2026-06-10 15:46:00', '2026-06-10 15:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module` varchar(100) NOT NULL,
  `action` varchar(100) NOT NULL,
  `permission_key` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module`, `action`, `permission_key`, `description`, `created_at`, `updated_at`) VALUES
(1, 'dashboard', 'view', 'dashboard.view', 'View dashboard', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(2, 'admins', 'manage', 'admins.manage', 'Manage admin users', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(3, 'roles', 'manage', 'roles.manage', 'Manage roles and permissions', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(4, 'products', 'view', 'products.view', 'View products', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(5, 'products', 'create', 'products.create', 'Create products', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(6, 'products', 'update', 'products.update', 'Update products', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(7, 'products', 'delete', 'products.delete', 'Delete products', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(8, 'categories', 'manage', 'categories.manage', 'Manage categories', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(9, 'orders', 'view', 'orders.view', 'View orders', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(10, 'orders', 'update', 'orders.update', 'Update orders', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(11, 'payments', 'view', 'payments.view', 'View payments', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(12, 'payments', 'manage', 'payments.manage', 'Manage payments', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(13, 'customers', 'view', 'customers.view', 'View customers', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(14, 'customers', 'manage', 'customers.manage', 'Manage customers', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(15, 'inventory', 'view', 'inventory.view', 'View stock', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(16, 'inventory', 'manage', 'inventory.manage', 'Manage stock', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(17, 'promotions', 'manage', 'promotions.manage', 'Manage coupons/promotions', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(18, 'content', 'manage', 'content.manage', 'Manage homepage and content', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(19, 'reviews', 'manage', 'reviews.manage', 'Manage reviews', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(20, 'reports', 'view', 'reports.view', 'View analytics reports', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(21, 'settings', 'manage', 'settings.manage', 'Manage system settings', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(22, 'media', 'manage', 'media.manage', 'Manage uploaded media', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(23, 'notifications', 'manage', 'notifications.manage', 'Manage notifications', '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(24, 'audit', 'view', 'audit.view', 'View audit logs', '2026-04-14 16:46:39', '2026-04-14 16:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `price` decimal(14,2) NOT NULL,
  `discount_price` decimal(14,2) DEFAULT NULL,
  `cost_price` decimal(14,2) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `low_stock_threshold` int(11) NOT NULL DEFAULT 5,
  `weight` decimal(10,2) DEFAULT NULL,
  `weight_unit` varchar(20) DEFAULT 'kg',
  `brand` varchar(120) DEFAULT NULL,
  `status` enum('draft','active','inactive','archived') NOT NULL DEFAULT 'draft',
  `product_condition` enum('new','used','refurbished') NOT NULL DEFAULT 'new',
  `featured_product` tinyint(1) NOT NULL DEFAULT 0,
  `best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `is_searchable` tinyint(1) NOT NULL DEFAULT 1,
  `auto_hide_when_out_of_stock` tinyint(1) NOT NULL DEFAULT 0,
  `visibility` enum('public','hidden') NOT NULL DEFAULT 'public',
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_reviews` int(11) NOT NULL DEFAULT 0,
  `total_sales` int(11) NOT NULL DEFAULT 0,
  `view_count` int(11) NOT NULL DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `og_image_url` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `short_description`, `description`, `price`, `discount_price`, `cost_price`, `stock_quantity`, `low_stock_threshold`, `weight`, `weight_unit`, `brand`, `status`, `product_condition`, `featured_product`, `best_seller`, `new_arrival`, `is_searchable`, `auto_hide_when_out_of_stock`, `visibility`, `average_rating`, `total_reviews`, `total_sales`, `view_count`, `meta_title`, `meta_description`, `og_image_url`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(256, 'Amamesa(palm oil)', 'amamesa-palm-oil-001', 'PL-001', 'Quality Amamesa(palm oil) prepared for everyday household and kitchen use.', 'Quality Amamesa(palm oil) from the current price list, prepared for storefront sale and everyday kitchen use.', 3500.00, NULL, NULL, 99, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 1, 2, 'Amamesa(palm oil)', 'Quality Amamesa(palm oil) prepared for everyday household and kitchen use.', '/uploads/Products/1.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-08 02:09:28', NULL),
(257, 'Amateke(Arrow roots)', 'amateke-arrow-roots-002', 'PL-002', 'Fresh Amateke(Arrow roots) suitable for boiling, frying, roasting, or staple meals.', 'Fresh Amateke(Arrow roots) from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Amateke(Arrow roots)', 'Fresh Amateke(Arrow roots) suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/2.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:51', NULL),
(258, 'Endive lettuce', 'endive-lettuce-003', 'PL-003', 'Fresh Endive lettuce selected for cooking, salads, and everyday produce use.', 'Fresh Endive lettuce from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Endive lettuce', 'Fresh Endive lettuce selected for cooking, salads, and everyday produce use.', '/uploads/Products/3.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(259, 'Apple red', 'apple-red', 'PL-004', 'Fresh Apple red selected for sweetness, color, and daily retail display.', 'Fresh Apple red from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 4800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Apple red', 'Fresh Apple red selected for sweetness, color, and daily retail display.', '/uploads/Products/4.png', '2026-05-13 00:46:00', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(260, 'Apple green', 'apple-green', 'PL-005', 'Fresh Apple green selected for sweetness, color, and daily retail display.', 'Fresh Apple green from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 4200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Apple green', 'Fresh Apple green selected for sweetness, color, and daily retail display.', '/uploads/Products/5.png', '2026-05-13 00:46:00', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(261, 'Avocado', 'avocado-006', 'PL-006', 'Fresh Avocado selected for sweetness, color, and daily retail display.', 'Fresh Avocado from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Avocado', 'Fresh Avocado selected for sweetness, color, and daily retail display.', '/uploads/Products/6.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(262, 'Baby Banana', 'baby-banana-007', 'PL-007', 'Fresh Baby Banana selected for sweetness, color, and daily retail display.', 'Fresh Baby Banana from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Baby Banana', 'Fresh Baby Banana selected for sweetness, color, and daily retail display.', '/uploads/Products/7.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(263, 'Baby carrot', 'baby-carrot-008', 'PL-008', 'Fresh Baby carrot selected for cooking, salads, and everyday produce use.', 'Fresh Baby carrot from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 1, 1, 0, 'public', 0.00, 0, 0, 6, 'Baby carrot', 'Fresh Baby carrot selected for cooking, salads, and everyday produce use.', '/uploads/Products/8.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-28 08:33:24', NULL),
(264, 'Baby Marrow', 'baby-marrow-009', 'PL-009', 'Fresh Baby Marrow selected for cooking, salads, and everyday produce use.', 'Fresh Baby Marrow from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Baby Marrow', 'Fresh Baby Marrow selected for cooking, salads, and everyday produce use.', '/uploads/Products/9.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(265, 'Baby Potatoes', 'baby-potatoes-010', 'PL-010', 'Fresh Baby Potatoes suitable for boiling, frying, roasting, or staple meals.', 'Fresh Baby Potatoes from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 3, 'Baby Potatoes', 'Fresh Baby Potatoes suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/10.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 09:03:21', NULL),
(266, 'Banana big(Gromishel)', 'banana-big-gromishel-011', 'PL-011', 'Fresh Banana big(Gromishel) selected for sweetness, color, and daily retail display.', 'Fresh Banana big(Gromishel) from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 1, 'Banana big(Gromishel)', 'Fresh Banana big(Gromishel) selected for sweetness, color, and daily retail display.', '/uploads/Products/11.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-25 19:17:15', NULL),
(267, 'Banana green', 'banana-green-012', 'PL-012', 'Fresh Banana green selected for sweetness, color, and daily retail display.', 'Fresh Banana green from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Banana green', 'Fresh Banana green selected for sweetness, color, and daily retail display.', '/uploads/Products/12.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(268, 'Banana leaves', 'banana-leaves-013', 'PL-013', 'Quality Banana leaves prepared for everyday household and kitchen use.', 'Quality Banana leaves from the current price list, prepared for storefront sale and everyday kitchen use.', 600.00, NULL, NULL, 100, 5, NULL, 'pc', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Banana leaves', 'Quality Banana leaves prepared for everyday household and kitchen use.', '/uploads/Products/13.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(269, 'Basil', 'basil-014', 'PL-014', 'Fresh Basil with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Basil from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Basil', 'Fresh Basil with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/14.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(270, 'Fresh Beans(Ibitonore)', 'fresh-beans-ibitonore-015', 'PL-015', 'Quality Fresh Beans(Ibitonore) suited for soups, stews, and daily kitchen use.', 'Quality Fresh Beans(Ibitonore) from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 1600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Fresh Beans(Ibitonore)', 'Quality Fresh Beans(Ibitonore) suited for soups, stews, and daily kitchen use.', '/uploads/Products/15.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(271, 'Beans long yellow', 'beans-long-yellow-016', 'PL-016', 'Quality Beans long yellow suited for soups, stews, and daily kitchen use.', 'Quality Beans long yellow from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Beans long yellow', 'Quality Beans long yellow suited for soups, stews, and daily kitchen use.', '/uploads/Products/16.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(272, 'Beans white', 'beans-white-017', 'PL-017', 'Quality Beans white suited for soups, stews, and daily kitchen use.', 'Quality Beans white from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Beans white', 'Quality Beans white suited for soups, stews, and daily kitchen use.', '/uploads/Products/17.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(273, 'Beans red', 'beans-red-018', 'PL-018', 'Quality Beans red suited for soups, stews, and daily kitchen use.', 'Quality Beans red from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Beans red', 'Quality Beans red suited for soups, stews, and daily kitchen use.', '/uploads/Products/18.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(274, 'Beet root', 'beet-root-019', 'PL-019', 'Fresh Beet root selected for cooking, salads, and everyday produce use.', 'Fresh Beet root from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Beet root', 'Fresh Beet root selected for cooking, salads, and everyday produce use.', '/uploads/Products/19.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(275, 'Bell pepper yellow', 'bell-pepper-yellow-020', 'PL-020', 'Fresh Bell pepper yellow selected for cooking, salads, and everyday produce use.', 'Fresh Bell pepper yellow from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3400.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Bell pepper yellow', 'Fresh Bell pepper yellow selected for cooking, salads, and everyday produce use.', '/uploads/Products/20.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(276, 'Bell pepper red', 'bell-pepper-red-021', 'PL-021', 'Fresh Bell pepper red selected for cooking, salads, and everyday produce use.', 'Fresh Bell pepper red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3400.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 1, 0, 1, 0, 'public', 0.00, 0, 0, 2, 'Bell pepper red', 'Fresh Bell pepper red selected for cooking, salads, and everyday produce use.', '/uploads/Products/21.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-10 16:16:32', NULL),
(277, 'Bok choy', 'bok-choy-022', 'PL-022', 'Fresh Bok choy selected for cooking, salads, and everyday produce use.', 'Fresh Bok choy from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 1, 'Bok choy', 'Fresh Bok choy selected for cooking, salads, and everyday produce use.', '/uploads/Products/22.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 10:25:58', NULL),
(278, 'Broccoli', 'broccoli-023', 'PL-023', 'Fresh Broccoli selected for cooking, salads, and everyday produce use.', 'Fresh Broccoli from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 1, 1, 0, 'public', 0.00, 0, 0, 7, 'Broccoli', 'Fresh Broccoli selected for cooking, salads, and everyday produce use.', '/uploads/Products/23.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-28 03:03:29', NULL),
(279, 'Broccoli trimmed(zikase)', 'broccoli-trimmed-zikase-023-2', 'PL-023-2', 'Fresh Broccoli trimmed(zikase) selected for cooking, salads, and everyday produce use.', 'Fresh Broccoli trimmed(zikase) from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 5000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Broccoli trimmed(zikase)', 'Fresh Broccoli trimmed(zikase) selected for cooking, salads, and everyday produce use.', '/uploads/Products/23b.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(280, 'Butter nut', 'butter-nut-024', 'PL-024', 'Fresh Butter nut selected for cooking, salads, and everyday produce use.', 'Fresh Butter nut from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 3, 'Butter nut', 'Fresh Butter nut selected for cooking, salads, and everyday produce use.', '/uploads/Products/24.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 13:55:58', NULL),
(281, 'Cabbage red', 'cabbage-red-025', 'PL-025', 'Fresh Cabbage red selected for cooking, salads, and everyday produce use.', 'Fresh Cabbage red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cabbage red', 'Fresh Cabbage red selected for cooking, salads, and everyday produce use.', '/uploads/Products/25.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(282, 'Cabbage White', 'cabbage-white-026', 'PL-026', 'Fresh Cabbage White selected for cooking, salads, and everyday produce use.', 'Fresh Cabbage White from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 350.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Cabbage White', 'Fresh Cabbage White selected for cooking, salads, and everyday produce use.', '/uploads/Products/26.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(283, 'Chinese Cabbage', 'chinese-cabbage-027', 'PL-027', 'Fresh Chinese Cabbage selected for cooking, salads, and everyday produce use.', 'Fresh Chinese Cabbage from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Chinese Cabbage', 'Fresh Chinese Cabbage selected for cooking, salads, and everyday produce use.', '/uploads/Products/27.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(284, 'Carrot local', 'carrot-local-028', 'PL-028', 'Fresh Carrot local selected for cooking, salads, and everyday produce use.', 'Fresh Carrot local from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Carrot local', 'Fresh Carrot local selected for cooking, salads, and everyday produce use.', '/uploads/Products/28.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(285, 'Cassava', 'cassava-029', 'PL-029', 'Fresh Cassava suitable for boiling, frying, roasting, or staple meals.', 'Fresh Cassava from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cassava', 'Fresh Cassava suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/29.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(286, 'Cassava Flour(Ubugali)', 'cassava-flour-ubugali-030', 'PL-030', 'Fresh Cassava Flour(Ubugali) suitable for boiling, frying, roasting, or staple meals.', 'Fresh Cassava Flour(Ubugali) from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cassava Flour(Ubugali)', 'Fresh Cassava Flour(Ubugali) suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/30.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(287, 'Cauliflower', 'cauliflower-031', 'PL-031', 'Fresh Cauliflower selected for cooking, salads, and everyday produce use.', 'Fresh Cauliflower from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cauliflower', 'Fresh Cauliflower selected for cooking, salads, and everyday produce use.', '/uploads/Products/31.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(288, 'Cauliflower trimmed(Zikase)', 'cauliflower-trimmed-zikase-031-2', 'PL-031-2', 'Fresh Cauliflower trimmed(Zikase) selected for cooking, salads, and everyday produce use.', 'Fresh Cauliflower trimmed(Zikase) from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cauliflower trimmed(Zikase)', 'Fresh Cauliflower trimmed(Zikase) selected for cooking, salads, and everyday produce use.', '/uploads/Products/31b.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(289, 'Cerely', 'cerely-032', 'PL-032', 'Fresh Cerely selected for cooking, salads, and everyday produce use.', 'Fresh Cerely from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cerely', 'Fresh Cerely selected for cooking, salads, and everyday produce use.', '/uploads/Products/32.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(290, 'Cherry Tomato', 'cherry-tomato-033', 'PL-033', 'Fresh Cherry Tomato selected for cooking, salads, and everyday produce use.', 'Fresh Cherry Tomato from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 5000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cherry Tomato', 'Fresh Cherry Tomato selected for cooking, salads, and everyday produce use.', '/uploads/Products/33.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(291, 'Cherry tomato with stick', 'cherry-tomato-with-stick-034', 'PL-034', 'Fresh Cherry tomato with stick selected for cooking, salads, and everyday produce use.', 'Fresh Cherry tomato with stick from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 6000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Cherry tomato with stick', 'Fresh Cherry tomato with stick selected for cooking, salads, and everyday produce use.', '/uploads/Products/34.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(292, 'Chill green', 'chill-green-035', 'PL-035', 'Fresh Chill green selected for cooking, salads, and everyday produce use.', 'Fresh Chill green from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Chill green', 'Fresh Chill green selected for cooking, salads, and everyday produce use.', '/uploads/Products/35.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(293, 'Chill red', 'chill-red-036', 'PL-036', 'Fresh Chill red selected for cooking, salads, and everyday produce use.', 'Fresh Chill red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 1, 'Chill red', 'Fresh Chill red selected for cooking, salads, and everyday produce use.', '/uploads/Products/36.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-20 04:28:09', NULL),
(294, 'Chives', 'chives-037', 'PL-037', 'Fresh Chives with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Chives from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Chives', 'Fresh Chives with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/37.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(295, 'Coriander', 'coriander-038', 'PL-038', 'Fresh Coriander with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Coriander from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Coriander', 'Fresh Coriander with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/38.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(296, 'Cucumber', 'cucumber-039', 'PL-039', 'Fresh Cucumber selected for cooking, salads, and everyday produce use.', 'Fresh Cucumber from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Cucumber', 'Fresh Cucumber selected for cooking, salads, and everyday produce use.', '/uploads/Products/39.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(297, 'Dill herb', 'dill-herb-040', 'PL-040', 'Fresh Dill herb with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Dill herb from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Dill herb', 'Fresh Dill herb with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/40.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(298, 'Dodo', 'dodo-041', 'PL-041', 'Fresh Dodo selected for cooking, salads, and everyday produce use.', 'Fresh Dodo from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Dodo', 'Fresh Dodo selected for cooking, salads, and everyday produce use.', '/uploads/Products/41.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(299, 'Eggplant(Auberigine)', 'eggplant-auberigine-042', 'PL-042', 'Fresh Eggplant(Auberigine) selected for cooking, salads, and everyday produce use.', 'Fresh Eggplant(Auberigine) from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Eggplant(Auberigine)', 'Fresh Eggplant(Auberigine) selected for cooking, salads, and everyday produce use.', '/uploads/Products/42.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(300, 'Fennel', 'fennel-043', 'PL-043', 'Fresh Fennel with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Fennel from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Fennel', 'Fresh Fennel with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/43.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(301, 'French Beans', 'french-beans-044', 'PL-044', 'Quality French Beans suited for soups, stews, and daily kitchen use.', 'Quality French Beans from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 1600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'French Beans', 'Quality French Beans suited for soups, stews, and daily kitchen use.', '/uploads/Products/44.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(302, 'Flat parsley', 'flat-parsley-045', 'PL-045', 'Fresh Flat parsley with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Flat parsley from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Flat parsley', 'Fresh Flat parsley with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/45.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(303, 'Garden peas', 'garden-peas-046', 'PL-046', 'Quality Garden peas suited for soups, stews, and daily kitchen use.', 'Quality Garden peas from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 3400.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Garden peas', 'Quality Garden peas suited for soups, stews, and daily kitchen use.', '/uploads/Products/46.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(304, 'Garlic Peeled', 'garlic-peeled-047', 'PL-047', 'Fresh Garlic Peeled with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Garlic Peeled from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 4000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Garlic Peeled', 'Fresh Garlic Peeled with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/47.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(305, 'Ginger', 'ginger-048', 'PL-048', 'Fresh Ginger with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Ginger from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Ginger', 'Fresh Ginger with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/48.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(306, 'Gooseberry', 'gooseberry-049', 'PL-049', 'Fresh Gooseberry selected for sweetness, color, and daily retail display.', 'Fresh Gooseberry from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Gooseberry', 'Fresh Gooseberry selected for sweetness, color, and daily retail display.', '/uploads/Products/49.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(307, 'Grapes red Imported', 'grapes-red-imported-050', 'PL-050', 'Fresh Grapes red Imported selected for sweetness, color, and daily retail display.', 'Fresh Grapes red Imported from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 15000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Grapes red Imported', 'Fresh Grapes red Imported selected for sweetness, color, and daily retail display.', '/uploads/Products/50.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(308, 'Grapes green', 'grapes-green-051', 'PL-051', 'Fresh Grapes green selected for sweetness, color, and daily retail display.', 'Fresh Grapes green from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 15000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Grapes green', 'Fresh Grapes green selected for sweetness, color, and daily retail display.', '/uploads/Products/51.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(309, 'Green Papper', 'green-papper-052', 'PL-052', 'Fresh Green Papper selected for cooking, salads, and everyday produce use.', 'Fresh Green Papper from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Green Papper', 'Fresh Green Papper selected for cooking, salads, and everyday produce use.', '/uploads/Products/52.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(310, 'Groundnut (Ubunyobwa buseye)', 'groundnut-ubunyobwa-buseye-053', 'PL-053', 'Quality Groundnut (Ubunyobwa buseye) prepared for snacking, sauces, and pantry use.', 'Quality Groundnut (Ubunyobwa buseye) from the current price list, prepared for storefront sale and suitable for pantry use, sauces, and snacking.', 3500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 3, 'Groundnut (Ubunyobwa buseye)', 'Quality Groundnut (Ubunyobwa buseye) prepared for snacking, sauces, and pantry use.', '/uploads/Products/53.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 09:10:18', NULL),
(311, 'Guava Green', 'guava-green-054', 'PL-054', 'Fresh Guava Green selected for sweetness, color, and daily retail display.', 'Fresh Guava Green from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Guava Green', 'Fresh Guava Green selected for sweetness, color, and daily retail display.', '/uploads/Products/54.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(312, 'Imizuzu (banana plantain)', 'imizuzu-banana-plantain-055', 'PL-055', 'Fresh Imizuzu (banana plantain) suitable for boiling, frying, roasting, or staple meals.', 'Fresh Imizuzu (banana plantain) from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Imizuzu (banana plantain)', 'Fresh Imizuzu (banana plantain) suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/55.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(313, 'Intoryi', 'intoryi-056', 'PL-056', 'Fresh Intoryi selected for cooking, salads, and everyday produce use.', 'Fresh Intoryi from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Intoryi', 'Fresh Intoryi selected for cooking, salads, and everyday produce use.', '/uploads/Products/56.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(314, 'Irish Potato', 'irish-potato-057', 'PL-057', 'Fresh Irish Potato suitable for boiling, frying, roasting, or staple meals.', 'Fresh Irish Potato from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 1100.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Irish Potato', 'Fresh Irish Potato suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/57.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(315, 'Isombe', 'isombe-058', 'PL-058', 'Fresh Isombe selected for cooking, salads, and everyday produce use.', 'Fresh Isombe from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Isombe', 'Fresh Isombe selected for cooking, salads, and everyday produce use.', '/uploads/Products/58.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(316, 'Kale', 'kale-059', 'PL-059', 'Fresh Kale selected for cooking, salads, and everyday produce use.', 'Fresh Kale from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'bunch', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Kale', 'Fresh Kale selected for cooking, salads, and everyday produce use.', '/uploads/Products/59.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(317, 'Kiwi Fruits', 'kiwi-fruits-060', 'PL-060', 'Fresh Kiwi Fruits selected for sweetness, color, and daily retail display.', 'Fresh Kiwi Fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 18000.00, NULL, NULL, 97, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 3, 0, 'Kiwi Fruits', 'Fresh Kiwi Fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/60.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-08 02:02:43', NULL),
(318, 'Leeks', 'leeks-061', 'PL-061', 'Fresh Leeks selected for cooking, salads, and everyday produce use.', 'Fresh Leeks from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Leeks', 'Fresh Leeks selected for cooking, salads, and everyday produce use.', '/uploads/Products/61.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(319, 'Lemon Fruits', 'lemon-fruits-062', 'PL-062', 'Fresh Lemon Fruits selected for sweetness, color, and daily retail display.', 'Fresh Lemon Fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lemon Fruits', 'Fresh Lemon Fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/62.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(320, 'Lemon grass', 'lemon-grass-063', 'PL-063', 'Fresh Lemon grass with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Lemon grass from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Lemon grass', 'Fresh Lemon grass with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/63.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(321, 'Lime fruits', 'lime-fruits-064', 'PL-064', 'Fresh Lime fruits selected for sweetness, color, and daily retail display.', 'Fresh Lime fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 5000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lime fruits', 'Fresh Lime fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/64.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(322, 'Local nuts(Ubunyobwa budaseye)', 'local-nuts-ubunyobwa-budaseye-065', 'PL-065', 'Quality Local nuts(Ubunyobwa budaseye) prepared for snacking, sauces, and pantry use.', 'Quality Local nuts(Ubunyobwa budaseye) from the current price list, prepared for storefront sale and suitable for pantry use, sauces, and snacking.', 4000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Local nuts(Ubunyobwa budaseye)', 'Quality Local nuts(Ubunyobwa budaseye) prepared for snacking, sauces, and pantry use.', '/uploads/Products/65.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(323, 'Lettuce Local', 'lettuce-local-066', 'PL-066', 'Fresh Lettuce Local selected for cooking, salads, and everyday produce use.', 'Fresh Lettuce Local from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lettuce Local', 'Fresh Lettuce Local selected for cooking, salads, and everyday produce use.', '/uploads/Products/66.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(324, 'Lettuce icerbeg', 'lettuce-icerbeg-067', 'PL-067', 'Fresh Lettuce icerbeg selected for cooking, salads, and everyday produce use.', 'Fresh Lettuce icerbeg from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lettuce icerbeg', 'Fresh Lettuce icerbeg selected for cooking, salads, and everyday produce use.', '/uploads/Products/67.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(325, 'Lettuce frisee', 'lettuce-frisee-068', 'PL-068', 'Fresh Lettuce frisee selected for cooking, salads, and everyday produce use.', 'Fresh Lettuce frisee from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Lettuce frisee', 'Fresh Lettuce frisee selected for cooking, salads, and everyday produce use.', '/uploads/Products/68.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(326, 'Lettuce red', 'lettuce-red-069', 'PL-069', 'Fresh Lettuce red selected for cooking, salads, and everyday produce use.', 'Fresh Lettuce red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lettuce red', 'Fresh Lettuce red selected for cooking, salads, and everyday produce use.', '/uploads/Products/69.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(327, 'Lettuce mixed', 'lettuce-mixed-070', 'PL-070', 'Fresh Lettuce mixed selected for cooking, salads, and everyday produce use.', 'Fresh Lettuce mixed from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Lettuce mixed', 'Fresh Lettuce mixed selected for cooking, salads, and everyday produce use.', '/uploads/Products/70.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(328, 'Maize fresh(Fresh corn)', 'maize-fresh-fresh-corn-071', 'PL-071', 'Fresh Maize fresh(Fresh corn) suitable for boiling, frying, roasting, or staple meals.', 'Fresh Maize fresh(Fresh corn) from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Maize fresh(Fresh corn)', 'Fresh Maize fresh(Fresh corn) suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/71.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(329, 'Mango fruits', 'mango-fruits-072', 'PL-072', 'Fresh Mango fruits selected for sweetness, color, and daily retail display.', 'Fresh Mango fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 3500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Mango fruits', 'Fresh Mango fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/72.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(330, 'Mint leaves', 'mint-leaves-073', 'PL-073', 'Fresh Mint leaves with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Mint leaves from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Mint leaves', 'Fresh Mint leaves with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/73.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(331, 'Okra import', 'okra-import-074', 'PL-074', 'Fresh Okra import selected for cooking, salads, and everyday produce use.', 'Fresh Okra import from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Okra import', 'Fresh Okra import selected for cooking, salads, and everyday produce use.', '/uploads/Products/74.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(332, 'Onion red', 'onion-red-075', 'PL-075', 'Fresh Onion red selected for cooking, salads, and everyday produce use.', 'Fresh Onion red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 99, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 1, 1, 'Onion red', 'Fresh Onion red selected for cooking, salads, and everyday produce use.', '/uploads/Products/75.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-07 18:55:07', NULL),
(333, 'Onion white', 'onion-white-076', 'PL-076', 'Fresh Onion white selected for cooking, salads, and everyday produce use.', 'Fresh Onion white from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Onion white', 'Fresh Onion white selected for cooking, salads, and everyday produce use.', '/uploads/Products/76.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(334, 'Orange fruits import', 'orange-fruits-import-077', 'PL-077', 'Fresh Orange fruits import selected for sweetness, color, and daily retail display.', 'Fresh Orange fruits import from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 4500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Orange fruits import', 'Fresh Orange fruits import selected for sweetness, color, and daily retail display.', '/uploads/Products/77.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(335, 'Orange local', 'orange-local-078', 'PL-078', 'Fresh Orange local selected for sweetness, color, and daily retail display.', 'Fresh Orange local from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Orange local', 'Fresh Orange local selected for sweetness, color, and daily retail display.', '/uploads/Products/78.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(336, 'Orange sweet potato', 'orange-sweet-potato-079', 'PL-079', 'Fresh Orange sweet potato suitable for boiling, frying, roasting, or staple meals.', 'Fresh Orange sweet potato from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Orange sweet potato', 'Fresh Orange sweet potato suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/79.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(337, 'Parsley', 'parsley-080', 'PL-080', 'Fresh Parsley with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Parsley from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Parsley', 'Fresh Parsley with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/80.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(338, 'Parsnip', 'parsnip-081', 'PL-081', 'Fresh Parsnip selected for cooking, salads, and everyday produce use.', 'Fresh Parsnip from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 5000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Parsnip', 'Fresh Parsnip selected for cooking, salads, and everyday produce use.', '/uploads/Products/81.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(339, 'Passion fruits', 'passion-fruits-082', 'PL-082', 'Fresh Passion fruits selected for sweetness, color, and daily retail display.', 'Fresh Passion fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 2400.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Passion fruits', 'Fresh Passion fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/82.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(340, 'Papaya green', 'papaya-green-083', 'PL-083', 'Fresh Papaya green selected for sweetness, color, and daily retail display.', 'Fresh Papaya green from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 1500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Papaya green', 'Fresh Papaya green selected for sweetness, color, and daily retail display.', '/uploads/Products/83.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL);
INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `short_description`, `description`, `price`, `discount_price`, `cost_price`, `stock_quantity`, `low_stock_threshold`, `weight`, `weight_unit`, `brand`, `status`, `product_condition`, `featured_product`, `best_seller`, `new_arrival`, `is_searchable`, `auto_hide_when_out_of_stock`, `visibility`, `average_rating`, `total_reviews`, `total_sales`, `view_count`, `meta_title`, `meta_description`, `og_image_url`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(341, 'Papaya yellow', 'papaya-yellow-084', 'PL-084', 'Fresh Papaya yellow selected for sweetness, color, and daily retail display.', 'Fresh Papaya yellow from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Papaya yellow', 'Fresh Papaya yellow selected for sweetness, color, and daily retail display.', '/uploads/Products/84.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(342, 'Pineapple', 'pineapple-085', 'PL-085', 'Fresh Pineapple selected for sweetness, color, and daily retail display.', 'Fresh Pineapple from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 800.00, NULL, NULL, 97, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 3, 0, 'Pineapple', 'Fresh Pineapple selected for sweetness, color, and daily retail display.', '/uploads/Products/85.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-08 02:02:43', NULL),
(343, 'Pineapple baby', 'pineapple-baby-086', 'PL-086', 'Fresh Pineapple baby selected for sweetness, color, and daily retail display.', 'Fresh Pineapple baby from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Pineapple baby', 'Fresh Pineapple baby selected for sweetness, color, and daily retail display.', '/uploads/Products/86.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(344, 'Pumpkin', 'pumpkin-087', 'PL-087', 'Fresh Pumpkin selected for cooking, salads, and everyday produce use.', 'Fresh Pumpkin from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 600.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Pumpkin', 'Fresh Pumpkin selected for cooking, salads, and everyday produce use.', '/uploads/Products/87.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(345, 'Pome gram mate', 'pome-gram-mate-088', 'PL-088', 'Fresh Pome gram mate selected for sweetness, color, and daily retail display.', 'Fresh Pome gram mate from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 20000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Pome gram mate', 'Fresh Pome gram mate selected for sweetness, color, and daily retail display.', '/uploads/Products/88.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(346, 'Red radish', 'red-radish-089', 'PL-089', 'Fresh Red radish selected for cooking, salads, and everyday produce use.', 'Fresh Red radish from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Red radish', 'Fresh Red radish selected for cooking, salads, and everyday produce use.', '/uploads/Products/89.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(347, 'Rocket Salades', 'rocket-salades-090', 'PL-090', 'Fresh Rocket Salades selected for cooking, salads, and everyday produce use.', 'Fresh Rocket Salades from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Rocket Salades', 'Fresh Rocket Salades selected for cooking, salads, and everyday produce use.', '/uploads/Products/90.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(348, 'Romaine Lettuce', 'romaine-lettuce-091', 'PL-091', 'Fresh Romaine Lettuce selected for cooking, salads, and everyday produce use.', 'Fresh Romaine Lettuce from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Romaine Lettuce', 'Fresh Romaine Lettuce selected for cooking, salads, and everyday produce use.', '/uploads/Products/91.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(349, 'Romaine lettuce red', 'romaine-lettuce-red-092', 'PL-092', 'Fresh Romaine lettuce red selected for cooking, salads, and everyday produce use.', 'Fresh Romaine lettuce red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Romaine lettuce red', 'Fresh Romaine lettuce red selected for cooking, salads, and everyday produce use.', '/uploads/Products/92.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(350, 'Rosemary', 'rosemary-093', 'PL-093', 'Fresh Rosemary with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Rosemary from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Rosemary', 'Fresh Rosemary with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/93.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(351, 'Snow peas', 'snow-peas-094', 'PL-094', 'Quality Snow peas suited for soups, stews, and daily kitchen use.', 'Quality Snow peas from the current price list, prepared for storefront sale and suitable for soups, stews, and staple meals.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Snow peas', 'Quality Snow peas suited for soups, stews, and daily kitchen use.', '/uploads/Products/94.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(352, 'Spinach', 'spinach-095', 'PL-095', 'Fresh Spinach selected for cooking, salads, and everyday produce use.', 'Fresh Spinach from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Spinach', 'Fresh Spinach selected for cooking, salads, and everyday produce use.', '/uploads/Products/95.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(353, 'Spring Onion', 'spring-onion-096', 'PL-096', 'Fresh Spring Onion selected for cooking, salads, and everyday produce use.', 'Fresh Spring Onion from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Spring Onion', 'Fresh Spring Onion selected for cooking, salads, and everyday produce use.', '/uploads/Products/96.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(354, 'Strawberry import', 'strawberry-import-097', 'PL-097', 'Fresh Strawberry import selected for sweetness, color, and daily retail display.', 'Fresh Strawberry import from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 12000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Strawberry import', 'Fresh Strawberry import selected for sweetness, color, and daily retail display.', '/uploads/Products/97.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(355, 'Sugar cane', 'sugar-cane-099', 'PL-099', 'Quality Sugar cane prepared for everyday household and kitchen use.', 'Quality Sugar cane from the current price list, prepared for storefront sale and everyday kitchen use.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Sugar cane', 'Quality Sugar cane prepared for everyday household and kitchen use.', '/uploads/Products/99.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(356, 'Sugar cane with leaves', 'sugar-cane-with-leaves-100', 'PL-100', 'Quality Sugar cane with leaves prepared for everyday household and kitchen use.', 'Quality Sugar cane with leaves from the current price list, prepared for storefront sale and everyday kitchen use.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Sugar cane with leaves', 'Quality Sugar cane with leaves prepared for everyday household and kitchen use.', '/uploads/Products/100.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(357, 'Sukumawiki', 'sukumawiki-101', 'PL-101', 'Fresh Sukumawiki selected for cooking, salads, and everyday produce use.', 'Fresh Sukumawiki from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Sukumawiki', 'Fresh Sukumawiki selected for cooking, salads, and everyday produce use.', '/uploads/Products/101.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(358, 'Tangerine import', 'tangerine-import-102', 'PL-102', 'Fresh Tangerine import selected for sweetness, color, and daily retail display.', 'Fresh Tangerine import from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 9000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Tangerine import', 'Fresh Tangerine import selected for sweetness, color, and daily retail display.', '/uploads/Products/102.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(359, 'Tangerine local', 'tangerine-local-102-2', 'PL-102-2', 'Fresh Tangerine local selected for sweetness, color, and daily retail display.', 'Fresh Tangerine local from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Tangerine local', 'Fresh Tangerine local selected for sweetness, color, and daily retail display.', '/uploads/Products/102b.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(360, 'Thyme', 'thyme-103', 'PL-103', 'Fresh Thyme with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Thyme from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 1500.00, NULL, NULL, 99, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 1, 0, 'Thyme', 'Fresh Thyme with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/103.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-08 02:17:37', NULL),
(361, 'Tomato fresh local', 'tomato-fresh-local-104', 'PL-104', 'Fresh Tomato fresh local selected for cooking, salads, and everyday produce use.', 'Fresh Tomato fresh local from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1200.00, NULL, NULL, 99, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 1, 1, 'Tomato fresh local', 'Fresh Tomato fresh local selected for cooking, salads, and everyday produce use.', '/uploads/Products/104.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-07 17:18:08', NULL),
(362, 'Tomato green house', 'tomato-green-house-105', 'PL-105', 'Fresh Tomato green house selected for cooking, salads, and everyday produce use.', 'Fresh Tomato green house from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 1300.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Tomato green house', 'Fresh Tomato green house selected for cooking, salads, and everyday produce use.', '/uploads/Products/105.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(363, 'Tree tomato', 'tree-tomato-105-2', 'PL-105-2', 'Fresh Tree tomato selected for sweetness, color, and daily retail display.', 'Fresh Tree tomato from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Tree tomato', 'Fresh Tree tomato selected for sweetness, color, and daily retail display.', '/uploads/Products/105b.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(364, 'Water melon', 'water-melon-106', 'PL-106', 'Fresh Water melon selected for sweetness, color, and daily retail display.', 'Fresh Water melon from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 800.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 1, 1, 0, 'public', 0.00, 0, 0, 1, 'Water melon', 'Fresh Water melon selected for sweetness, color, and daily retail display.', '/uploads/Products/106.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-07 17:16:22', NULL),
(365, 'Yellow lemon', 'yellow-lemon-107', 'PL-107', 'Fresh Yellow lemon selected for sweetness, color, and daily retail display.', 'Fresh Yellow lemon from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 6000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Yellow lemon', 'Fresh Yellow lemon selected for sweetness, color, and daily retail display.', '/uploads/Products/107.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(366, 'Yellow passion', 'yellow-passion-108', 'PL-108', 'Fresh Yellow passion selected for sweetness, color, and daily retail display.', 'Fresh Yellow passion from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 2000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Yellow passion', 'Fresh Yellow passion selected for sweetness, color, and daily retail display.', '/uploads/Products/108.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(367, 'Sweet potato', 'sweet-potato-109', 'PL-109', 'Fresh Sweet potato suitable for boiling, frying, roasting, or staple meals.', 'Fresh Sweet potato from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Sweet potato', 'Fresh Sweet potato suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/109.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(368, 'Sweet potato yellow', 'sweet-potato-yellow-110', 'PL-110', 'Fresh Sweet potato yellow suitable for boiling, frying, roasting, or staple meals.', 'Fresh Sweet potato yellow from the current price list, prepared for storefront sale and suitable for boiling, frying, roasting, or staple dishes.', 700.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Sweet potato yellow', 'Fresh Sweet potato yellow suitable for boiling, frying, roasting, or staple meals.', '/uploads/Products/110.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(369, 'Oyster mushroom', 'oyster-mushroom-111', 'PL-111', 'Fresh Oyster mushroom selected for cooking, salads, and everyday produce use.', 'Fresh Oyster mushroom from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3500.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Oyster mushroom', 'Fresh Oyster mushroom selected for cooking, salads, and everyday produce use.', '/uploads/Products/111.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(370, 'Pears red', 'pears-red-112', 'PL-112', 'Fresh Pears red selected for sweetness, color, and daily retail display.', 'Fresh Pears red from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 15000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Pears red', 'Fresh Pears red selected for sweetness, color, and daily retail display.', '/uploads/Products/112.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(371, 'Pilipili red', 'pilipili-red-113', 'PL-113', 'Fresh Pilipili red selected for cooking, salads, and everyday produce use.', 'Fresh Pilipili red from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Pilipili red', 'Fresh Pilipili red selected for cooking, salads, and everyday produce use.', '/uploads/Products/113.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:51', NULL),
(372, 'Pilipili yellow', 'pilipili-yellow-114', 'PL-114', 'Fresh Pilipili yellow selected for cooking, salads, and everyday produce use.', 'Fresh Pilipili yellow from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Pilipili yellow', 'Fresh Pilipili yellow selected for cooking, salads, and everyday produce use.', '/uploads/Products/114.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(373, 'Plums red import', 'plums-red-import-115', 'PL-115', 'Fresh Plums red import selected for sweetness, color, and daily retail display.', 'Fresh Plums red import from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 18000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Plums red import', 'Fresh Plums red import selected for sweetness, color, and daily retail display.', '/uploads/Products/115.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(374, 'Peach', 'peach-116', 'PL-116', 'Fresh Peach selected for sweetness, color, and daily retail display.', 'Fresh Peach from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 17000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Peach', 'Fresh Peach selected for sweetness, color, and daily retail display.', '/uploads/Products/116.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(375, 'Ras berry', 'ras-berry-117', 'PL-117', 'Fresh Ras berry selected for sweetness, color, and daily retail display.', 'Fresh Ras berry from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 10000.00, NULL, NULL, 100, 5, NULL, 'box', NULL, 'active', 'new', 0, 0, 1, 1, 0, 'public', 0.00, 0, 0, 0, 'Ras berry', 'Fresh Ras berry selected for sweetness, color, and daily retail display.', '/uploads/Products/117.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(376, 'Black berry', 'black-berry-118', 'PL-118', 'Fresh Black berry selected for sweetness, color, and daily retail display.', 'Fresh Black berry from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 15000.00, NULL, NULL, 100, 5, NULL, 'box', NULL, 'active', 'new', 0, 0, 0, 0, 0, 'public', 0.00, 0, 0, 0, 'Black berry', 'Fresh Black berry selected for sweetness, color, and daily retail display.', '/uploads/Products/118.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(377, 'Black grapes', 'black-grapes-119', 'PL-119', 'Fresh Black grapes selected for sweetness, color, and daily retail display.', 'Fresh Black grapes from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 18000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 1, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Black grapes', 'Fresh Black grapes selected for sweetness, color, and daily retail display.', '/uploads/Products/119.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(378, 'Sage herb', 'sage-herb-120', 'PL-120', 'Fresh Sage herb with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Sage herb from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 2000.00, NULL, NULL, 100, 5, NULL, 'bunch', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Sage herb', 'Fresh Sage herb with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/120.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(379, 'Sweet melon', 'sweet-melon-121', 'PL-121', 'Fresh Sweet melon selected for sweetness, color, and daily retail display.', 'Fresh Sweet melon from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 6000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Sweet melon', 'Fresh Sweet melon selected for sweetness, color, and daily retail display.', '/uploads/Products/121.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(380, 'Jake fruits', 'jake-fruits-122', 'PL-122', 'Fresh Jake fruits selected for sweetness, color, and daily retail display.', 'Fresh Jake fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 3000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 1, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Jake fruits', 'Fresh Jake fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/122.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:35', NULL),
(381, 'Shallot onion', 'shallot-onion-123', 'PL-123', 'Fresh Shallot onion selected for cooking, salads, and everyday produce use.', 'Fresh Shallot onion from the current price list, prepared for storefront sale with reliable produce quality for cooking and display.', 2500.00, NULL, NULL, 99, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 1, 0, 'Shallot onion', 'Fresh Shallot onion selected for cooking, salads, and everyday produce use.', '/uploads/Products/123.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-06-10 15:46:00', NULL),
(382, 'Whole garlic', 'whole-garlic-124', 'PL-124', 'Fresh Whole garlic with clean aroma, ideal for seasoning and kitchen prep.', 'Fresh Whole garlic from the current price list, prepared for storefront sale with clean aroma and practical kitchen use in daily cooking.', 4000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Whole garlic', 'Fresh Whole garlic with clean aroma, ideal for seasoning and kitchen prep.', '/uploads/Products/124.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL),
(383, 'Grape fruits', 'grape-fruits-125', 'PL-125', 'Fresh Grape fruits selected for sweetness, color, and daily retail display.', 'Fresh Grape fruits from the current price list, prepared for storefront sale with a clean produce presentation and everyday customer use.', 16000.00, NULL, NULL, 100, 5, NULL, 'kg', NULL, 'active', 'new', 0, 0, 0, 1, 0, 'public', 0.00, 0, 0, 0, 'Grape fruits', 'Fresh Grape fruits selected for sweetness, color, and daily retail display.', '/uploads/Products/125.png', '2026-05-13 00:46:28', 1, 1, '2026-05-12 22:46:28', '2026-05-14 08:48:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `product_id`, `category_id`, `subcategory_id`, `is_primary`, `created_at`) VALUES
(42, 201, 101, NULL, 1, '2026-05-07 14:33:16'),
(43, 202, 101, NULL, 1, '2026-05-07 14:33:16'),
(44, 203, 101, NULL, 1, '2026-05-07 14:33:16'),
(45, 204, 101, NULL, 1, '2026-05-07 14:33:16'),
(46, 205, 102, NULL, 1, '2026-05-07 14:33:16'),
(47, 206, 102, NULL, 1, '2026-05-07 14:33:16'),
(48, 207, 102, NULL, 1, '2026-05-07 14:33:16'),
(49, 208, 102, NULL, 1, '2026-05-07 14:33:16'),
(70, 229, 108, NULL, 1, '2026-05-07 14:33:16'),
(71, 230, 108, NULL, 1, '2026-05-07 14:33:16'),
(72, 231, 108, NULL, 1, '2026-05-07 14:33:16'),
(73, 232, 108, NULL, 1, '2026-05-07 14:33:16'),
(74, 233, 109, NULL, 1, '2026-05-07 14:33:16'),
(75, 234, 109, NULL, 1, '2026-05-07 14:33:16'),
(76, 235, 109, NULL, 1, '2026-05-07 14:33:16'),
(77, 236, 109, NULL, 1, '2026-05-07 14:33:16'),
(78, 237, 110, NULL, 1, '2026-05-07 14:33:16'),
(79, 238, 110, NULL, 1, '2026-05-07 14:33:16'),
(80, 239, 110, NULL, 1, '2026-05-07 14:33:16'),
(81, 240, 110, NULL, 1, '2026-05-07 14:33:16'),
(82, 2, 111, NULL, 1, '2026-05-12 21:43:33'),
(83, 256, 111, NULL, 1, '2026-05-12 22:46:28'),
(84, 257, 9991, NULL, 1, '2026-05-12 22:46:28'),
(85, 258, 101, NULL, 1, '2026-05-12 22:46:28'),
(88, 261, 102, NULL, 1, '2026-05-12 22:46:28'),
(89, 262, 102, NULL, 1, '2026-05-12 22:46:28'),
(90, 263, 101, NULL, 1, '2026-05-12 22:46:28'),
(91, 264, 101, NULL, 1, '2026-05-12 22:46:28'),
(92, 265, 9991, NULL, 1, '2026-05-12 22:46:28'),
(93, 266, 102, NULL, 1, '2026-05-12 22:46:28'),
(94, 267, 102, NULL, 1, '2026-05-12 22:46:28'),
(95, 268, 111, NULL, 1, '2026-05-12 22:46:28'),
(96, 269, 109, NULL, 1, '2026-05-12 22:46:28'),
(97, 270, 108, NULL, 1, '2026-05-12 22:46:28'),
(98, 271, 108, NULL, 1, '2026-05-12 22:46:28'),
(99, 272, 108, NULL, 1, '2026-05-12 22:46:28'),
(100, 273, 108, NULL, 1, '2026-05-12 22:46:28'),
(101, 274, 101, NULL, 1, '2026-05-12 22:46:28'),
(102, 275, 101, NULL, 1, '2026-05-12 22:46:28'),
(103, 276, 101, NULL, 1, '2026-05-12 22:46:28'),
(104, 277, 101, NULL, 1, '2026-05-12 22:46:28'),
(105, 278, 101, NULL, 1, '2026-05-12 22:46:28'),
(106, 279, 101, NULL, 1, '2026-05-12 22:46:28'),
(107, 280, 101, NULL, 1, '2026-05-12 22:46:28'),
(108, 281, 101, NULL, 1, '2026-05-12 22:46:28'),
(109, 282, 101, NULL, 1, '2026-05-12 22:46:28'),
(110, 283, 101, NULL, 1, '2026-05-12 22:46:28'),
(111, 284, 101, NULL, 1, '2026-05-12 22:46:28'),
(112, 285, 9991, NULL, 1, '2026-05-12 22:46:28'),
(113, 286, 9991, NULL, 1, '2026-05-12 22:46:28'),
(114, 287, 101, NULL, 1, '2026-05-12 22:46:28'),
(115, 288, 101, NULL, 1, '2026-05-12 22:46:28'),
(116, 289, 101, NULL, 1, '2026-05-12 22:46:28'),
(117, 290, 101, NULL, 1, '2026-05-12 22:46:28'),
(118, 291, 101, NULL, 1, '2026-05-12 22:46:28'),
(119, 292, 101, NULL, 1, '2026-05-12 22:46:28'),
(120, 293, 101, NULL, 1, '2026-05-12 22:46:28'),
(121, 294, 109, NULL, 1, '2026-05-12 22:46:28'),
(122, 295, 109, NULL, 1, '2026-05-12 22:46:28'),
(123, 296, 101, NULL, 1, '2026-05-12 22:46:28'),
(124, 297, 109, NULL, 1, '2026-05-12 22:46:28'),
(125, 298, 101, NULL, 1, '2026-05-12 22:46:28'),
(126, 299, 101, NULL, 1, '2026-05-12 22:46:28'),
(127, 300, 109, NULL, 1, '2026-05-12 22:46:28'),
(128, 301, 108, NULL, 1, '2026-05-12 22:46:28'),
(129, 302, 109, NULL, 1, '2026-05-12 22:46:28'),
(130, 303, 108, NULL, 1, '2026-05-12 22:46:28'),
(131, 304, 109, NULL, 1, '2026-05-12 22:46:28'),
(132, 305, 109, NULL, 1, '2026-05-12 22:46:28'),
(133, 306, 102, NULL, 1, '2026-05-12 22:46:28'),
(134, 307, 102, NULL, 1, '2026-05-12 22:46:28'),
(135, 308, 102, NULL, 1, '2026-05-12 22:46:28'),
(136, 309, 101, NULL, 1, '2026-05-12 22:46:28'),
(137, 310, 110, NULL, 1, '2026-05-12 22:46:28'),
(138, 311, 102, NULL, 1, '2026-05-12 22:46:28'),
(139, 312, 9991, NULL, 1, '2026-05-12 22:46:28'),
(140, 313, 101, NULL, 1, '2026-05-12 22:46:28'),
(141, 314, 9991, NULL, 1, '2026-05-12 22:46:28'),
(142, 315, 101, NULL, 1, '2026-05-12 22:46:28'),
(143, 316, 101, NULL, 1, '2026-05-12 22:46:28'),
(144, 317, 102, NULL, 1, '2026-05-12 22:46:28'),
(145, 318, 101, NULL, 1, '2026-05-12 22:46:28'),
(146, 319, 102, NULL, 1, '2026-05-12 22:46:28'),
(147, 320, 109, NULL, 1, '2026-05-12 22:46:28'),
(148, 321, 102, NULL, 1, '2026-05-12 22:46:28'),
(149, 322, 110, NULL, 1, '2026-05-12 22:46:28'),
(150, 323, 101, NULL, 1, '2026-05-12 22:46:28'),
(151, 324, 101, NULL, 1, '2026-05-12 22:46:28'),
(152, 325, 101, NULL, 1, '2026-05-12 22:46:28'),
(153, 326, 101, NULL, 1, '2026-05-12 22:46:28'),
(154, 327, 101, NULL, 1, '2026-05-12 22:46:28'),
(155, 328, 9991, NULL, 1, '2026-05-12 22:46:28'),
(156, 329, 102, NULL, 1, '2026-05-12 22:46:28'),
(157, 330, 109, NULL, 1, '2026-05-12 22:46:28'),
(158, 331, 101, NULL, 1, '2026-05-12 22:46:28'),
(159, 332, 101, NULL, 1, '2026-05-12 22:46:28'),
(160, 333, 101, NULL, 1, '2026-05-12 22:46:28'),
(161, 334, 102, NULL, 1, '2026-05-12 22:46:28'),
(162, 335, 102, NULL, 1, '2026-05-12 22:46:28'),
(163, 336, 9991, NULL, 1, '2026-05-12 22:46:28'),
(164, 337, 109, NULL, 1, '2026-05-12 22:46:28'),
(165, 338, 101, NULL, 1, '2026-05-12 22:46:28'),
(166, 339, 102, NULL, 1, '2026-05-12 22:46:28'),
(167, 340, 102, NULL, 1, '2026-05-12 22:46:28'),
(168, 341, 102, NULL, 1, '2026-05-12 22:46:28'),
(169, 342, 102, NULL, 1, '2026-05-12 22:46:28'),
(170, 343, 102, NULL, 1, '2026-05-12 22:46:28'),
(171, 344, 101, NULL, 1, '2026-05-12 22:46:28'),
(172, 345, 102, NULL, 1, '2026-05-12 22:46:28'),
(173, 346, 101, NULL, 1, '2026-05-12 22:46:28'),
(174, 347, 101, NULL, 1, '2026-05-12 22:46:28'),
(175, 348, 101, NULL, 1, '2026-05-12 22:46:28'),
(176, 349, 101, NULL, 1, '2026-05-12 22:46:28'),
(177, 350, 109, NULL, 1, '2026-05-12 22:46:28'),
(178, 351, 108, NULL, 1, '2026-05-12 22:46:28'),
(179, 352, 101, NULL, 1, '2026-05-12 22:46:28'),
(180, 353, 101, NULL, 1, '2026-05-12 22:46:28'),
(181, 354, 102, NULL, 1, '2026-05-12 22:46:28'),
(182, 355, 111, NULL, 1, '2026-05-12 22:46:28'),
(183, 356, 111, NULL, 1, '2026-05-12 22:46:28'),
(184, 357, 101, NULL, 1, '2026-05-12 22:46:28'),
(185, 358, 102, NULL, 1, '2026-05-12 22:46:28'),
(186, 359, 102, NULL, 1, '2026-05-12 22:46:28'),
(187, 360, 109, NULL, 1, '2026-05-12 22:46:28'),
(188, 361, 101, NULL, 1, '2026-05-12 22:46:28'),
(189, 362, 101, NULL, 1, '2026-05-12 22:46:28'),
(190, 363, 102, NULL, 1, '2026-05-12 22:46:28'),
(191, 364, 102, NULL, 1, '2026-05-12 22:46:28'),
(192, 365, 102, NULL, 1, '2026-05-12 22:46:28'),
(193, 366, 102, NULL, 1, '2026-05-12 22:46:28'),
(194, 367, 9991, NULL, 1, '2026-05-12 22:46:28'),
(195, 368, 9991, NULL, 1, '2026-05-12 22:46:28'),
(196, 369, 101, NULL, 1, '2026-05-12 22:46:28'),
(197, 370, 102, NULL, 1, '2026-05-12 22:46:28'),
(198, 371, 101, NULL, 1, '2026-05-12 22:46:28'),
(199, 372, 101, NULL, 1, '2026-05-12 22:46:28'),
(200, 373, 102, NULL, 1, '2026-05-12 22:46:28'),
(201, 374, 102, NULL, 1, '2026-05-12 22:46:28'),
(202, 375, 102, NULL, 1, '2026-05-12 22:46:28'),
(203, 376, 102, NULL, 1, '2026-05-12 22:46:28'),
(204, 377, 102, NULL, 1, '2026-05-12 22:46:28'),
(205, 378, 109, NULL, 1, '2026-05-12 22:46:28'),
(206, 379, 102, NULL, 1, '2026-05-12 22:46:28'),
(207, 380, 102, NULL, 1, '2026-05-12 22:46:28'),
(208, 381, 101, NULL, 1, '2026-05-12 22:46:28'),
(209, 382, 109, NULL, 1, '2026-05-12 22:46:28'),
(210, 383, 102, NULL, 1, '2026-05-12 22:46:28'),
(211, 259, 102, NULL, 1, '2026-05-14 08:46:03'),
(212, 260, 102, NULL, 1, '2026-05-14 08:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `product_filters`
--

CREATE TABLE `product_filters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `filter_option_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `sort_order`, `is_primary`, `created_at`) VALUES
(1, 256, '/uploads/Products/1.png', 'Amamesa(palm oil)', 0, 1, '2026-05-12 22:46:28'),
(2, 257, '/uploads/Products/2.png', 'Amateke(Arrow roots)', 0, 1, '2026-05-12 22:46:28'),
(3, 258, '/uploads/Products/3.png', 'Endive lettuce', 0, 1, '2026-05-12 22:46:28'),
(6, 261, '/uploads/Products/6.png', 'Avocado', 0, 1, '2026-05-12 22:46:28'),
(7, 262, '/uploads/Products/7.png', 'Baby Banana', 0, 1, '2026-05-12 22:46:28'),
(8, 263, '/uploads/Products/8.png', 'Baby carrot', 0, 1, '2026-05-12 22:46:28'),
(9, 264, '/uploads/Products/9.png', 'Baby Marrow', 0, 1, '2026-05-12 22:46:28'),
(10, 265, '/uploads/Products/10.png', 'Baby Potatoes', 0, 1, '2026-05-12 22:46:28'),
(11, 266, '/uploads/Products/11.png', 'Banana big(Gromishel)', 0, 1, '2026-05-12 22:46:28'),
(12, 267, '/uploads/Products/12.png', 'Banana green', 0, 1, '2026-05-12 22:46:28'),
(13, 268, '/uploads/Products/13.png', 'Banana leaves', 0, 1, '2026-05-12 22:46:28'),
(14, 269, '/uploads/Products/14.png', 'Basil', 0, 1, '2026-05-12 22:46:28'),
(15, 270, '/uploads/Products/15.png', 'Fresh Beans(Ibitonore)', 0, 1, '2026-05-12 22:46:28'),
(16, 271, '/uploads/Products/16.png', 'Beans long yellow', 0, 1, '2026-05-12 22:46:28'),
(17, 272, '/uploads/Products/17.png', 'Beans white', 0, 1, '2026-05-12 22:46:28'),
(18, 273, '/uploads/Products/18.png', 'Beans red', 0, 1, '2026-05-12 22:46:28'),
(19, 274, '/uploads/Products/19.png', 'Beet root', 0, 1, '2026-05-12 22:46:28'),
(20, 275, '/uploads/Products/20.png', 'Bell pepper yellow', 0, 1, '2026-05-12 22:46:28'),
(21, 276, '/uploads/Products/21.png', 'Bell pepper red', 0, 1, '2026-05-12 22:46:28'),
(22, 277, '/uploads/Products/22.png', 'Bok choy', 0, 1, '2026-05-12 22:46:28'),
(23, 278, '/uploads/Products/23.png', 'Broccoli', 0, 1, '2026-05-12 22:46:28'),
(24, 279, '/uploads/Products/23b.png', 'Broccoli trimmed(zikase)', 0, 1, '2026-05-12 22:46:28'),
(25, 280, '/uploads/Products/24.png', 'Butter nut', 0, 1, '2026-05-12 22:46:28'),
(26, 281, '/uploads/Products/25.png', 'Cabbage red', 0, 1, '2026-05-12 22:46:28'),
(27, 282, '/uploads/Products/26.png', 'Cabbage White', 0, 1, '2026-05-12 22:46:28'),
(28, 283, '/uploads/Products/27.png', 'Chinese Cabbage', 0, 1, '2026-05-12 22:46:28'),
(29, 284, '/uploads/Products/28.png', 'Carrot local', 0, 1, '2026-05-12 22:46:28'),
(30, 285, '/uploads/Products/29.png', 'Cassava', 0, 1, '2026-05-12 22:46:28'),
(31, 286, '/uploads/Products/30.png', 'Cassava Flour(Ubugali)', 0, 1, '2026-05-12 22:46:28'),
(32, 287, '/uploads/Products/31.png', 'Cauliflower', 0, 1, '2026-05-12 22:46:28'),
(33, 288, '/uploads/Products/31b.png', 'Cauliflower trimmed(Zikase)', 0, 1, '2026-05-12 22:46:28'),
(34, 289, '/uploads/Products/32.png', 'Cerely', 0, 1, '2026-05-12 22:46:28'),
(35, 290, '/uploads/Products/33.png', 'Cherry Tomato', 0, 1, '2026-05-12 22:46:28'),
(36, 291, '/uploads/Products/34.png', 'Cherry tomato with stick', 0, 1, '2026-05-12 22:46:28'),
(37, 292, '/uploads/Products/35.png', 'Chill green', 0, 1, '2026-05-12 22:46:28'),
(38, 293, '/uploads/Products/36.png', 'Chill red', 0, 1, '2026-05-12 22:46:28'),
(39, 294, '/uploads/Products/37.png', 'Chives', 0, 1, '2026-05-12 22:46:28'),
(40, 295, '/uploads/Products/38.png', 'Coriander', 0, 1, '2026-05-12 22:46:28'),
(41, 296, '/uploads/Products/39.png', 'Cucumber', 0, 1, '2026-05-12 22:46:28'),
(42, 297, '/uploads/Products/40.png', 'Dill herb', 0, 1, '2026-05-12 22:46:28'),
(43, 298, '/uploads/Products/41.png', 'Dodo', 0, 1, '2026-05-12 22:46:28'),
(44, 299, '/uploads/Products/42.png', 'Eggplant(Auberigine)', 0, 1, '2026-05-12 22:46:28'),
(45, 300, '/uploads/Products/43.png', 'Fennel', 0, 1, '2026-05-12 22:46:28'),
(46, 301, '/uploads/Products/44.png', 'French Beans', 0, 1, '2026-05-12 22:46:28'),
(47, 302, '/uploads/Products/45.png', 'Flat parsley', 0, 1, '2026-05-12 22:46:28'),
(48, 303, '/uploads/Products/46.png', 'Garden peas', 0, 1, '2026-05-12 22:46:28'),
(49, 304, '/uploads/Products/47.png', 'Garlic Peeled', 0, 1, '2026-05-12 22:46:28'),
(50, 305, '/uploads/Products/48.png', 'Ginger', 0, 1, '2026-05-12 22:46:28'),
(51, 306, '/uploads/Products/49.png', 'Gooseberry', 0, 1, '2026-05-12 22:46:28'),
(52, 307, '/uploads/Products/50.png', 'Grapes red Imported', 0, 1, '2026-05-12 22:46:28'),
(53, 308, '/uploads/Products/51.png', 'Grapes green', 0, 1, '2026-05-12 22:46:28'),
(54, 309, '/uploads/Products/52.png', 'Green Papper', 0, 1, '2026-05-12 22:46:28'),
(55, 310, '/uploads/Products/53.png', 'Groundnut (Ubunyobwa buseye)', 0, 1, '2026-05-12 22:46:28'),
(56, 311, '/uploads/Products/54.png', 'Guava Green', 0, 1, '2026-05-12 22:46:28'),
(57, 312, '/uploads/Products/55.png', 'Imizuzu (banana plantain)', 0, 1, '2026-05-12 22:46:28'),
(58, 313, '/uploads/Products/56.png', 'Intoryi', 0, 1, '2026-05-12 22:46:28'),
(59, 314, '/uploads/Products/57.png', 'Irish Potato', 0, 1, '2026-05-12 22:46:28'),
(60, 315, '/uploads/Products/58.png', 'Isombe', 0, 1, '2026-05-12 22:46:28'),
(61, 316, '/uploads/Products/59.png', 'Kale', 0, 1, '2026-05-12 22:46:28'),
(62, 317, '/uploads/Products/60.png', 'Kiwi Fruits', 0, 1, '2026-05-12 22:46:28'),
(63, 318, '/uploads/Products/61.png', 'Leeks', 0, 1, '2026-05-12 22:46:28'),
(64, 319, '/uploads/Products/62.png', 'Lemon Fruits', 0, 1, '2026-05-12 22:46:28'),
(65, 320, '/uploads/Products/63.png', 'Lemon grass', 0, 1, '2026-05-12 22:46:28'),
(66, 321, '/uploads/Products/64.png', 'Lime fruits', 0, 1, '2026-05-12 22:46:28'),
(67, 322, '/uploads/Products/65.png', 'Local nuts(Ubunyobwa budaseye)', 0, 1, '2026-05-12 22:46:28'),
(68, 323, '/uploads/Products/66.png', 'Lettuce Local', 0, 1, '2026-05-12 22:46:28'),
(69, 324, '/uploads/Products/67.png', 'Lettuce icerbeg', 0, 1, '2026-05-12 22:46:28'),
(70, 325, '/uploads/Products/68.png', 'Lettuce frisee', 0, 1, '2026-05-12 22:46:28'),
(71, 326, '/uploads/Products/69.png', 'Lettuce red', 0, 1, '2026-05-12 22:46:28'),
(72, 327, '/uploads/Products/70.png', 'Lettuce mixed', 0, 1, '2026-05-12 22:46:28'),
(73, 328, '/uploads/Products/71.png', 'Maize fresh(Fresh corn)', 0, 1, '2026-05-12 22:46:28'),
(74, 329, '/uploads/Products/72.png', 'Mango fruits', 0, 1, '2026-05-12 22:46:28'),
(75, 330, '/uploads/Products/73.png', 'Mint leaves', 0, 1, '2026-05-12 22:46:28'),
(76, 331, '/uploads/Products/74.png', 'Okra import', 0, 1, '2026-05-12 22:46:28'),
(77, 332, '/uploads/Products/75.png', 'Onion red', 0, 1, '2026-05-12 22:46:28'),
(78, 333, '/uploads/Products/76.png', 'Onion white', 0, 1, '2026-05-12 22:46:28'),
(79, 334, '/uploads/Products/77.png', 'Orange fruits import', 0, 1, '2026-05-12 22:46:28'),
(80, 335, '/uploads/Products/78.png', 'Orange local', 0, 1, '2026-05-12 22:46:28'),
(81, 336, '/uploads/Products/79.png', 'Orange sweet potato', 0, 1, '2026-05-12 22:46:28'),
(82, 337, '/uploads/Products/80.png', 'Parsley', 0, 1, '2026-05-12 22:46:28'),
(83, 338, '/uploads/Products/81.png', 'Parsnip', 0, 1, '2026-05-12 22:46:28'),
(84, 339, '/uploads/Products/82.png', 'Passion fruits', 0, 1, '2026-05-12 22:46:28'),
(85, 340, '/uploads/Products/83.png', 'Papaya green', 0, 1, '2026-05-12 22:46:28'),
(86, 341, '/uploads/Products/84.png', 'Papaya yellow', 0, 1, '2026-05-12 22:46:28'),
(87, 342, '/uploads/Products/85.png', 'Pineapple', 0, 1, '2026-05-12 22:46:28'),
(88, 343, '/uploads/Products/86.png', 'Pineapple baby', 0, 1, '2026-05-12 22:46:28'),
(89, 344, '/uploads/Products/87.png', 'Pumpkin', 0, 1, '2026-05-12 22:46:28'),
(90, 345, '/uploads/Products/88.png', 'Pome gram mate', 0, 1, '2026-05-12 22:46:28'),
(91, 346, '/uploads/Products/89.png', 'Red radish', 0, 1, '2026-05-12 22:46:28'),
(92, 347, '/uploads/Products/90.png', 'Rocket Salades', 0, 1, '2026-05-12 22:46:28'),
(93, 348, '/uploads/Products/91.png', 'Romaine Lettuce', 0, 1, '2026-05-12 22:46:28'),
(94, 349, '/uploads/Products/92.png', 'Romaine lettuce red', 0, 1, '2026-05-12 22:46:28'),
(95, 350, '/uploads/Products/93.png', 'Rosemary', 0, 1, '2026-05-12 22:46:28'),
(96, 351, '/uploads/Products/94.png', 'Snow peas', 0, 1, '2026-05-12 22:46:28'),
(97, 352, '/uploads/Products/95.png', 'Spinach', 0, 1, '2026-05-12 22:46:28'),
(98, 353, '/uploads/Products/96.png', 'Spring Onion', 0, 1, '2026-05-12 22:46:28'),
(99, 354, '/uploads/Products/97.png', 'Strawberry import', 0, 1, '2026-05-12 22:46:28'),
(100, 355, '/uploads/Products/99.png', 'Sugar cane', 0, 1, '2026-05-12 22:46:28'),
(101, 356, '/uploads/Products/100.png', 'Sugar cane with leaves', 0, 1, '2026-05-12 22:46:28'),
(102, 357, '/uploads/Products/101.png', 'Sukumawiki', 0, 1, '2026-05-12 22:46:28'),
(103, 358, '/uploads/Products/102.png', 'Tangerine import', 0, 1, '2026-05-12 22:46:28'),
(104, 359, '/uploads/Products/102b.png', 'Tangerine local', 0, 1, '2026-05-12 22:46:28'),
(105, 360, '/uploads/Products/103.png', 'Thyme', 0, 1, '2026-05-12 22:46:28'),
(106, 361, '/uploads/Products/104.png', 'Tomato fresh local', 0, 1, '2026-05-12 22:46:28'),
(107, 362, '/uploads/Products/105.png', 'Tomato green house', 0, 1, '2026-05-12 22:46:28'),
(108, 363, '/uploads/Products/105b.png', 'Tree tomato', 0, 1, '2026-05-12 22:46:28'),
(109, 364, '/uploads/Products/106.png', 'Water melon', 0, 1, '2026-05-12 22:46:28'),
(110, 365, '/uploads/Products/107.png', 'Yellow lemon', 0, 1, '2026-05-12 22:46:28'),
(111, 366, '/uploads/Products/108.png', 'Yellow passion', 0, 1, '2026-05-12 22:46:28'),
(112, 367, '/uploads/Products/109.png', 'Sweet potato', 0, 1, '2026-05-12 22:46:28'),
(113, 368, '/uploads/Products/110.png', 'Sweet potato yellow', 0, 1, '2026-05-12 22:46:28'),
(114, 369, '/uploads/Products/111.png', 'Oyster mushroom', 0, 1, '2026-05-12 22:46:28'),
(115, 370, '/uploads/Products/112.png', 'Pears red', 0, 1, '2026-05-12 22:46:28'),
(116, 371, '/uploads/Products/113.png', 'Pilipili red', 0, 1, '2026-05-12 22:46:28'),
(117, 372, '/uploads/Products/114.png', 'Pilipili yellow', 0, 1, '2026-05-12 22:46:28'),
(118, 373, '/uploads/Products/115.png', 'Plums red import', 0, 1, '2026-05-12 22:46:28'),
(119, 374, '/uploads/Products/116.png', 'Peach', 0, 1, '2026-05-12 22:46:28'),
(120, 375, '/uploads/Products/117.png', 'Ras berry', 0, 1, '2026-05-12 22:46:28'),
(121, 376, '/uploads/Products/118.png', 'Black berry', 0, 1, '2026-05-12 22:46:28'),
(122, 377, '/uploads/Products/119.png', 'Black grapes', 0, 1, '2026-05-12 22:46:28'),
(123, 378, '/uploads/Products/120.png', 'Sage herb', 0, 1, '2026-05-12 22:46:28'),
(124, 379, '/uploads/Products/121.png', 'Sweet melon', 0, 1, '2026-05-12 22:46:28'),
(125, 380, '/uploads/Products/122.png', 'Jake fruits', 0, 1, '2026-05-12 22:46:28'),
(126, 381, '/uploads/Products/123.png', 'Shallot onion', 0, 1, '2026-05-12 22:46:28'),
(127, 382, '/uploads/Products/124.png', 'Whole garlic', 0, 1, '2026-05-12 22:46:28'),
(128, 383, '/uploads/Products/125.png', 'Grape fruits', 0, 1, '2026-05-12 22:46:28'),
(129, 259, '/uploads/Products/4.png', 'Apple red', 0, 1, '2026-05-14 08:46:03'),
(130, 260, '/uploads/Products/5.png', 'Apple green', 0, 1, '2026-05-14 08:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `product_tags_map`
--

CREATE TABLE `product_tags_map` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `payment_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `requested_by` enum('customer','admin','system') NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('requested','approved','rejected','processed','failed') NOT NULL DEFAULT 'requested',
  `amount` decimal(14,2) NOT NULL,
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `review_text` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `admin_reply` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_system_role` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `code`, `description`, `is_system_role`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'super_admin', 'Full system access', 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(2, 'Manager', 'manager', 'Overall operational access', 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(3, 'Order Manager', 'order_manager', 'Manages orders and delivery', 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39'),
(4, 'Content Manager', 'content_manager', 'Manages banners, pages, and homepage content', 1, '2026-04-14 16:46:39', '2026-04-14 16:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `allowed` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `allowed`, `created_at`) VALUES
(1, 1, 2, 1, '2026-04-14 16:46:39'),
(2, 1, 24, 1, '2026-04-14 16:46:39'),
(3, 1, 8, 1, '2026-04-14 16:46:39'),
(4, 1, 18, 1, '2026-04-14 16:46:39'),
(5, 1, 14, 1, '2026-04-14 16:46:39'),
(6, 1, 13, 1, '2026-04-14 16:46:39'),
(7, 1, 1, 1, '2026-04-14 16:46:39'),
(8, 1, 16, 1, '2026-04-14 16:46:39'),
(9, 1, 15, 1, '2026-04-14 16:46:39'),
(10, 1, 22, 1, '2026-04-14 16:46:39'),
(11, 1, 23, 1, '2026-04-14 16:46:39'),
(12, 1, 10, 1, '2026-04-14 16:46:39'),
(13, 1, 9, 1, '2026-04-14 16:46:39'),
(14, 1, 12, 1, '2026-04-14 16:46:39'),
(15, 1, 11, 1, '2026-04-14 16:46:39'),
(16, 1, 5, 1, '2026-04-14 16:46:39'),
(17, 1, 7, 1, '2026-04-14 16:46:39'),
(18, 1, 6, 1, '2026-04-14 16:46:39'),
(19, 1, 4, 1, '2026-04-14 16:46:39'),
(20, 1, 17, 1, '2026-04-14 16:46:39'),
(21, 1, 20, 1, '2026-04-14 16:46:39'),
(22, 1, 19, 1, '2026-04-14 16:46:39'),
(23, 1, 3, 1, '2026-04-14 16:46:39'),
(24, 1, 21, 1, '2026-04-14 16:46:39'),
(32, 2, 8, 1, '2026-04-14 16:46:39'),
(33, 2, 18, 1, '2026-04-14 16:46:39'),
(34, 2, 13, 1, '2026-04-14 16:46:39'),
(35, 2, 1, 1, '2026-04-14 16:46:39'),
(36, 2, 16, 1, '2026-04-14 16:46:39'),
(37, 2, 15, 1, '2026-04-14 16:46:39'),
(38, 2, 22, 1, '2026-04-14 16:46:39'),
(39, 2, 23, 1, '2026-04-14 16:46:39'),
(40, 2, 10, 1, '2026-04-14 16:46:39'),
(41, 2, 9, 1, '2026-04-14 16:46:39'),
(42, 2, 11, 1, '2026-04-14 16:46:39'),
(43, 2, 5, 1, '2026-04-14 16:46:39'),
(44, 2, 6, 1, '2026-04-14 16:46:39'),
(45, 2, 4, 1, '2026-04-14 16:46:39'),
(46, 2, 17, 1, '2026-04-14 16:46:39'),
(47, 2, 20, 1, '2026-04-14 16:46:39'),
(48, 2, 19, 1, '2026-04-14 16:46:39'),
(63, 3, 13, 1, '2026-04-14 16:46:39'),
(64, 3, 1, 1, '2026-04-14 16:46:39'),
(65, 3, 23, 1, '2026-04-14 16:46:39'),
(66, 3, 10, 1, '2026-04-14 16:46:39'),
(67, 3, 9, 1, '2026-04-14 16:46:39'),
(68, 3, 11, 1, '2026-04-14 16:46:39'),
(69, 3, 20, 1, '2026-04-14 16:46:39'),
(70, 4, 8, 1, '2026-04-14 16:46:39'),
(71, 4, 18, 1, '2026-04-14 16:46:39'),
(72, 4, 1, 1, '2026-04-14 16:46:39'),
(73, 4, 22, 1, '2026-04-14 16:46:39'),
(74, 4, 5, 1, '2026-04-14 16:46:39'),
(75, 4, 6, 1, '2026-04-14 16:46:39'),
(76, 4, 4, 1, '2026-04-14 16:46:39'),
(77, 4, 19, 1, '2026-04-14 16:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `seo_settings`
--

CREATE TABLE `seo_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_key` varchar(100) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `og_image_url` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_rules`
--

CREATE TABLE `shipping_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED NOT NULL,
  `rule_name` varchar(150) NOT NULL,
  `min_order_amount` decimal(14,2) DEFAULT NULL,
  `max_order_amount` decimal(14,2) DEFAULT NULL,
  `shipping_fee` decimal(14,2) NOT NULL DEFAULT 0.00,
  `free_shipping` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `platform` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Instagram', 'http://instagram.com/homeredot', 'Instagram', 1, 0, '2026-04-19 16:37:34', '2026-04-19 17:46:44');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `movement_type` enum('purchase','sale','return','adjustment','restock','damage','cancel_restore') NOT NULL,
  `quantity_change` int(11) NOT NULL,
  `quantity_before` int(11) NOT NULL,
  `quantity_after` int(11) NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `movement_type`, `quantity_change`, `quantity_before`, `quantity_after`, `reference_type`, `reference_id`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 'sale', -1, 79, 78, 'order', 1, 'Storefront checkout ORD-20260417-WDOF4I', NULL, '2026-04-17 17:10:11'),
(2, 1, 'sale', -1, 78, 77, 'order', 2, 'Storefront checkout ORD-20260419-2MPW8N', NULL, '2026-04-19 12:58:51'),
(3, 2, 'restock', 5, 0, 5, NULL, NULL, 'iin', 1, '2026-05-12 21:36:55'),
(6, 361, 'sale', -1, 100, 99, 'order', 3, 'Storefront checkout ORD-20260607-C6TOBE', NULL, '2026-06-07 17:18:08'),
(7, 332, 'sale', -1, 100, 99, 'order', 4, 'Storefront checkout ORD-20260607-Z6QXZ9', NULL, '2026-06-07 18:55:07'),
(9, 317, 'sale', -1, 100, 99, 'order', 6, 'Storefront checkout ORD-20260608-OZOJG0', NULL, '2026-06-08 02:02:36'),
(10, 342, 'sale', -1, 100, 99, 'order', 6, 'Storefront checkout ORD-20260608-OZOJG0', NULL, '2026-06-08 02:02:36'),
(11, 317, 'sale', -1, 100, 99, 'order', 7, 'Storefront checkout ORD-20260608-LC2916', NULL, '2026-06-08 02:02:42'),
(12, 342, 'sale', -1, 100, 99, 'order', 7, 'Storefront checkout ORD-20260608-LC2916', NULL, '2026-06-08 02:02:42'),
(13, 317, 'sale', -1, 100, 99, 'order', 8, 'Storefront checkout ORD-20260608-163FKG', NULL, '2026-06-08 02:02:43'),
(14, 342, 'sale', -1, 100, 99, 'order', 8, 'Storefront checkout ORD-20260608-163FKG', NULL, '2026-06-08 02:02:43'),
(15, 256, 'sale', -1, 100, 99, 'order', 9, 'Storefront checkout ORD-20260608-755N88', NULL, '2026-06-08 02:09:28'),
(16, 360, 'sale', -1, 100, 99, 'order', 10, 'Storefront checkout ORD-20260608-XZTIUN', NULL, '2026-06-08 02:17:37'),
(17, 381, 'sale', -1, 100, 99, 'order', 11, 'Storefront checkout ORD-20260610-ZKIKJY', NULL, '2026-06-10 15:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `show_on_homepage` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(130) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `theme_settings`
--

CREATE TABLE `theme_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `theme_mode` enum('light','dark','system') NOT NULL DEFAULT 'system',
  `primary_color` varchar(20) DEFAULT NULL,
  `secondary_color` varchar(20) DEFAULT NULL,
  `button_color` varchar(20) DEFAULT NULL,
  `text_color` varchar(20) DEFAULT NULL,
  `background_color` varchar(20) DEFAULT NULL,
  `glassmorphism_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `theme_settings`
--

INSERT INTO `theme_settings` (`id`, `theme_mode`, `primary_color`, `secondary_color`, `button_color`, `text_color`, `background_color`, `glassmorphism_enabled`, `updated_by`, `updated_at`) VALUES
(1, 'system', '#FFA500', '#f97316', '#FFA500', '#0f172a', '#f8fafc', 1, 1, '2026-05-09 13:30:39');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_dashboard_summary`
-- (See below for the actual view)
--
CREATE TABLE `vw_dashboard_summary` (
`total_users` bigint(21)
,`total_products` bigint(21)
,`total_categories` bigint(21)
,`total_orders` bigint(21)
,`total_revenue` decimal(36,2)
,`pending_orders` bigint(21)
,`delivered_orders` bigint(21)
,`out_of_stock_products` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_low_stock_products`
-- (See below for the actual view)
--
CREATE TABLE `vw_low_stock_products` (
`id` bigint(20) unsigned
,`name` varchar(200)
,`sku` varchar(100)
,`stock_quantity` int(11)
,`low_stock_threshold` int(11)
,`status` enum('draft','active','inactive','archived')
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_top_selling_products`
-- (See below for the actual view)
--
CREATE TABLE `vw_top_selling_products` (
`id` bigint(20) unsigned
,`name` varchar(200)
,`sku` varchar(100)
,`units_sold` decimal(32,0)
,`sales_total` decimal(36,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `website_settings`
--

CREATE TABLE `website_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `website_name` varchar(150) NOT NULL,
  `website_logo_url` varchar(255) DEFAULT NULL,
  `favicon_url` varchar(255) DEFAULT NULL,
  `support_email` varchar(190) DEFAULT NULL,
  `support_phone` varchar(30) DEFAULT NULL,
  `whatsapp_number` varchar(30) DEFAULT NULL COMMENT 'WhatsApp number in international format, e.g. +250788000000',
  `contact_address` text DEFAULT NULL,
  `currency_code` varchar(10) NOT NULL DEFAULT 'RWF',
  `currency_symbol` varchar(10) NOT NULL DEFAULT 'FRw',
  `tax_percent` decimal(6,2) NOT NULL DEFAULT 0.00,
  `timezone` varchar(100) NOT NULL DEFAULT 'Africa/Kigali',
  `language_code` varchar(20) NOT NULL DEFAULT 'en',
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT 0,
  `maintenance_message` text DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_settings`
--

INSERT INTO `website_settings` (`id`, `website_name`, `website_logo_url`, `favicon_url`, `support_email`, `support_phone`, `whatsapp_number`, `contact_address`, `currency_code`, `currency_symbol`, `tax_percent`, `timezone`, `language_code`, `maintenance_mode`, `maintenance_message`, `updated_by`, `updated_at`) VALUES
(1, 'My Ecommerce Store', NULL, NULL, NULL, NULL, '+250781322698', NULL, 'RWF', 'FRw', 0.00, 'Africa/Kigali', 'en', 0, NULL, 1, '2026-05-28 03:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `customer_id`, `product_id`, `created_at`) VALUES
(1, 1, 1, '2026-04-17 22:16:09'),
(16, 1, 263, '2026-06-07 17:16:25');

-- --------------------------------------------------------

--
-- Structure for view `vw_dashboard_summary`
--
DROP TABLE IF EXISTS `vw_dashboard_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_dashboard_summary`  AS SELECT (select count(0) from `customers` where `customers`.`deleted_at` is null) AS `total_users`, (select count(0) from `products` where `products`.`deleted_at` is null) AS `total_products`, (select count(0) from `categories`) AS `total_categories`, (select count(0) from `orders`) AS `total_orders`, (select coalesce(sum(`orders`.`total_amount`),0) from `orders` where `orders`.`payment_status` in ('paid','refunded','partially_refunded')) AS `total_revenue`, (select count(0) from `orders` where `orders`.`order_status` = 'pending') AS `pending_orders`, (select count(0) from `orders` where `orders`.`order_status` = 'delivered') AS `delivered_orders`, (select count(0) from `products` where `products`.`stock_quantity` <= 0 and `products`.`deleted_at` is null) AS `out_of_stock_products` ;

-- --------------------------------------------------------

--
-- Structure for view `vw_low_stock_products`
--
DROP TABLE IF EXISTS `vw_low_stock_products`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_low_stock_products`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`sku` AS `sku`, `p`.`stock_quantity` AS `stock_quantity`, `p`.`low_stock_threshold` AS `low_stock_threshold`, `p`.`status` AS `status` FROM `products` AS `p` WHERE `p`.`deleted_at` is null AND `p`.`stock_quantity` <= `p`.`low_stock_threshold` ORDER BY `p`.`stock_quantity` ASC, `p`.`name` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `vw_top_selling_products`
--
DROP TABLE IF EXISTS `vw_top_selling_products`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_top_selling_products`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`sku` AS `sku`, coalesce(sum(`oi`.`quantity`),0) AS `units_sold`, coalesce(sum(`oi`.`line_total`),0) AS `sales_total` FROM ((`products` `p` left join `order_items` `oi` on(`oi`.`product_id` = `p`.`id`)) left join `orders` `o` on(`o`.`id` = `oi`.`order_id` and `o`.`order_status` <> 'cancelled')) GROUP BY `p`.`id`, `p`.`name`, `p`.`sku` ORDER BY coalesce(sum(`oi`.`quantity`),0) DESC, coalesce(sum(`oi`.`line_total`),0) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_login_history`
--
ALTER TABLE `admin_login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_login_history_admin` (`admin_user_id`),
  ADD KEY `idx_admin_login_history_email` (`email_attempted`);

--
-- Indexes for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `fk_admin_sessions_admin` (`admin_user_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_admin_users_role` (`role_id`),
  ADD KEY `fk_admin_users_created_by` (`created_by`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_logs_admin` (`admin_user_id`),
  ADD KEY `idx_audit_logs_module` (`module_name`,`created_at`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_banners_created_by` (`created_by`),
  ADD KEY `fk_banners_updated_by` (`updated_by`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_customer_cart_product` (`customer_id`,`product_id`),
  ADD KEY `fk_cart_items_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_categories_parent` (`parent_id`),
  ADD KEY `fk_categories_created_by` (`created_by`),
  ADD KEY `fk_categories_updated_by` (`updated_by`),
  ADD KEY `idx_categories_status` (`status`,`sort_order`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_coupons_created_by` (`created_by`),
  ADD KEY `idx_coupons_active_dates` (`is_active`,`starts_at`,`ends_at`);

--
-- Indexes for table `coupon_categories`
--
ALTER TABLE `coupon_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_coupon_category` (`coupon_id`,`category_id`),
  ADD KEY `fk_coupon_categories_category` (`category_id`);

--
-- Indexes for table `coupon_products`
--
ALTER TABLE `coupon_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_coupon_product` (`coupon_id`,`product_id`),
  ADD KEY `fk_coupon_products_product` (`product_id`);

--
-- Indexes for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_coupon_usage_customer_order` (`coupon_id`,`customer_id`,`order_id`),
  ADD KEY `fk_coupon_usage_customer` (`customer_id`),
  ADD KEY `fk_coupon_usage_order` (`order_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_customers_status` (`account_status`),
  ADD KEY `idx_customers_name` (`first_name`,`last_name`);

--
-- Indexes for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_addresses_customer` (`customer_id`),
  ADD KEY `idx_customer_addresses_default` (`customer_id`,`is_default`);

--
-- Indexes for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customer_notes_customer` (`customer_id`),
  ADD KEY `fk_customer_notes_admin` (`admin_user_id`);

--
-- Indexes for table `delivery_zones`
--
ALTER TABLE `delivery_zones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_failed_login_email_ip` (`email`,`ip_address`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_faqs_admin` (`updated_by`);

--
-- Indexes for table `filter_groups`
--
ALTER TABLE `filter_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `filter_options`
--
ALTER TABLE `filter_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_filter_option` (`filter_group_id`,`value`);

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `homepage_sections`
--
ALTER TABLE `homepage_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `legal_pages`
--
ALTER TABLE `legal_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_key` (`page_key`),
  ADD KEY `fk_legal_pages_admin` (`updated_by`);

--
-- Indexes for table `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_files_used` (`is_used`),
  ADD KEY `fk_media_files_admin` (`uploaded_by`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_admin` (`recipient_admin_user_id`,`status`),
  ADD KEY `idx_notifications_customer` (`recipient_customer_id`,`status`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_customer` (`customer_id`),
  ADD KEY `idx_orders_status` (`order_status`,`payment_status`,`delivery_status`),
  ADD KEY `idx_orders_placed` (`placed_at`),
  ADD KEY `fk_orders_zone` (`delivery_zone_id`),
  ADD KEY `fk_orders_coupon` (`coupon_id`),
  ADD KEY `idx_orders_payment_status` (`payment_status`),
  ADD KEY `idx_orders_delivery_status` (`delivery_status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

--
-- Indexes for table `order_notes`
--
ALTER TABLE `order_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_notes_order` (`order_id`),
  ADD KEY `fk_order_notes_admin` (`admin_user_id`);

--
-- Indexes for table `order_timeline`
--
ALTER TABLE `order_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_timeline_order` (`order_id`,`changed_at`),
  ADD KEY `fk_order_timeline_admin` (`changed_by`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_password_resets_email` (`email`),
  ADD KEY `idx_password_resets_expires_at` (`expires_at`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payment_transactions_order` (`order_id`),
  ADD KEY `idx_payment_transactions_status` (`status`),
  ADD KEY `fk_payment_transactions_method` (`payment_method_id`),
  ADD KEY `fk_payment_transactions_verified_by` (`verified_manually_by`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_key` (`permission_key`),
  ADD UNIQUE KEY `uq_module_action` (`module`,`action`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_status` (`status`),
  ADD KEY `idx_products_flags` (`featured_product`,`best_seller`,`new_arrival`),
  ADD KEY `idx_products_stock` (`stock_quantity`),
  ADD KEY `fk_products_created_by` (`created_by`),
  ADD KEY `fk_products_updated_by` (`updated_by`),
  ADD KEY `idx_products_searchable` (`is_searchable`,`status`,`visibility`);
ALTER TABLE `products` ADD FULLTEXT KEY `ftx_products_search` (`name`,`short_description`,`description`,`brand`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_product_category_map` (`product_id`,`category_id`,`subcategory_id`),
  ADD KEY `fk_product_categories_category` (`category_id`),
  ADD KEY `fk_product_categories_subcategory` (`subcategory_id`);

--
-- Indexes for table `product_filters`
--
ALTER TABLE `product_filters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_product_filter` (`product_id`,`filter_option_id`),
  ADD KEY `fk_product_filters_option` (`filter_option_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product` (`product_id`,`sort_order`);

--
-- Indexes for table `product_tags_map`
--
ALTER TABLE `product_tags_map`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_product_tag` (`product_id`,`tag_id`),
  ADD KEY `fk_product_tags_tag` (`tag_id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_refunds_order` (`order_id`),
  ADD KEY `fk_refunds_admin` (`processed_by`),
  ADD KEY `fk_refunds_payment_transaction` (`payment_transaction_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reviews_product` (`product_id`),
  ADD KEY `fk_reviews_customer` (`customer_id`),
  ADD KEY `fk_reviews_order` (`order_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_role_permission` (`role_id`,`permission_id`),
  ADD KEY `fk_role_permissions_permission` (`permission_id`);

--
-- Indexes for table `seo_settings`
--
ALTER TABLE `seo_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_key` (`page_key`),
  ADD KEY `fk_seo_settings_admin` (`updated_by`);

--
-- Indexes for table `shipping_rules`
--
ALTER TABLE `shipping_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_shipping_rules_zone` (`delivery_zone_id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_stock_movements_product` (`product_id`,`created_at`),
  ADD KEY `fk_stock_movements_admin` (`created_by`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_subcategories_category` (`category_id`,`status`,`sort_order`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_theme_settings_admin` (`updated_by`);

--
-- Indexes for table `website_settings`
--
ALTER TABLE `website_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_website_settings_admin` (`updated_by`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_customer_wishlist_product` (`customer_id`,`product_id`),
  ADD KEY `fk_wishlist_items_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_login_history`
--
ALTER TABLE `admin_login_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9992;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_categories`
--
ALTER TABLE `coupon_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_products`
--
ALTER TABLE `coupon_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_notes`
--
ALTER TABLE `customer_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_zones`
--
ALTER TABLE `delivery_zones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `filter_groups`
--
ALTER TABLE `filter_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `filter_options`
--
ALTER TABLE `filter_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `homepage_sections`
--
ALTER TABLE `homepage_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `legal_pages`
--
ALTER TABLE `legal_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_notes`
--
ALTER TABLE `order_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_timeline`
--
ALTER TABLE `order_timeline`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=384;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT for table `product_filters`
--
ALTER TABLE `product_filters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `product_tags_map`
--
ALTER TABLE `product_tags_map`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `seo_settings`
--
ALTER TABLE `seo_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_rules`
--
ALTER TABLE `shipping_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `theme_settings`
--
ALTER TABLE `theme_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `website_settings`
--
ALTER TABLE `website_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_login_history`
--
ALTER TABLE `admin_login_history`
  ADD CONSTRAINT `fk_admin_login_history_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_admin_sessions_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD CONSTRAINT `fk_admin_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`),
  ADD CONSTRAINT `fk_admin_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_logs_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `fk_banners_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_banners_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_items_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `fk_coupons_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `coupon_categories`
--
ALTER TABLE `coupon_categories`
  ADD CONSTRAINT `fk_coupon_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_coupon_categories_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupon_products`
--
ALTER TABLE `coupon_products`
  ADD CONSTRAINT `fk_coupon_products_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_coupon_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD CONSTRAINT `fk_coupon_usage_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_coupon_usage_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_coupon_usage_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD CONSTRAINT `fk_customer_addresses_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD CONSTRAINT `fk_customer_notes_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_customer_notes_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `fk_faqs_admin` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `filter_options`
--
ALTER TABLE `filter_options`
  ADD CONSTRAINT `fk_filter_options_group` FOREIGN KEY (`filter_group_id`) REFERENCES `filter_groups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `legal_pages`
--
ALTER TABLE `legal_pages`
  ADD CONSTRAINT `fk_legal_pages_admin` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `media_files`
--
ALTER TABLE `media_files`
  ADD CONSTRAINT `fk_media_files_admin` FOREIGN KEY (`uploaded_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_admin` FOREIGN KEY (`recipient_admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_notifications_customer` FOREIGN KEY (`recipient_customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `fk_orders_zone` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `order_notes`
--
ALTER TABLE `order_notes`
  ADD CONSTRAINT `fk_order_notes_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_notes_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_timeline`
--
ALTER TABLE `order_timeline`
  ADD CONSTRAINT `fk_order_timeline_admin` FOREIGN KEY (`changed_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_order_timeline_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `fk_payment_transactions_method` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `fk_payment_transactions_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_transactions_verified_by` FOREIGN KEY (`verified_manually_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_product_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_categories_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_categories_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_filters`
--
ALTER TABLE `product_filters`
  ADD CONSTRAINT `fk_product_filters_option` FOREIGN KEY (`filter_option_id`) REFERENCES `filter_options` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_filters_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_tags_map`
--
ALTER TABLE `product_tags_map`
  ADD CONSTRAINT `fk_product_tags_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `fk_refunds_admin` FOREIGN KEY (`processed_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_refunds_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_refunds_payment_transaction` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seo_settings`
--
ALTER TABLE `seo_settings`
  ADD CONSTRAINT `fk_seo_settings_admin` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `shipping_rules`
--
ALTER TABLE `shipping_rules`
  ADD CONSTRAINT `fk_shipping_rules_zone` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `fk_stock_movements_admin` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_stock_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `fk_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD CONSTRAINT `fk_theme_settings_admin` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `website_settings`
--
ALTER TABLE `website_settings`
  ADD CONSTRAINT `fk_website_settings_admin` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `fk_wishlist_items_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
