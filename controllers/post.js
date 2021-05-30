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
        
    }
    async editPost(req, res) {
        
    }
    async editPostPage(req, res) {
        res.render('edit_post', {
            createPost: true
        });
    }
    async deletePost(req, res) {
        
    }
}

module.exports = new Post();