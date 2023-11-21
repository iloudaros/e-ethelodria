DROP DATABASE IF EXISTS `e-ethelodria`;
CREATE DATABASE `e-ethelodria`;
USE `e-ethelodria`;

CREATE TABLE `User` (
  `username` varchar(255) PRIMARY KEY,
  `password` varchar(255),
  `email` varchar(255),
  `telephone` varchar(15),
  `Name` varchar(255),
  `Surname` varchar(255),
  `is_admin` boolean DEFAULT false,
  `is_diasostis` boolean DEFAULT false,
  `is_citizen` boolean DEFAULT false,
  `tasks` integer
);

CREATE TABLE `Base` (
  `admin` varchar(255),
  `longtitude` float,
  `latitude` float,
  `announcements` integer,
  `inventory` integer
);

CREATE TABLE `Announcement` (
  `id` integer,
  `published_in` date,
  `needs` integer,
  `text` varchar(255)
);

CREATE TABLE `Announcement_List` (
  `id` integer,
  `announcement` integer
);

CREATE TABLE `Product_List` (
  `id` integer,
  `product` integer,
  `quantity` integer
);

CREATE TABLE `Product` (
  `id` integer,
  `name` varchar(255),
  `category` integer
);

CREATE TABLE `Details` (
  `product` integer,
  `name` varchar(255),
  `value` varchar(255)
);

CREATE TABLE `Category` (
  `name` varchar(255),
  `id` integer
);

CREATE TABLE `Task` (
  `id` integer,
  `citizen` varchar(255),
  `list` integer COMMENT 'Αν το είδος του Task είναι request, η λίστα μπορεί να περιέχει μόνο ένα είδος προϊόντος.',
  `date_in` date,
  `accepted_in` date,
  `date_out` date,
  `state` ENUM ('published', 'pending', 'done'),
  `type` ENUM ('request', 'offering')
);

CREATE TABLE `Vehicle` (
  `username` varchar(255),
  `owner` varchar(255),
  `load` integer,
  `katastasi` varchar(255),
  `tasks` integer
);

CREATE TABLE `Task_List` (
  `id` integer,
  `task` integer
);

ALTER TABLE `User` ADD FOREIGN KEY (`tasks`) REFERENCES `Task_List` (`id`);

ALTER TABLE `Base` ADD FOREIGN KEY (`admin`) REFERENCES `User` (`username`);

ALTER TABLE `Announcement_List` ADD FOREIGN KEY (`id`) REFERENCES `Base` (`announcements`);

ALTER TABLE `Product_List` ADD FOREIGN KEY (`id`) REFERENCES `Base` (`inventory`);

ALTER TABLE `Product_List` ADD FOREIGN KEY (`id`) REFERENCES `Announcement` (`needs`);

ALTER TABLE `Announcement_List` ADD FOREIGN KEY (`announcement`) REFERENCES `Announcement` (`id`);

ALTER TABLE `Product_List` ADD FOREIGN KEY (`product`) REFERENCES `Product` (`id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`category`) REFERENCES `Category` (`id`);

ALTER TABLE `Details` ADD FOREIGN KEY (`product`) REFERENCES `Product` (`id`);

ALTER TABLE `Task` ADD FOREIGN KEY (`id`) REFERENCES `Task_List` (`task`);

ALTER TABLE `Task` ADD FOREIGN KEY (`citizen`) REFERENCES `User` (`username`);

ALTER TABLE `Product_List` ADD FOREIGN KEY (`id`) REFERENCES `Task` (`list`);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`owner`) REFERENCES `User` (`username`);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`load`) REFERENCES `Product_List` (`id`);

ALTER TABLE `Task_List` ADD FOREIGN KEY (`id`) REFERENCES `Vehicle` (`tasks`);

ALTER TABLE `User` COMMENT = 'The table where user information and their role is stored.';
