CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(100) NOT NULL,
    nickname VARCHAR(20) NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE post(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL
    user_id INT NOT NULL,
    --content XML NOT NULL,
    last_update TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE comment(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    last_update TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
    FOREIGN KEY(post_id) REFERENCES post(id)
);

CREATE TABLE post_like(
    user_id INT NOT NULL,
    post_id INT NOT NULL,

    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(post_id) REFERENCES post(id)
);

CREATE TABLE comment_like(
    user_id INT NOT NULL,
    comment_id INT NOT NULL,

    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(comment_id) REFERENCES comment(id)
);