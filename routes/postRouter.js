const express = require('express');
const router = new express.Router();
const postController = require('../controllers/PostController');

// обработка эндпоинтов соответствующими функциями
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getOnePost);
router.get('/add', postController.createPostPage)
router.post('/add', postController.createPost);
router.put('/', postController.updatePost);
router.put('/:id', postController.deletePost);

module.exports = router;