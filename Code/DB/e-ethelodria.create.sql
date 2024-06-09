DROP DATABASE IF EXISTS `e-super-ethelodria`;

-- Creating a new database
CREATE DATABASE `e-super-ethelodria`;
USE `e-super-ethelodria`;

CREATE TABLE location
(
    id               BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    latitude         DOUBLE,
    longitude        DOUBLE,
    distance_to_base DOUBLE
);

CREATE TABLE users
(
    id          BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    username    VARCHAR(255)                         NOT NULL,
    password    VARCHAR(255)                         NOT NULL,
    role        ENUM ('ADMIN', 'RESCUER', 'CITIZEN') NOT NULL,
    full_name   VARCHAR(255),
    email       VARCHAR(255)                         NOT NULL,
    phone       VARCHAR(20)                          NOT NULL,
    location_id BINARY(16),
    FOREIGN KEY (location_id) REFERENCES location (id)
);

CREATE TABLE product_category
(
    id   BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE product
(
    id             BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    quantity       INT          NOT NULL DEFAULT 0,
    offer_quantity INT          NOT NULL DEFAULT 2,
    category_id    BINARY(16)          NOT NULL,
    FOREIGN KEY (category_id) REFERENCES product_category (id)
);

CREATE TABLE product_details
(
    id      BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name    VARCHAR(255) NOT NULL,
    value   VARCHAR(255) NOT NULL,
    product_id BINARY(16),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

CREATE TABLE request
(
    id               BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    citizen_id       BINARY(16),
    rescuer_id       BINARY(16),
    product_id       BINARY(16),
    number_of_people INT NOT NULL,
    quantity         INT, -- TRIGGER: BEFORE INSERT quantity = number_of_people * product.offer_quantity
    status           ENUM ('PENDING','ASSUMED', 'COMPLETED') DEFAULT 'PENDING',
    created_at       DATETIME                      DEFAULT CURRENT_TIMESTAMP,
    assumed_at       DATETIME,
    completed_at     DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES product (id),
    FOREIGN KEY (rescuer_id) REFERENCES users (id)
);

CREATE TABLE announcement
(
    id                BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name              VARCHAR(255) NOT NULL,
    description       TEXT,
    announcement_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements_needs
(
    id              BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    announcement_id BINARY(16) NOT NULL,
    product_id      BINARY(16) NOT NULL,
    FOREIGN KEY (announcement_id) REFERENCES announcement (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

CREATE TABLE offer
(
    id              BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    citizen_id      BINARY(16),
    rescuer_id      BINARY(16),
    product_id      BINARY(16),
    announcement_id BINARY(16),
    quantity        INT,
    status          ENUM ('PENDING','ASSUMED', 'COMPLETED') DEFAULT 'PENDING',
    created_at      DATETIME                      DEFAULT CURRENT_TIMESTAMP,
    assumed_at      DATETIME,
    completed_at    DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES product (id),
    FOREIGN KEY (rescuer_id) REFERENCES users (id),
    FOREIGN KEY (announcement_id) REFERENCES announcement (id)
);

CREATE TABLE rescue_vehicle
(
    id         BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    type       ENUM('PERSONAL USE','VAN','PICKUP TRUCK') NOT NULL,
    status     ENUM ('WAITING', 'ACTIVE' ,'UNAVAILABLE') DEFAULT 'WAITING',
    active_tasks INT DEFAULT 0,
    rescuer_id BINARY(16),
    FOREIGN KEY (rescuer_id) REFERENCES users (id)
);

CREATE TABLE rescuer_inventory
(
    id         BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    rescuer_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    amount     INT DEFAULT 0,
    UNIQUE INDEX idx_rescuer_product (rescuer_id, product_id), -- Add composite unique index
    FOREIGN KEY (rescuer_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

-- Create the trigger
DELIMITER $$

CREATE TRIGGER before_insert_product
BEFORE INSERT ON product
FOR EACH ROW
BEGIN
    IF NEW.quantity IS NULL THEN
        SET NEW.quantity = 0;
    END IF;
    IF NEW.offer_quantity IS NULL THEN
        SET NEW.offer_quantity = 2;
    END IF;
END$$

DELIMITER ;
