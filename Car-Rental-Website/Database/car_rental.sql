-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Okt 2024 pada 06.24
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_rental`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `account_requests`
--

CREATE TABLE `account_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `approval` int(25) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `photo1` text NOT NULL,
  `photo2` text NOT NULL,
  `brand` varchar(30) NOT NULL,
  `model` smallint(6) NOT NULL,
  `fuel_type` varchar(15) NOT NULL,
  `price` float NOT NULL,
  `gearbox` varchar(15) NOT NULL,
  `available` tinyint(1) NOT NULL,
  `kursi` int(25) NOT NULL DEFAULT 0,
  `kondisi` int(25) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `cars`
--

INSERT INTO `cars` (`id`, `photo1`, `photo2`, `brand`, `model`, `fuel_type`, `price`, `gearbox`, `available`, `kursi`, `kondisi`) VALUES
(5, 'https://sf1.auto-moto.com/wp-content/uploads/sites/9/2016/07/dacia-dokker-1024x768.jpg', 'https://www.autoscout24.be/cms-content-assets/1pwJ7zcnchpk3d9ZtAYcDu-4e28845edb0deae0b3d47d4584817b6b-Dacia-Dokker-2013-1280-01-1100.jpg', 'Honda', 2016, 'bensin', 1000000, 'manual', 1, 6, 1),
(6, 'https://www.oneclickdrive.com/car-for-rent/slider-desktop/Mercedes-Benz_Mayback-S500_2020_10864_10864_3100348325-5_small.jpg?vr=3', 'https://img.gocar.be/v7/_cloud_wordpress_/2019/06/mercedes-maybach_s_650_24.jpg', 'Mitsubishi', 2019, 'bensin', 850000, 'automatic', 0, 5, 1),
(14, 'http://127.0.0.1:8000/upload/1715649155_honda11.jpg', 'http://127.0.0.1:8000/upload/1715649155_honda1.jpg', 'Honda', 2021, 'bensin', 870000, 'automatic', 0, 4, 1),
(16, 'http://127.0.0.1:8000/upload/1715649778_toyota11.jpg', 'http://127.0.0.1:8000/upload/1715649778_toyota1.jpg', 'Toyota', 2021, 'diesel', 950000, 'manual', 1, 6, 1),
(26, 'http://127.0.0.1:8000/upload/1723685256_toyota2.jpg', 'http://127.0.0.1:8000/upload/1723685256_toyota1.png', 'Toyota', 2020, 'bensin', 880000, 'automatic', 0, 6, 1),
(30, 'http://127.0.0.1:8000/upload/1725374364_suzuki2.jpg', 'http://127.0.0.1:8000/upload/1725374364_suzuki1.png', 'Suzuki', 2021, 'bensin', 900000, 'manual', 0, 6, 1),
(31, 'http://127.0.0.1:8000/upload/1726290111_toyota12.jpg', 'http://127.0.0.1:8000/upload/1726290111_toyota11.jpg', 'Toyota', 2021, 'bensin', 900000, 'automatic', 0, 5, 1),
(33, 'http://127.0.0.1:8000/upload/1726810436_honda2.jpeg', 'http://127.0.0.1:8000/upload/1726810436_honda1.jpeg', 'Honda', 2023, 'bensin', 980000, 'automatic', 1, 4, 1),
(37, 'http://127.0.0.1:8000/upload/1726983947_toyota112.jpg', 'http://127.0.0.1:8000/upload/1726983947_toyota111.jpg', 'Toyota', 2023, 'bensin', 1300000, 'automatic', 1, 5, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `car_id` int(11) NOT NULL,
  `komentar` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `firstname`, `lastname`, `email`, `car_id`, `komentar`, `created_at`, `updated_at`) VALUES
