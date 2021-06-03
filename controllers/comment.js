const db = require('../config/database');

class Comment {
    async addComment(req, res) {
        try {
            const post_id = req.params.post_id;
            let result = await db.query(`SELECT post_id FROM post WHERE post_id=${post_id}`);
            // если пост найден
            if(result[0].length > 0) {
                result = await db.query(`INSERT INTO comment(user_id, post_id, content)
                VALUES(${loggedIn}, ${post_id}, '${req.body.comment}')`);
                res.redirect(`/post/${post_id}`);
            } else {
                res.render('notfound', {
                    message: 'Пост не найден'
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
    async likeComment(req, res) {
        try {
            const comment_id = req.params.comment_id;
            const user_id = loggedIn;
            await db.query(`INSERT INTO comment_like(user_id, comment_id)
                VALUES(${user_id}, ${comment_id})`);
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
        }
    }
    async dislikeComment(req, res) {
        try {
            const comment_id = req.params.comment_id;
            const user_id = loggedIn;
            await db.query(`DELETE from comment_like
             WHERE user_id = ${user_id} AND comment_id = ${comment_id}`);
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
        }
    }
    async deleteComment(req, res) {
        try {
            const comment_id = req.params.comment_id;
            await db.query(`DELETE FROM comment WHERE comment_id = ${comment_id}`);
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new Comment();