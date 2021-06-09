const db = require('../config/database');
const tools = require('../tools/tools');

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
        const post_id = parseInt(req.params.post_id);
        if(!post_id) {
            return res.render('notfound');
        }
        // информация о посте
        const q = ` SELECT p.post_id, p.title, u.nickname AS author, p.content,
                    DATE_FORMAT(p.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
                    u.avatar_path AS avatar_path,
                    COUNT(l.user_id) AS likes
                    FROM post AS p 
                    LEFT JOIN user AS u ON p.user_id = u.user_id
                    LEFT JOIN post_like AS l ON p.post_id = l.post_id
                    WHERE p.post_id = ${post_id}
                    GROUP BY p.title, p.post_id, author, p.content, last_update, avatar_path`;

        let result = await db.query(q);

        if(result[0].length > 0) {
            let post = await tools.getPosts(result);
            post = post[0];

            let q =
                  `SELECT c.comment_id, c.content,
                   DATE_FORMAT(c.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
                   u.nickname AS author, u.avatar_path AS avatar_path,
                   COUNT(cl.user_id) AS likes
                   FROM comment AS c
                   INNER JOIN user AS u ON u.user_id = c.user_id
                   LEFT JOIN comment_like AS cl ON cl.comment_id = c.comment_id
                   WHERE c.post_id = ${post_id}
                   GROUP BY c.content, c.last_update, author, avatar_path`;
            result = await db.query(q);
            let comments = result[0];

            for(let comment of comments) { 
                comment.avatar_path = tools.validateAvatar(comment.avatar_path);
                comment.isLiked = await tools.isCommentLiked(comment.comment_id);
            };

            res.render('post', {
                post_id: post.post_id,
                title: post.title,
                author: post.author,
                content: post.content,
                likes: post.likes,
                liked: post.liked,
                avatar_path: post.avatar_path,
                last_update: post.last_update,
                commentCount: comments.length,
                comments,
            });
        } else {
            return res.render('notfound', {
                message: "ERROR #404: Пост не найден"
            });
        }
    }
    async getAllPosts(req, res) {
        const q = ` SELECT p.post_id, p.title, u.nickname AS author, p.content,
                    DATE_FORMAT(p.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
                    u.avatar_path AS avatar_path,
                    COUNT(l.post_id) AS likes,
                    COUNT(c.user_id) AS comments
                    FROM post AS p 
                    LEFT JOIN user AS u ON p.user_id = u.user_id
                    LEFT JOIN post_like AS l ON p.post_id = l.post_id
                    LEFT JOIN comment AS c ON p.post_id = c.post_id
                    GROUP BY p.title, p.post_id, author, p.content, last_update, avatar_path
                    ORDER BY last_update DESC`;

        let result = await db.query(q);

        const posts = await tools.getPosts(result);

        return res.json(posts);
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
    async likePost(req, res) {
        try {
            const post_id = req.params.post_id;
            if(!post_id) return res.sendStatus(403);

            const result = await db.query(`SELECT post_id FROM post_like
            WHERE post_id = ${post_id} AND user_id = ${loggedIn}`);

            if(result[0].length > 0) return res.sendStatus(403);

            await db.query(`INSERT INTO post_like (user_id, post_id) 
                                        VALUES(${loggedIn}, ${post_id})`);
            
            res.sendStatus(200);
        } catch(error) {
            console.error(error);
        }
    }
    async dislikePost(req, res) {
        try {
            const post_id = req.params.post_id;
            if(!post_id) throw new Error('post_id is not valid');

            await db.query(`DELETE FROM post_like 
                            WHERE user_id = ${loggedIn} AND post_id = ${post_id}`);
            
            res.sendStatus(200);
        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = new Post();