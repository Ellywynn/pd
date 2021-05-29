const express = require('express');
const router = new express.Router();
const postController = require('../controllers/post');
const authMiddleware = require('../middleware/auth');

// обработка эндпоинтов соответствующими функциями
router.get('/', postController.getAllPosts);
// router.get('/:id', postController.getOnePost);
router.get('/add', authMiddleware.isLoggedIn, postController.createPostPage);
router.post('/add', authMiddleware.isLoggedIn, postController.createPost);
router.put('/', authMiddleware.isLoggedIn, postController.updatePost);
router.delete('/:id', authMiddleware.isLoggedIn, postController.deletePost);

module.exports = router;