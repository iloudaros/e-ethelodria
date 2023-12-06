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
  `longitude` float,
  `latitude` float,
  `is_admin` boolean DEFAULT false,
  `is_diasostis` boolean DEFAULT false,
  `is_citizen` boolean DEFAULT false
) COMMENT = 'The table where user information and their role is stored.';

CREATE TABLE `Category` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) 
);

CREATE TABLE `Product` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `category` integer,
  FOREIGN KEY (`category`) REFERENCES `Category` (`id`)
);

CREATE TABLE `Base` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `admin` binary(16),
  `longitude` float,
  `latitude` float,
  FOREIGN KEY (`admin`) REFERENCES `User` (`id`)
);

CREATE TABLE `Announcement` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `published_in` date,
  `text` varchar(255)
);

CREATE TABLE `Vehicle` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `username` varchar(255),
  `owner` binary(16),
  `katastasi` varchar(255),
  FOREIGN KEY (`owner`) REFERENCES `User` (`id`)
);

CREATE TABLE `Task` (
  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `citizen` binary(16),
  `date_in` date,
  `accepted_in` date,
  `date_out` date,
  `state` ENUM ('published', 'pending', 'done'),
  `type` ENUM ('request', 'offering'),
  FOREIGN KEY (`citizen`) REFERENCES `User` (`id`)
);

CREATE TABLE `Announcement_List` (
  `id` binary(16),
  `announcement` binary(16),
  FOREIGN KEY (`id`) REFERENCES `Base` (`id`),
  FOREIGN KEY (`announcement`) REFERENCES `Announcement` (`id`)
);

CREATE TABLE `Product_List` (
  `id` binary(16),
  `product` integer,
  `quantity` integer,
  FOREIGN KEY (`id`) REFERENCES `Base` (`id`),
  FOREIGN KEY (`product`) REFERENCES `Product` (`id`)
);

CREATE TABLE `Task_List` (
  `id` binary(16),
  `task` binary(16),
  FOREIGN KEY (`id`) REFERENCES `User` (`id`),
  FOREIGN KEY (`task`) REFERENCES `Task` (`id`)
);

CREATE TABLE `Details` (
  `product` integer,
  `name` varchar(255),
  `value` varchar(255),
  FOREIGN KEY (`product`) REFERENCES `Product` (`id`)
);


