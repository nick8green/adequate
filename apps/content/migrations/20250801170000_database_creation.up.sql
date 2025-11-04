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

-- TEMPORARY TABLE PENDING THE USER SERVICE
CREATE TABLE IF NOT EXISTS `User` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- END TEMPORARY TABLE --

CREATE TABLE IF NOT EXISTS `Audit` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user` INT(4) NOT NULL,
    `event` ENUM('ACCESS', 'CREATE', 'DELETE', 'PUBLISH', 'UPDATE') NOT NULL,
    `entity` ENUM('PAGE', 'POST') NOT NULL,
    `entityId` INT(4) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE -- This might need to be removed when there is a user service
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Post` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `page` INT(4) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`page`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------
-- Views
-- ------------------------------------

CREATE OR REPLACE VIEW `AuditHistory` AS
SELECT
    `a`.`entityId` AS `id`,
    `a`.`timestamp`,
    `a`.`user`,
    `a`.`action`,
    `a`.`entity`
FROM
    `Audit` AS `a`
ORDER BY
    `a`.`timestamp` DESC;

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
            CASE
                WHEN LOCATE('/', REVERSE(`p`.`slug`)) > 0 THEN
                    LEFT(`p`.`slug`, LENGTH(`p`.`slug`) - LOCATE('/', REVERSE(`p`.`slug`)))
                ELSE NULL
            END AS `parent_slug`,
            `parent`.`title` AS `parent_title`,
            `parent`.`uuid` AS `parent_id`
        FROM
            `Page` AS `p` LEFT JOIN `Page` AS `parent`
                ON `parent`.`slug` = CASE
                    WHEN LOCATE('/', REVERSE(`p`.`slug`)) > 0 THEN
                        LEFT(`p`.`slug`, LENGTH(`p`.`slug`) - LOCATE('/', REVERSE(`p`.`slug`)))
                ELSE NULL
            END
        WHERE `p`.`slug` LIKE '%/%'
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
            ON `p`.`id` = `nav`.`page`
    ORDER BY
        `p`.`id` ASC;

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
    (1, '/', 'Home'),
    (2, '/about', 'About Adequate'),
    (3, '/contact', 'Contact Us'),
    (4, '/about/me', 'About Me'),
    (5, '/blog', 'My Blog'),
    (6, '/cookies', 'Cookies');

INSERT INTO
    `PageNavigation` (`page`, `navigation`, `priority`)
VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3),
    (4, 1, 4),
    (5, 1, 5),
    (1, 2, 1),
    (3, 2, 3),
    (6, 2, 2);

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
    (4, 1),
    (5, 2),
    (6, 1);

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
    ),
    (
        2,
        1,
        "{ \"display\": \"horizontal\", \"dateFormat\": \"MMMM YYYY\", \"events\": [ { \"title\": \"Event One\", \"date\": \"2025-08-21\", \"content\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non erat sodales, gravida ex et, tempus sapien. Integer dignissim faucibus metus id cursus. Duis cursus erat a tellus ornare, ut molestie massa tincidunt. In viverra, diam sed fringilla tempus, justo nulla vestibulum felis, at imperdiet leo magna ac metus. Nunc facilisis rutrum diam, ut eleifend nunc efficitur semper. Nam arcu massa, fringilla at semper dapibus, volutpat at arcu. Integer est urna, consequat vel est a, consequat vulputate leo. Nulla ut risus at elit rhoncus mollis vel in magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\" }, { \"date\": \"2025-08-22\", \"content\": \"Maecenas sodales volutpat leo, ac mattis arcu blandit id. Cras aliquam dapibus sem non tempus. Vivamus vitae dolor eget velit fringilla bibendum quis et sem. Curabitur accumsan bibendum elit molestie interdum. Donec pellentesque neque et pharetra tempor. Maecenas ullamcorper quis justo at fringilla. Aenean id interdum diam, a sodales nisl. Suspendisse sed diam eu leo consectetur rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec venenatis urna dapibus ullamcorper ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras vitae nunc feugiat, eleifend turpis vel, hendrerit turpis.\", \"tag\": \"In Progress\", \"link\": \"https://example.com\" }, { \"title\": \"Event Three\", \"date\": \"2025-08-23\", \"content\": \"Cras sem sem, maximus nec sem et, congue suscipit nunc. Integer mattis luctus dui in facilisis. Morbi eget eros eget urna dictum hendrerit. Aliquam pharetra urna a posuere rutrum. Morbi ac urna sed risus eleifend scelerisque et nec turpis. Aliquam erat volutpat. Praesent vehicula dictum nulla tristique aliquam.\", \"tag\": \"Completed\" } ] }"
    ),
    (
        1,
        1,
        "{ \"content\": \"# About Me\\n\\nThis is the about me page content.\\n\\nIt uses **Markdown**!\" }"
    ),
    (
        4,
        1,
        "{ \"content\": \"# Blog\\n\\nSomething about my blog.\\n\\nIt uses **Markdown**!\" }"
    ),
    (
        3,
        1,
        "{ \"content\": \"to see more [click here](/timline)\" }"
    );

INSERT INTO
    `User` (`id`, `name`, `username`)
VALUES
    (1, 'System Admin', 'admin');

INSERT INTO 
    `Post` (`id`, `page`, `title`, `excerpt`, `slug`, `content`)
VALUES
    (1, 5, 'First Blog Post', 'This is the excerpt for the first blog post.', 'first-blog-post', 'This is the content for the first blog post.'),
    (2, 5, 'Second Blog Post', 'This is the excerpt for the second blog post.', 'second-blog-post', 'This is the content for the second blog post.'),
    (3, 5, 'Third Blog Post', 'This is the excerpt for the third blog post.', 'third-blog-post', 'This is the content for the third blog post.');

INSERT INTO
    `Audit` (`user`, `event`, `entity`, `entityId`)
VALUES
    (1, 'CREATE', 'USER', 1),
    (1, 'CREATE', 'PAGE', 1),
    (1, 'CREATE', 'PAGE', 2),
    (1, 'CREATE', 'PAGE', 3),
    (1, 'CREATE', 'PAGE', 4),
    (1, 'PUBLISH', 'PAGE', 1),
    (1, 'PUBLISH', 'PAGE', 2),
    (1, 'PUBLISH', 'PAGE', 3),
    (1, 'PUBLISH', 'PAGE', 4),
    (1, 'CREATE', 'POST', 1),
    (1, 'CREATE', 'POST', 2),
    (1, 'CREATE', 'POST', 3),
    (1, 'PUBLISH', 'POST', 1),
    (1, 'PUBLISH', 'POST', 2),
    (1, 'PUBLISH', 'POST', 3);
