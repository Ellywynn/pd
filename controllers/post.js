const db = require('../config/database');

class Post {
    async createPost(req, res) {
        try {
            const title = req.body.title;
            const content = req.body.editordata;
            const userId = loggedIn;
            const q = `INSERT INTO post(title, user_id, content)
                    VALUES('${title}', ${userId}, '${content}')`;
            const result = await db.query(q);
            res.redirect(`/user/${nickname}`);
        } catch(error) {
            console.error(error.sqlMessage);
        }
    }
    async createPostPage(req, res) {
        res.render('edit_post', {
            createPost: true
        });
    }
    async getOnePost(req, res) {
        const post_id = req.params.post_id;
        if(!post_id) {
            return res.render('notfound');
        }
        // информация о посте
        const q = `SELECT p.post_id, p.title, u.nickname AS author, p.content,
                DATE_FORMAT(p.last_update, '%d %M %Y at %h:%i:%s') AS last_update,
                COUNT(l.post_id) AS likes
                FROM post AS p INNER JOIN user AS u ON p.user_id = u.user_id
                INNER JOIN post_like AS l ON l.post_id = ${post_id}
                WHERE p.post_id = ${post_id}`;
        let result = await db.query(q);
        if(result[0].length > 0) {
            const post_id = result[0][0].post_id;
            const title = result[0][0].title;
            const author = result[0][0].author;
            const content = result[0][0].content;
            const likes = result[0][0].likes;
            const last_update = result[0][0].last_update;
            const q =
                  `SELECT c.content,
                   DATE_FORMAT(c.last_update, '%d %M %Y at %h:%i:%s') AS last_update,
                   u.nickname AS author, COUNT(cl.user_id) AS likes
                   FROM comment AS c
                   INNER JOIN user AS u ON u.user_id = c.user_id
                   LEFT JOIN comment_like AS cl ON cl.comment_id = c.comment_id
                   WHERE c.post_id = ${post_id}
                   GROUP BY c.content, c.last_update, author`;
            result = await db.query(q);
            const comments = result[0];
            res.render('post', {
                post_id,
                title,
                author,
                content,
                likes,
                comments,
                last_update
            });
        } else {
            return res.render('notfound');
        }
    }
    async editPost(req, res) {
        const post_id = req.params.post_id;
        await db.query(`UPDATE post
                        SET title = '${req.body.title}',
                            content = '${req.body.editordata}'
                        WHERE post_id = ${post_id}`);
        res.redirect(`/post/${post_id}`);
    }
    async editPostPage(req, res) {
        const post_id = req.params.post_id;
        const result = await db.query(`SELECT title, user_id, content
                                       FROM post
                                       WHERE post_id=${post_id}`);
        if(result[0].length > 0) {
            // если это чужой пост или нет прав
            if(result[0][0].user_id !== req.session.userId
                && (req.session.role !== 'owner' || req.session.role !== 'admin'
                || req.session.role !== 'moderator')) {
                return res.render('notfound', {
                    message: 'У вас нет прав на это действие'
                });
            } else {
                const postTitle = result[0][0].title;
                const postContent = result[0][0].content;
                res.render('edit_post', {
                    createPost: true,
                    postTitle,
                    postContent,
                    post_id
                });
            }
        } else {
            // there is no post with this id
            res.redirect('/');
        }
    }
    async deletePost(req, res) {
        const post_id = req.params.post_id;
        const result = await db.query(`SELECT user_id FROM post WHERE post_id=${post_id}`);
        if(result[0].length > 0) {
            // если это чужой пост и при этом нет прав
            if(result[0][0].user_id !== req.session.userId
                && (req.session.role !== 'owner' || req.session.role !== 'admin'
                || req.session.role !== 'moderator')) {
                return res.render('notfound', {
                    message: 'У вас нет прав на это действие'
                });
            } else {
                await db.query(`DELETE FROM post WHERE post_id=${post_id}`);
                res.redirect(`/user/${nickname}`);
            }
        } else {
            // there is no post with this id
            res.redirect('/');
        }
    }
}

module.exports = new Post();