(3, 10, 'Nando', 'Salam', 'nando@gmail.com', 5, 'Saya suka desainnya!!', '2024-09-13 21:59:41', '2024-09-16 23:52:58'),
(4, 10, 'Nando', 'Salam', 'nando@gmail.com', 6, 'Terimakasih, mobilnya nyaman sekali', '2024-09-13 22:04:41', '2024-09-13 22:04:41'),
(5, 45, 'zera', 'ansyah', 'akukurus22@gmail.com', 14, 'Saya suka cara dengan kenyamanan mobilnya', '2024-09-13 22:06:58', '2024-09-13 22:06:58'),
(6, 45, 'zera', 'ansyah', 'akukurus22@gmail.com', 6, 'Mobil dalam kondisi bagus, saya beruntung menyewa mobil disini', '2024-09-13 22:11:42', '2024-09-13 22:11:42'),
(7, 10, 'Nando', 'Salam', 'nando@gmail.com', 26, 'nyaman saat dibawa berkendara, terimakasih atas sewaannya DAYstore', '2024-09-13 22:39:09', '2024-09-13 22:39:09'),
(11, 11, 'Rizal', 'Firmansyah', 'rizal@gmail.com', 31, 'Saya suka dengan kenyamanan yang ditawarkan mobil ini', '2024-09-14 19:58:05', '2024-09-14 19:58:05'),
(18, 10, 'Nando', 'Salam', 'nando@gmail.com', 5, 'Saya suka banget sama mobil ini, jadi ingin sering sewa yang ini!!', '2024-09-15 01:17:07', '2024-09-18 04:24:27'),
(19, 10, 'Nando', 'Salam', 'nando@gmail.com', 31, 'saya lumayan suka yang ini.', '2024-09-18 02:35:46', '2024-09-19 21:16:20'),
(21, 42, 'Naufal', 'fian', 'naufalfian@gmail.com', 26, 'Mobil yang baguss!!', '2024-09-19 23:35:04', '2024-09-19 23:35:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2023_02_06_172423_create_cars_table', 1),
(6, '2023_02_06_172523_create_rentals_table', 1),
(7, '2024_08_20_001429_add_email_verification_codes_email_verified_ats_on_users_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 13, 'main', '7b8b2b04453aab2c1e01079d7ee85e24f4b4df84167444a1503d937a14e6b36e', '[\"*\"]', NULL, NULL, '2024-08-19 19:28:45', '2024-08-19 19:28:45'),
(2, 'App\\Models\\User', 14, 'main', '48f4a444f3f75e4341318c18f9a8b0c6f76985cd33f9bebdd7e3e523d1145f83', '[\"*\"]', NULL, NULL, '2024-08-19 22:59:25', '2024-08-19 22:59:25'),
(3, 'App\\Models\\User', 15, 'main', '86c9cf7455280a77bc48b041ce78b755a1b32f46b8004d48dd41c178e626f8b3', '[\"*\"]', NULL, NULL, '2024-08-19 23:05:41', '2024-08-19 23:05:41'),
(4, 'App\\Models\\User', 16, 'main', '226f7632d5abfa38442c4d883ceddf61cd47ff6a17f2d100d9540ad2629de298', '[\"*\"]', NULL, NULL, '2024-08-19 23:25:09', '2024-08-19 23:25:09'),
(5, 'App\\Models\\User', 16, 'main', '33dce83b4e932bb2af4379a6d2ae32430bda541498c7b0b85a482088f9115b5e', '[\"*\"]', NULL, NULL, '2024-08-19 23:28:44', '2024-08-19 23:28:44'),
(6, 'App\\Models\\User', 16, 'main', '59d6f2d908d5e269d146b858c80ef19eec287bfdd9c0ae40a6b5571fd7ad869c', '[\"*\"]', NULL, NULL, '2024-08-19 23:29:41', '2024-08-19 23:29:41'),
(7, 'App\\Models\\User', 16, 'main', '643163195a5444372bb834728677f2d994060b787b85984d6f11e367e6d18b70', '[\"*\"]', NULL, NULL, '2024-08-19 23:48:32', '2024-08-19 23:48:32'),
(8, 'App\\Models\\User', 18, 'main', 'e430880a1641661f64e4bfcd0640e7b8888ef10ed2c8ff199afee633423f7a8d', '[\"*\"]', NULL, NULL, '2024-08-19 23:55:08', '2024-08-19 23:55:08'),
(9, 'App\\Models\\User', 19, 'main', '96af213e618409d053c14ea287f337aa940799d530f9fd48d7b9f0549c8362ef', '[\"*\"]', NULL, NULL, '2024-08-20 00:20:00', '2024-08-20 00:20:00'),
(10, 'App\\Models\\User', 20, 'main', '148018c6307208b0e3efa0ac08306240a92a0b079536114d455d8598080eb676', '[\"*\"]', NULL, NULL, '2024-08-20 00:35:41', '2024-08-20 00:35:41'),
(11, 'App\\Models\\User', 21, 'main', '43a35b94ff7399dd5eb4a7d8210c73e9afcb398132b0cbfa6423ee67990ee2b3', '[\"*\"]', NULL, NULL, '2024-08-20 06:00:29', '2024-08-20 06:00:29'),
(12, 'App\\Models\\User', 22, 'main', '91d4dfc274aa53038ab32cf1f81981ac1e368fce17d61cf47bba29aa6412fdd7', '[\"*\"]', NULL, NULL, '2024-08-20 06:23:33', '2024-08-20 06:23:33'),
(13, 'App\\Models\\User', 10, 'main', 'a621d2fba75230ce9c0bd2c9e56770233c915d348173039186c5f7bfa94fe3fc', '[\"*\"]', NULL, NULL, '2024-08-20 07:15:27', '2024-08-20 07:15:27'),
(14, 'App\\Models\\User', 23, 'main', '8850e1963e373e354a2234e4a32d4db6213db3fd3a3a070ec31f4f401ae4bb78', '[\"*\"]', NULL, NULL, '2024-08-20 08:07:20', '2024-08-20 08:07:20'),
(15, 'App\\Models\\User', 6, 'main', 'c9eb07d28909a82c4d9ab65b86e7004971c04b5043ef5723217ea7a07a190534', '[\"*\"]', NULL, NULL, '2024-08-20 20:39:34', '2024-08-20 20:39:34'),
(16, 'App\\Models\\User', 24, 'main', '3086310c794f9ef94edd5a3a138d46737cda8974e181cb3b2eb0cb8070339b11', '[\"*\"]', NULL, NULL, '2024-08-20 21:32:45', '2024-08-20 21:32:45'),
(17, 'App\\Models\\User', 11, 'main', 'a9170c82a340ed6942870c65eb33dc93f329bd335fcaf7b1ff26b95ccf62f55f', '[\"*\"]', NULL, NULL, '2024-08-20 23:47:43', '2024-08-20 23:47:43'),
(18, 'App\\Models\\User', 23, 'main', '8faa25233a3a64f5b21a4386df4965d5c8deb12267cf29041a7e3219c91d108d', '[\"*\"]', NULL, NULL, '2024-08-21 23:39:38', '2024-08-21 23:39:38'),
(19, 'App\\Models\\User', 33, 'main', '43c9ddbef44766cf88e25625998ed679a998b3d336df2c95af2e5458b17962d3', '[\"*\"]', NULL, NULL, '2024-08-25 23:39:56', '2024-08-25 23:39:56'),
(20, 'App\\Models\\User', 35, 'main', '11a505e3d7f0f9b58226c9eb6163c0270cc9cd1ef45858a15e4de4809c7be30c', '[\"*\"]', NULL, NULL, '2024-08-25 23:44:48', '2024-08-25 23:44:48'),
(21, 'App\\Models\\User', 36, 'main', '404cec16ee2656e8be56d96570fb98d13cd2f00663dff13a9092e561478ce3b8', '[\"*\"]', NULL, NULL, '2024-08-25 23:52:57', '2024-08-25 23:52:57'),
(22, 'App\\Models\\User', 37, 'main', '3536b314023d41c17bd4e9f8364dad3eb0d5cb7cf89ffb1bfbef84de199fc647', '[\"*\"]', NULL, NULL, '2024-08-26 00:06:55', '2024-08-26 00:06:55'),
(23, 'App\\Models\\User', 42, 'main', '7984bda93171a0292ca5b5f0b86b42439221902f991840d097b46880c81829ab', '[\"*\"]', NULL, NULL, '2024-08-26 00:29:57', '2024-08-26 00:29:57'),
(24, 'App\\Models\\User', 43, 'main', '679c5542db6ca041b53e166efd6430d4ecaab43a044226fe7d3dd2a398646f14', '[\"*\"]', NULL, NULL, '2024-09-01 23:11:20', '2024-09-01 23:11:20'),
(25, 'App\\Models\\User', 45, 'main', '797880be5953eba5a7fec3a78541305037be9722e08981aa31614b61d323b2af', '[\"*\"]', NULL, NULL, '2024-09-01 23:56:36', '2024-09-01 23:56:36'),
(26, 'App\\Models\\User', 46, 'main', 'ba603b7e71386938a9828a67bc0730174182df5019dc8a8eb47f99ba4436c8b0', '[\"*\"]', NULL, NULL, '2024-09-04 15:29:13', '2024-09-04 15:29:13'),
(27, 'App\\Models\\User', 46, 'main', '70af533a08f5bc1b9fd953a72d028970548323d475bc55ca6406a654c8c26586', '[\"*\"]', NULL, NULL, '2024-09-04 15:30:36', '2024-09-04 15:30:36'),
(28, 'App\\Models\\User', 46, 'main', 'f27a1a2343060c2c189f96371247dff12c2e661e08d7af66dd40ca6086999a32', '[\"*\"]', NULL, NULL, '2024-09-04 15:34:36', '2024-09-04 15:34:36'),
(29, 'App\\Models\\User', 46, 'main', '7985e161fa88710405986da9eacd2cbd7b5e736209e94f56bc585f82ea320992', '[\"*\"]', NULL, NULL, '2024-09-04 15:38:26', '2024-09-04 15:38:26'),
(30, 'App\\Models\\User', 46, 'main', '39fbb28b36a5fbdbe30aeec5f7e358216c409372f862ecae37ff0f235a223dfa', '[\"*\"]', NULL, NULL, '2024-09-04 15:40:23', '2024-09-04 15:40:23'),
(31, 'App\\Models\\User', 47, 'main', '0a3bd85621b8df9bb9c24cfa94845ad9531e91f8df9ad518e8758a712ab88536', '[\"*\"]', NULL, NULL, '2024-09-04 15:53:11', '2024-09-04 15:53:11'),
(32, 'App\\Models\\User', 48, 'main', '07a4e41fa90f67e1c4e7b6bc2d2c542ff195a5336f33aa7afbfc9606689591f4', '[\"*\"]', NULL, NULL, '2024-09-04 16:14:38', '2024-09-04 16:14:38'),
(33, 'App\\Models\\User', 48, 'main', 'aff1fb2a2cee6f673a59cfa73fc0b406c717d42712a0963ded9bf53ca171086c', '[\"*\"]', NULL, NULL, '2024-09-04 16:15:45', '2024-09-04 16:15:45'),
(34, 'App\\Models\\User', 48, 'main', 'fa834eac56ddb63946348696b14476f17ca44bd3a4fc31d48275c8f3ccb6497b', '[\"*\"]', NULL, NULL, '2024-09-04 16:16:10', '2024-09-04 16:16:10'),
(35, 'App\\Models\\User', 50, 'main', 'bb3afe6934a77c9f5f770840d8f82ee85b8f7aeffd117bd746091aecd9ae652e', '[\"*\"]', NULL, NULL, '2024-09-04 17:43:35', '2024-09-04 17:43:35'),
(36, 'App\\Models\\User', 51, 'main', '802437965ff1022a423b5e1af6448433a6a574486c8c6d7f9047124fd51aa6c7', '[\"*\"]', NULL, NULL, '2024-09-04 18:51:10', '2024-09-04 18:51:10'),
(37, 'App\\Models\\User', 52, 'main', '52e1d0dcaf939b4329ac49f98a32209b9dafcb3b9f3ef9b5a371e34afbb438cc', '[\"*\"]', NULL, NULL, '2024-09-04 20:20:22', '2024-09-04 20:20:22'),
(38, 'App\\Models\\User', 53, 'main', '97301a3f68b91763ff5692fa18153bd8a5575576777f068c27f5e3eb51b45356', '[\"*\"]', NULL, NULL, '2024-09-06 05:45:24', '2024-09-06 05:45:24'),
(39, 'App\\Models\\User', 54, 'main', '8283ff57d422bc2ce6d377acbba6f5075a47b6aece13df57d5f0cb7fb1c8fb4d', '[\"*\"]', NULL, NULL, '2024-09-06 22:16:31', '2024-09-06 22:16:31'),
(40, 'App\\Models\\User', 11, 'main', '519a5585a38854f608150fe4238eade08eefb93becc50045e1044ff63ba8538c', '[\"*\"]', NULL, NULL, '2024-09-09 23:39:17', '2024-09-09 23:39:17'),
(41, 'App\\Models\\User', 54, 'main', 'c391ea758c0808a1290fcdd637c02cc12163f42652ad3f69f0fd435f1a114290', '[\"*\"]', NULL, NULL, '2024-09-10 06:38:41', '2024-09-10 06:38:41'),
(42, 'App\\Models\\User', 59, 'main', 'fec4959a7edca15e49586fedce8b1586b0eafc924c62dfee70d0ca7f06a83325', '[\"*\"]', NULL, NULL, '2024-09-14 21:18:27', '2024-09-14 21:18:27'),
(43, 'App\\Models\\User', 60, 'main', '318d01fd5ed11e5692b663d203cc4608d33c73e81a9f2ed1af454eb79ab771d2', '[\"*\"]', NULL, NULL, '2024-09-17 20:10:37', '2024-09-17 20:10:37'),
(44, 'App\\Models\\User', 60, 'main', '64477e62524f8c9a2f09da2a1f791720f50d84d26647558b07bb38961f4a41ef', '[\"*\"]', NULL, NULL, '2024-09-21 18:38:04', '2024-09-21 18:38:04'),
(45, 'App\\Models\\User', 62, 'main', 'e1ec8aaed713cd94eecfe0cfecc2aba39f424e3675b70ffacb709cbe65779079', '[\"*\"]', NULL, NULL, '2024-09-22 23:30:50', '2024-09-22 23:30:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `rental_date` date NOT NULL,
  `return_date` date NOT NULL,
  `price` float NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `pays` float DEFAULT 0,
  `status` enum('lunas','belum_lunas','belum_bayar') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'belum_bayar',
  `returned` enum('belum_diambil','sedang_disewa','sudah_kembali') NOT NULL DEFAULT 'belum_diambil',
  `cancel` int(25) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rentals`
--

INSERT INTO `rentals` (`id`, `rental_date`, `return_date`, `price`, `user_id`, `car_id`, `pays`, `status`, `returned`, `cancel`, `created_at`, `updated_at`) VALUES
(19, '2024-09-25', '2024-09-28', 3000000, 10, 5, 3000000, 'lunas', 'sudah_kembali', 0, '2024-08-21 06:31:18', '2024-08-24 22:37:47'),
(24, '2024-09-01', '2024-09-02', 850000, 10, 6, 850000, 'lunas', 'sudah_kembali', 0, '2024-08-22 06:31:52', '2024-09-03 16:12:53'),
(28, '2024-09-18', '2024-09-19', 850000, 10, 6, 850000, 'lunas', 'sudah_kembali', 0, '2024-09-01 06:32:04', '2024-09-03 16:12:53'),
(30, '2024-09-20', '2024-09-21', 900000, 10, 31, 900000, 'lunas', 'sedang_disewa', 0, '2024-09-18 18:18:15', '2024-09-22 18:19:02'),
(32, '2024-09-04', '2024-09-07', 2550000, 45, 6, 2550000, 'lunas', 'sudah_kembali', 0, '2024-09-01 06:32:11', '2024-09-13 22:07:10'),
(33, '2024-09-09', '2024-09-11', 1740000, 45, 14, 1740000, 'lunas', 'sudah_kembali', 0, '2024-09-01 06:32:16', '2024-09-02 00:02:22'),
(36, '2024-09-20', '2024-09-21', 870000, 10, 14, 0, 'belum_bayar', 'belum_diambil', 1, '2024-09-05 19:04:01', '2024-09-05 19:19:11'),
(37, '2024-09-28', '2024-09-29', 880000, 10, 26, 880000, 'lunas', 'belum_diambil', 0, '2024-09-05 19:04:19', '2024-09-06 22:50:47'),
(38, '2024-09-19', '2024-09-20', 1000000, 10, 5, 0, 'belum_bayar', 'belum_diambil', 1, '2024-09-06 06:48:25', '2024-09-06 22:41:28'),
(39, '2024-09-11', '2024-09-12', 880000, 10, 26, 880000, 'lunas', 'sudah_kembali', 0, '2024-09-09 23:36:21', NULL),
(40, '2024-09-19', '2024-09-20', 900000, 11, 30, 0, 'belum_bayar', 'belum_diambil', 1, '2024-09-10 18:14:31', '2024-09-10 19:04:36'),
(41, '2024-10-09', '2024-10-11', 1800000, 10, 31, 1800000, 'lunas', 'sudah_kembali', 0, '2024-09-13 22:46:04', '2024-09-14 19:21:53'),
(42, '2024-09-16', '2024-09-17', 880000, 10, 26, 880000, 'lunas', 'sudah_kembali', 0, '2024-09-14 19:21:26', '2024-09-14 19:21:53'),
(43, '2024-09-16', '2024-09-17', 900000, 11, 31, 900000, 'lunas', 'sudah_kembali', 0, '2024-09-14 19:54:07', '2024-09-14 19:56:25'),
(44, '2024-09-20', '2024-09-21', 900000, 10, 31, 900000, 'lunas', 'sudah_kembali', 0, '2024-09-17 18:51:56', '2024-09-17 20:01:34'),
(45, '2024-09-20', '2024-09-21', 880000, 42, 26, 880000, 'lunas', 'sudah_kembali', 0, '2024-09-18 19:25:22', '2024-09-18 19:27:16'),
(46, '2024-09-23', '2024-09-23', 880000, 42, 26, 880000, 'lunas', 'sudah_kembali', 0, '2024-09-19 22:50:13', '2024-09-19 23:33:25'),
(47, '2024-09-21', '2024-09-22', 900000, 42, 30, 0, 'belum_bayar', 'belum_diambil', 1, '2024-09-19 22:51:33', '2024-09-19 22:52:54'),
(48, '2024-09-21', '2024-09-23', 1800000, 11, 30, 0, 'belum_bayar', 'belum_diambil', 1, '2024-09-19 22:58:21', '2024-09-20 21:16:04'),
(53, '2024-09-23', '2024-09-24', 850000, 11, 6, 200000, 'belum_lunas', 'sedang_disewa', 0, '2024-09-21 19:30:13', '2024-09-22 04:37:41'),
(55, '2024-09-24', '2024-09-25', 900000, 10, 30, 900000, 'lunas', 'belum_diambil', 0, '2024-09-22 19:58:15', '2024-09-22 20:35:18'),
(56, '2024-09-24', '2024-09-25', 870000, 62, 14, 870000, 'lunas', 'sedang_disewa', 0, '2024-09-22 23:37:09', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `topup_histories`
--

CREATE TABLE `topup_histories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `topup_amount` float NOT NULL,
  `topup_date` date NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `topup_histories`
--

INSERT INTO `topup_histories` (`id`, `user_id`, `topup_amount`, `topup_date`, `created_at`, `updated_at`) VALUES
(2, 10, 100000, '2024-09-04', '2024-09-03 20:26:34', '2024-09-03 20:26:34'),
(3, 10, 60000, '2024-09-04', '2024-09-03 20:27:22', '2024-09-03 20:27:22'),
(4, 10, 100000, '2024-09-04', '2024-09-03 20:29:17', '2024-09-03 20:29:17'),
(19, 10, 100000, '2024-09-05', '2024-09-04 23:41:43', '2024-09-04 23:41:43'),
(24, 11, 20000, '2024-09-10', '2024-09-09 23:41:27', '2024-09-09 23:41:27'),
(25, 11, 10000, '2024-09-10', '2024-09-09 23:43:53', '2024-09-09 23:43:53'),
(26, 11, 10000, '2024-09-11', '2024-09-10 17:56:04', '2024-09-10 17:56:04'),
(27, 42, 10000, '2024-09-11', '2024-09-10 18:25:12', '2024-09-10 18:25:12'),
(28, 42, 10000, '2024-09-11', '2024-09-10 18:47:28', '2024-09-10 18:47:28'),
(29, 42, 10000, '2024-09-11', '2024-09-10 19:01:13', '2024-09-10 19:01:13'),
(30, 11, 10000, '2024-09-11', '2024-09-10 19:29:13', '2024-09-10 19:29:13'),
(32, 10, 100000, '2024-09-12', '2024-09-11 18:14:59', '2024-09-11 18:14:59'),
(33, 11, 10000, '2024-09-12', '2024-09-11 23:26:51', '2024-09-11 23:26:51'),
(35, 11, 1000000, '2024-09-15', '2024-09-14 19:56:05', '2024-09-14 19:56:05'),
(36, 10, 100000, '2024-09-18', '2024-09-17 19:57:59', '2024-09-17 19:57:59'),
(37, 10, 10000000, '2024-09-18', '2024-09-17 20:01:19', '2024-09-17 20:01:19'),
(39, 10, 10000, '2024-09-18', '2024-09-18 02:24:24', '2024-09-18 02:24:24'),
(40, 42, 850000, '2024-09-19', '2024-09-18 19:26:59', '2024-09-18 19:26:59'),
(41, 42, 1000000, '2024-09-20', '2024-09-19 23:32:45', '2024-09-19 23:32:45'),
(43, 11, 290000, '2024-09-22', '2024-09-21 19:34:17', '2024-09-21 19:34:17'),
(44, 10, 150000, '2024-09-23', '2024-09-22 20:02:23', '2024-09-22 20:02:23'),
(45, 11, 50000, '2024-09-23', '2024-09-22 20:59:50', '2024-09-22 20:59:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `email` text NOT NULL,
  `level` varchar(255) NOT NULL,
  `email_verification_code` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` text NOT NULL,
  `saldo_dana` int(25) NOT NULL DEFAULT 0,
  `profile_photo` text DEFAULT NULL,
  `alamat` text NOT NULL,
  `banned` int(25) NOT NULL DEFAULT 0,
  `topup_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `token_expires_at` timestamp NULL DEFAULT NULL,
  `otp` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `telephone`, `email`, `level`, `email_verification_code`, `email_verified_at`, `password`, `saldo_dana`, `profile_photo`, `alamat`, `banned`, `topup_token`, `created_at`, `updated_at`, `token_expires_at`, `otp`) VALUES
(6, 'admin', 'web', '123456789', 'admin@gmail.com', 'admin', NULL, '2024-08-20 20:39:34', '$2a$10$mHYZ9fYIgo2ZJcOEtImyheP2jpSwwhmHIkfegPa/feyg4zZuQa0PK', 0, NULL, 'Jl.Rajawali punggul', 0, NULL, '2024-08-20 06:32:45', '2024-08-20 20:39:34', NULL, 0),
(10, 'Nando', 'Salam', '0987654321', 'nando@gmail.com', 'user', NULL, '2024-08-20 07:15:27', '$2a$10$dOgqs3ho3eWYkXjpy9GTUOP02qKfaqDRcGD6bqGufTNz0VCCzh.NG', 8000000, 'http://127.0.0.1:8000/upload/1725522279_icon.png', 'Jl.Mangga 1 sruni', 0, NULL, '2024-08-25 06:32:52', '2024-09-22 20:35:18', NULL, 0),
(11, 'Rizal', 'Firmansyah', '0876543214', 'rizal@gmail.com', 'user', NULL, '2024-09-09 23:39:17', '$2a$10$XrYqsALo.UrXtk4V.l7GYeTx9UfdUHkG1PejGNBzI95JM9N.8pVWa', 300000, 'http://127.0.0.1:8000/upload/1726122781_kochoXgiyu.jpg', 'Jl.Manggis no.2', 0, NULL, '2024-08-29 06:33:00', '2024-09-22 20:59:50', NULL, 0),
(23, 'Yogi', 'Thiflaini', '0987654321', 'yogithiflaini@gmail.com', 'admin', NULL, '2024-08-21 23:39:38', '$2a$10$vpdXMMMEZk606nMExVKPnuUPIsL6GQdtq/MT67uL5tMZCTAVGBoeS', 0, NULL, 'Jl.Pisang no 25', 0, NULL, '2024-08-23 06:33:09', '2024-09-04 08:34:36', NULL, 0),
(42, 'Naufal', 'fian', '081234567', 'naufalfian@gmail.com', 'user', NULL, '2024-08-26 00:29:57', '$2y$10$HLJsFTZrGmb2GkBa6vTCVuWSybPj1KxqY/kQWw82ZN16DgnE8Jtmq', 120000, 'http://127.0.0.1:8000/upload/1725594245_profil3.jpg', 'Sukodono', 0, NULL, '2024-09-25 06:33:19', '2024-09-19 23:33:25', '2024-09-10 19:37:45', 0),
(45, 'zera', 'ansyah', '0812224567', 'akukurus22@gmail.com', 'user', NULL, '2024-09-02 22:10:53', '$2y$10$MRV/V9xXF9fWp8ZMuF7f9.vlsoHSBERShdYTUy883Qv5fvx2HGRnS', 3160000, NULL, 'Jl.Manggis', 0, NULL, '2024-09-01 06:33:41', '2024-09-13 22:07:10', NULL, 0),
(62, 'Yogi', 'Erdi', '0822381415', 'ythiflaini@gmail.com', 'user', '339754', '2024-09-22 23:30:49', '$2y$10$IAHiFjEq8oEBy/j3nAz2tuss9gnqbgdPxqOmOj/TLyLKNIy/hC8Um', 0, NULL, 'punggul gedangan', 0, NULL, '2024-09-22 23:29:57', '2024-09-23 00:36:25', NULL, 339754);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `account_requests`
--
ALTER TABLE `account_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indeks untuk tabel `topup_histories`
--
ALTER TABLE `topup_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `account_requests`
--
ALTER TABLE `account_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT untuk tabel `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `topup_histories`
--
ALTER TABLE `topup_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Ketidakleluasaan untuk tabel `topup_histories`
--
ALTER TABLE `topup_histories`
  ADD CONSTRAINT `topup_histories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
