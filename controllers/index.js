const db = require('../config/database');

class IndexController {
    async index(req, res, next) {
        try {
            let posts = [];
            // информация о посте
            const q = `
            SELECT p.post_id, p.title, u.nickname AS author, p.content,
            u.avatar_path AS avatar_path,
            DATE_FORMAT(p.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
            COUNT(l.post_id) AS likes, COUNT(c.user_id) AS comments
            FROM post AS p 
            LEFT JOIN user AS u ON p.user_id = u.user_id
            LEFT JOIN post_like AS l ON l.post_id = p.post_id
            LEFT JOIN comment AS c ON p.post_id = c.post_id
            GROUP BY p.post_id, p.title, author, p.content, last_update
            ORDER BY last_update`;

            let result = await db.query(q);
            // если посты есть
            for(let i = 0; i < result[0].length; i++) {
                const post_id = result[0][i].post_id;
                const title = result[0][i].title;
                const author = result[0][i].author;
                const content = result[0][i].content;
                const likes = result[0][i].likes;
                const last_update = result[0][i].last_update;
                const comments = result[0][i].comments;

                let avatar_path = result[0][i].avatar_path;

                if(avatar_path !== 'default.png') {
                    avatar_path = '/users/' + avatar_path;
                } else {
                    avatar_path = '/' + avatar_path;
                }

                const post = {
                    post_id,
                    title,
                    author,
                    avatar_path,
                    content,
                    likes,
                    comments,
                    last_update
                };;
                posts.push(post);
            }
            res.render('index', {
                posts
            });
        } catch(error) {
            console.error(error);
            res.render('notfound');
        }
    }
}

module.exports = new IndexController();