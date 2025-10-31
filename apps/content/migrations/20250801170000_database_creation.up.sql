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
    `tags` VARCHAR(255) DEFAULT NULL,
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
    `page` INT(4) NOT NULL,
    `type` INT(4) NOT NULL,
    PRIMARY KEY (`page`, `type`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`type`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Content` (
    `priority` INT NOT NULL,
    `page` INT(4) NOT NULL,
    `data` JSON NOT NULL,
    PRIMARY KEY (`page`, `priority`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Navigation` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `PageNavigation` (
    `page` INT(4) NOT NULL,
    `navigation` INT(4) NOT NULL,
    `priority` INT(4) NOT NULL,
    PRIMARY KEY (`page`, `navigation`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`navigation`) REFERENCES `Navigation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------
-- Views
-- ------------------------------------

CREATE OR REPLACE VIEW `Pages` AS
WITH RECURSIVE `slug_parts` AS (
    SELECT
        `p`.`id`,
        `p`.`slug`,
        `p`.`uuid`,
        SUBSTRING(`p`.`slug`, LENGTH(SUBSTRING_INDEX(`p`.`slug`, '/', 1)) + 2) AS `remainder`,
        (SELECT `title` FROM `Page` WHERE `slug` = SUBSTRING_INDEX(`p`.`slug`, '/', 1)) AS `meta_title`
    FROM
        `Page` AS `p`
    WHERE
        `p`.`slug` != ''
    UNION ALL
    SELECT
        `sp`.`id`,
        `sp`.`slug`,
        `sp`.`uuid`,
        SUBSTRING(`sp`.`remainder`, LENGTH(SUBSTRING_INDEX(`sp`.`remainder`, '/', 1)) + 2) AS `remainder`,
        CONCAT(
            `sp`.`meta_title`,
            (SELECT `value` FROM `Config` WHERE `name` = 'TITLE_SEPARATOR'),
            (SELECT `title` FROM `Page` WHERE `slug` = SUBSTRING_INDEX(`sp`.`slug`, '/', (LENGTH(`sp`.`slug`) - LENGTH(REPLACE(`sp`.`remainder`, '/', '')) / LENGTH('/')) + 1))
        ) AS `meta_title`
    FROM
        `slug_parts` AS `sp`
    WHERE
        `sp`.`remainder` != ''
    ),
    `parent_lookup` AS (
        SELECT
            `id`,
            `slug`,
            SUBSTRING_INDEX(`slug`, '/', -2) AS `parent_slug`
        FROM
            `Page`
        WHERE
            `slug` LIKE '%/%'
    ),
    `parent_join` AS (
        SELECT
            `p`.`id`,
            `p`.`slug`,
            SUBSTRING_INDEX(`p`.`slug`, '/', -2) AS `parent_slug`,
            `parent`.`title` AS `parent_title`,
            `parent`.`uuid` AS `parent_id`
        FROM
            `Page` AS `p`
            LEFT JOIN `Page` AS `parent`
                ON `parent`.`slug` = SUBSTRING_INDEX(`p`.`slug`, '/', -2)
        WHERE
            `p`.`slug` LIKE '%/%'
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
        `t`.`name` AS `type`,
        `pj`.`parent_id`,
        `pj`.`parent_slug`,
        `pj`.`parent_title`,
        `nav`.`navigation_types`,
        `nav`.`navigation_priorities`,
        `p`.`tags`
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
            ON `pt`.`type` = `t`.`id`
        LEFT JOIN `parent_join` AS `pj`
            ON `p`.`id` = `pj`.`id`
        LEFT JOIN (
            SELECT
                `pn`.`page`,
                GROUP_CONCAT(`n`.`type` ORDER BY `pn`.`priority` SEPARATOR ',') AS `navigation_types`,
                GROUP_CONCAT(`pn`.`priority` ORDER BY `pn`.`priority` SEPARATOR ',') AS `navigation_priorities`
            FROM
                `PageNavigation` AS `pn`
                JOIN `Navigation` AS `n`
                    ON `pn`.`navigation` = `n`.`id`
            GROUP BY
                `pn`.`page`
        ) AS `nav`
            ON `p`.`id` = `nav`.`page`;

CREATE OR REPLACE VIEW `PageElement` AS
    SELECT
        `c`.`priority`,
        `c`.`data`,
        `p`.`uuid` as `page`
    FROM
        `Content` AS `c` JOIN `Page` AS `p`
            ON `c`.`page` = `p`.`id`;

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
    `Navigation` (`id`, `type`)
VALUES
    (1, 'HEADER'),
    (2, 'FOOTER');

INSERT INTO
    `Page` (`id`, `slug`, `title`)
VALUES
    (1, '', 'Home'),
    (2, 'about', 'About Adequate'),
    (3, 'contact', 'Contact Us'),
    (4, 'about/me', 'About Me');

INSERT INTO
    `PageNavigation` (`page`, `navigation`, `priority`)
VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3),
    (4, 1, 4),
    (1, 2, 1),
    (3, 2, 3);

INSERT INTO
    `Type` (`id`, `name`)
VALUES
    (1, 'page'),
    (2, 'blog');

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