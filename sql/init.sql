CREATE TABLE IF NOT EXISTS `role` (
    role_id TINYINT(1) NOT NULL AUTO_INCREMENT,
    role VARCHAR(20) NOT NULL,

    PRIMARY KEY(role_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `user` (
    user_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_path VARCHAR(100) NOT NULL DEFAULT 'default.png',
    nickname VARCHAR(40) NOT NULL,
    role TINYINT(1) NOT NULL DEFAULT 25, -- default role
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id),

    FOREIGN KEY(role)
    REFERENCES role(role_id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `post` (
    post_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL, -- post content (stored like innerHTML)
    last_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(post_id),

    FOREIGN KEY(user_id)
    REFERENCES user(user_id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `comment` (
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    last_update TIMESTAMP NOT NULL,

    PRIMARY KEY(comment_id),

    FOREIGN KEY(user_id)
    REFERENCES user(user_id),

    FOREIGN KEY(post_id)
    REFERENCES post(post_id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `post_like` (
    user_id INT NOT NULL,
    post_id INT NOT NULL,

    FOREIGN KEY(user_id)
    REFERENCES user(user_id),

    FOREIGN KEY(post_id)
    REFERENCES post(post_id)
    ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `comment_like` (
    user_id INT,
    comment_id INT,

    FOREIGN KEY(user_id)
    REFERENCES user(user_id),

    FOREIGN KEY(comment_id)
    REFERENCES comment(comment_id)
    ON DELETE CASCADE
) ENGINE=INNODB;

INSERT INTO role (role) VALUES('owner');
INSERT INTO role (role) VALUES('admin');
INSERT INTO role (role) VALUES('default');
INSERT INTO role (role) VALUES('moderator');