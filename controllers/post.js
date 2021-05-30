const db = require('../config/database');

class Post {
    async createPost(req, res) {
        console.log('User:', req.session.userId);
        console.log('Title:', req.body.title);
        console.log('Content:', req.body.editordata);
        res.redirect('/post/add');
    }
    async createPostPage(req, res) {
        res.render('edit_post', {
            createPost: true
        });
    }
    async getAllPosts(req, res) {
        
    }
    async getOnePost(req, res) {
        const post_id = req.params.post_id;
        if(!post_id) {
            return res.render('notfound');
        }
        const q = `SELECT p.title, u.nickname AS author, p.content, p.last_update FROM post AS p INNER JOIN user AS u ON p.user_id = u.user_id WHERE p.post_id=${post_id}`;
        const result = await db.query(q);
        if(result[0].length > 0) {
            const last_update = result[0][0].last_update;
            res.render('post', {
                title: result[0][0].title,
                author: result[0][0].author,
                content: result[0][0].content,
                last_update
            });
        } else {
            return res.render('notfound');
        }
    }
    async editPost(req, res) {
        
    }
    async editPostPage(req, res) {
        const post_id = req.params.post_id;
        const result = await db.query(`SELECT title, user_id, content FROM post WHERE post_id=${post_id}`);
        if(result[0].length > 0) {
            // если это чужой пост
            if(result[0][0].user_id !== req.session.userId
                || req.session.role !== 'owner' || req.session.role !== 'admin'
                || req.session.role !== 'moderator') {
                res.redirect('/');
            } else {
                const postTitle = result[0][0].title;
                const postContent = result[0][0].content;
                res.render('edit_post', {
                    createPost: true,
                    postTitle,
                    postContent 
                });
            }
        } else {
            // there is no post with this id
            res.redirect('/');
        }
    }
    async deletePost(req, res) {
        
    }
}

module.exports = new Post();