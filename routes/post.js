const express = require('express');
const router = new express.Router();
const postController = require('../controllers/post');
const authMiddleware = require('../middleware/auth');

// обработка эндпоинтов
router.get( '/add', authMiddleware.isLoggedIn, postController.createPostPage);
router.get( '/:post_id', postController.getOnePost);
router.get( '/edit/:post_id', authMiddleware.isLoggedIn, postController.editPostPage);
router.get('/delete/:post_id', authMiddleware.isLoggedIn, postController.deletePost);
router.post('/add', authMiddleware.isLoggedIn, postController.createPost);
router.post('/edit/:post_id', authMiddleware.isLoggedIn, postController.editPost);

module.exports = router;