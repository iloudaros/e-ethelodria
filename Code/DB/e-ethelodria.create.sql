-- Dropping the existing database if it exists
DROP DATABASE IF EXISTS `e-ethelodria`;

-- Creating a new database
CREATE DATABASE `e-ethelodria`;

-- Using the newly created database
USE `e-ethelodria`;

-- Creating tables
CREATE TABLE `User` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `email` varchar(255),
  `telephone` varchar(15),
  `name` varchar(255),
  `surname` varchar(255),
  `longtitude` float,
  `latitude` float,
  `is_admin` boolean DEFAULT false,
  `is_diasostis` boolean DEFAULT false,
  `is_citizen` boolean DEFAULT false
);

CREATE TABLE `Base` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `admin` binary(16),
  `longtitude` float,
  `latitude` float
);

CREATE TABLE `Announcement_List` (
  `id` binary(16),
  `announcement` binary(16)
);

CREATE TABLE `Product_List` (
  `id` binary(16),
  `product` integer,
  `quantity` integer
);

CREATE TABLE `Task_List` (
  `id` binary(16),
  `task` binary(16)
);

CREATE TABLE `Product` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `category` integer
);

CREATE TABLE `Details` (
  `product` integer,
  `name` varchar(255),
  `value` varchar(255)
);

CREATE TABLE `Category` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `Vehicle` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `owner` binary(16),
  `longtitude` float,
  `latitude` float,
  `state` ENUM ('loading', 'free', 'offloading')
);

CREATE TABLE `Task` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `user_id` binary(16),
  `date_in` date,
  `accepted_in` date,
  `date_out` date,
  `state` ENUM ('published', 'pending', 'done'),
  `type` ENUM ('request', 'offering')
);

CREATE TABLE `Announcement` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `published_in` date,
  `text` varchar(255)
);

ALTER TABLE `User` COMMENT = 'The table where user information and their role is stored.';

ALTER TABLE `Base` ADD FOREIGN KEY (`admin`) REFERENCES `User` (`id`);

ALTER TABLE `Announcement_List` ADD FOREIGN KEY (`id`) REFERENCES `Base` (`id`);

ALTER TABLE `Announcement_List` ADD FOREIGN KEY (`announcement`) REFERENCES `Announcement` (`id`);

ALTER TABLE `Product_List` ADD FOREIGN KEY (`product`) REFERENCES `Product` (`id`);

ALTER TABLE `Task_List` ADD FOREIGN KEY (`task`) REFERENCES `Task` (`id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`category`) REFERENCES `Category` (`id`);

ALTER TABLE `Details` ADD FOREIGN KEY (`product`) REFERENCES `Product` (`id`);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`owner`) REFERENCES `User` (`id`);

ALTER TABLE `Task` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
