const express = require('express');
const router = new express.Router();
const postController = require('../controllers/post');
const authMiddleware = require('../middleware/auth');

// обработка эндпоинтов соответствующими функциями
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getOnePost);
router.get('/add', authMiddleware.isAuthorized, postController.createPostPage)
router.post('/add', authMiddleware.isAuthorized, postController.createPost);
router.put('/', postController.updatePost);
router.put('/:id', postController.deletePost);

module.exports = router;