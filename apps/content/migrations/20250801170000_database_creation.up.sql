-- ------------------------------------
-- Create tables
-- ------------------------------------
CREATE TABLE IF NOT EXISTS `Config` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(255),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Page` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `uuid` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS `Form` (
--     `id` INT(4) NOT NULL AUTO_INCREMENT,
--     PRIMARY KEY (`id`)
-- )
-- ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Type` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `PageType` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `page` INT(4) NOT NULL,
    `type` INT(4) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`type`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Content` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `priority` INT NOT NULL,
    `page` INT(4) NOT NULL,
    `data` JSON NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------
-- Views
-- ------------------------------------

CREATE OR REPLACE VIEW `Pages` AS
WITH RECURSIVE slug_parts AS (
    SELECT
        `p`.`id`,
        `p`.`slug`,
        `p`.`uuid`,
        SUBSTRING_INDEX(`p`.`slug`, '/', 1) AS `current_slug`,
        SUBSTRING_INDEX(`p`.`slug`, '/', 1) AS `part`,
        SUBSTRING(`p`.`slug`, LENGTH(SUBSTRING_INDEX(`p`.`slug`, '/', 1)) + 2) AS `remainder`,
        (SELECT `title` FROM `Page` WHERE `slug` = SUBSTRING_INDEX(`p`.`slug`, '/', 1)) AS `meta_title`,
        1 AS `depth`
    FROM
        `Page` AS `p`
    WHERE
        `p`.`slug` != ''
    UNION ALL
    SELECT
        `sp`.`id`,
        `sp`.`slug`,
        `sp`.`uuid`,
        SUBSTRING_INDEX(`sp`.`slug`, '/', `sp`.`depth` + 1) AS `current_slug`,
        SUBSTRING_INDEX(`sp`.`remainder`, '/', 1) AS `part`,
        SUBSTRING(`sp`.`remainder`, LENGTH(SUBSTRING_INDEX(`sp`.`remainder`, '/', 1)) + 2) AS `remainder`,
        CONCAT(
            `sp`.`meta_title`,
            (SELECT `value` FROM `Config` WHERE `name` = 'TITLE_SEPARATOR'),
            (SELECT `title` FROM `Page` WHERE `slug` = SUBSTRING_INDEX(`sp`.`slug`, '/', `sp`.`depth` + 1))
        ) AS `meta_title`,
        `sp`.`depth` + 1 AS `depth`
    FROM
        `slug_parts` AS `sp`
    WHERE
        `sp`.`remainder` != ''
    )
    SELECT
        `p`.`id`,
        `p`.`slug`,
        `p`.`uuid`,
        `p`.`title`,
        CONCAT(
            (SELECT `value` FROM `Config` WHERE `name` = 'SITE_TITLE'),
            (SELECT `value` FROM `Config` WHERE `name` = 'TITLE_SEPARATOR'),
            COALESCE(`sp`.`meta_title`, `p`.`title`)
        ) AS `meta_title`,
        `p`.`meta_description`,
        `t`.`name` AS `type`
    FROM
        `Page` AS `p` LEFT JOIN (
            SELECT
                `id`,
                MAX(`meta_title`) AS `meta_title`
            FROM `slug_parts`
            WHERE `remainder` = ''
            GROUP BY `id`
        ) AS `sp` ON `p`.`id` = `sp`.`id`
        JOIN `PageType` AS `pt`
            ON `p`.`id` = `pt`.`page`
        JOIN `Type` AS `t`
            ON `pt`.`type` = `t`.`id`;

-- ------------------------------------
-- Populate
-- ------------------------------------

INSERT INTO
    `Config` (`name`, `value`)
VALUES
    ('SITE_TITLE', 'Adequate'),
    ('SITE_DESCRIPTION', 'It does a job, it is Adequate.'),
    ('SITE_KEYWORD', 'adequate'),
    ('SITE_KEYWORD', 'cms'),
    ('SITE_KEYWORD', 'content'),
    ('SITE_KEYWORD', 'management'),
    ('SITE_LANGUAGE', 'en'),
    ('SITE_OWNER', 'N8G'),
    ('BRAND', 'n8g'),
    ('THEME', ''),
    ('TITLE_SEPARATOR', ' | ');

INSERT INTO
    `Page` (`slug`, `title`)
VALUES
    ('', 'Home'),
    ('about', 'About Adequate'),
    ('contact', 'Contact Us'),
    ('about/me', 'About Me');

INSERT INTO
    `Type` (`id`, `name`)
VALUES
    (1, 'page'),
    (2, 'blog'),
    (3, 'page'),
    (4, 'page');

INSERT INTO
    `PageType` (`page`, `type`)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1);

INSERT INTO
    `Content` (`priority`, `page`, `data`)
VALUES
    (
        1,
        2,
        "{ \"title\": \"About Us\", \"description\": \"This is the about page.\", \"image\": \"/assets/images/coding.jpg\", \"side\": \"left\" }"
    ),
    (
        2,
        2,
        "{ \"content\": \"This is the about page content.\" }"
    ),
    (
        1,
        3,
        "{ \"title\": \"Contact Us\", \"description\": \"This is the contact page.\", \"image\": \"/assets/images/desk.jpg\", \"side\": \"right\" }"
    );