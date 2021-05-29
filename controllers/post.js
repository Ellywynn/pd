const db = require('../config/database');

class Post {
    async createPost(req, res) {

    }
    async createPostPage(req, res) {
        res.render('edit_post');
    }
    async getAllPosts(req, res) {
        
    }
    async getOnePost(req, res) {
        
    }
    async updatePost(req, res) {
        
    }
    async deletePost(req, res) {
        
    }
}

module.exports = new Post();