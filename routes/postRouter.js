const express = require('express');
const router = new express.Router();
const postController = require('../controllers/PostController');

// обработка эндпоинтов соответствующими функциями
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getOnePost);
router.post('/', postController.createPost);
router.put('/', postController.updatePost);
router.put('/:id', postController.deletePost);

module.exports = router;