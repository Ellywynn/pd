const db = require('../config/database');
const {getPosts} = require('../tools/tools');

class IndexController {
    async index(req, res, next) {
        try {
            // информация о посте
            const q = `
            SELECT p.post_id, p.title, u.nickname AS author, p.content,
            u.avatar_path AS avatar_path,
            DATE_FORMAT(p.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
            COUNT(l.post_id) AS likes
            FROM post AS p 
            LEFT JOIN user AS u ON p.user_id = u.user_id
            LEFT JOIN post_like AS l ON l.post_id = p.post_id
            GROUP BY p.post_id, p.title, author, p.content, last_update
            ORDER BY last_update DESC`;

            const result = await db.query(q);

            // если посты есть
            const posts = await getPosts(result);
            
            res.render('index', {
                posts
            });
        } catch(error) {
            console.error(error);
            res.render('notfound');
        }
    }
    async getPostsWithFilter(req, res) {
        const filter = req.query.q;

        if(!filter) 
            return res.json();
        
        try {
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
            WHERE u.nickname LIKE '${filter}%' OR p.title LIKE '${filter}%'
            GROUP BY p.post_id, p.title, author, p.content, last_update
            ORDER BY last_update DESC`;

            let result = await db.query(q);

            const posts = await getPosts(result);

            return res.json(posts);
        } catch(error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}

module.exports = new IndexController();