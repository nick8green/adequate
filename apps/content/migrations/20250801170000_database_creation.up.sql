-- ------------------------------------
-- Create tables
-- ------------------------------------

CREATE TABLE IF NOT EXISTS `Config` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(255),
    PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Page` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS `Form` (
--     `id` INT(4) NOT NULL AUTO_INCREMENT,
--     PRIMARY KEY (`id`)
-- )
-- ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS `Type` (
--     `id` INT(4) NOT NULL AUTO_INCREMENT,
--     `name` VARCHAR(50) NOT NULL,
--     PRIMARY KEY (`id`)
-- )
-- ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS `PageType` (
--     `id` INT(4) NOT NULL AUTO_INCREMENT,
--     `page` INT(4) NOT NULL,
--     `type` INT(4) NOT NULL,
--     PRIMARY KEY (`id`),
--     FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (`type`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
-- )
-- ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Content` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `priority` INT NOT NULL,
    `page` INT(4) NOT NULL,
    `data` JSON NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE
)
ENGINE = InnoDB;

-- ------------------------------------
-- Populate
-- ------------------------------------

INSERT INTO `Config` (`name`, `value`) VALUES
    ('site_name', 'Adequate'),
    ('site_description', 'It does a job, it is Adequate.'),
    ('site_keywords', 'adequate, cms, content, management');

INSERT INTO `Page` (`slug`, `title`) VALUES
    ('home', 'Home'),
    ('about', 'About Adequate'),
    ('contact', 'Contact Us');

-- INSERT INTO `Type` (`id`, `name`) VALUES
--     (1, 'page'),
--     (2, 'blog');

INSERT INTO `Content` (`priority`, `page`, `data`) VALUES
    (1, 1, "{ \"title\": \"About Us\", \"description\": \"This is the about page.\", \"image\": \"/assets/images/coding.jpg\", \"side\": \"left\" }"),
    (2, 1, "{ \"content\": \"This is the about page content.\" }"),
    (1, 2, "{ \"title\": \"Contact Us\", \"description\": \"This is the contact page.\", \"image\": \"/assets/images/desk.jpg\", \"side\": \"right\" }");
