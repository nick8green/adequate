CREATE USER IF NOT EXISTS 'content-service-migrate'@'%' IDENTIFIED WITH caching_sha2_password BY 'migrate';
CREATE USER IF NOT EXISTS 'content-service-read'@'%' IDENTIFIED WITH caching_sha2_password BY 'reader';
CREATE USER IF NOT EXISTS 'content-service-write'@'%' IDENTIFIED WITH caching_sha2_password BY 'writer';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS `content`;

GRANT
    ALTER,
    ALTER ROUTINE,
    CREATE,
    CREATE ROUTINE,
    CREATE VIEW,
    DELETE,
    DROP,
    EXECUTE,
    INDEX,
    INSERT,
    REFERENCES,
    SELECT,
    UPDATE
ON `content`.* TO 'content-service-migrate'@'%';
GRANT EXECUTE, SELECT ON `content`.* TO 'content-service-read'@'%';
GRANT DELETE, EXECUTE, INSERT, SELECT, UPDATE ON `content`.* TO 'content-service-write'@'%';

CREATE TABLE IF NOT EXISTS `content`.`SchemaMigrations` (
    `stamp` VARCHAR(14) NOT NULL,
    `dirty` BOOLEAN NOT NULL DEFAULT FALSE
)
ENGINE = InnoDB;

INSERT INTO `content`.`SchemaMigrations`
    (`stamp`)
VALUES
    ('0');