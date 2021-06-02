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
            
        }
    }
    async likeComment(req, res) {
        const comment_id = req.params.comment_id;
        
    }
    async dislikeComment(req, res) {
        const comment_id = req.params.comment_id;

    }
}

module.exports = new Comment();