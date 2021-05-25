const express = require('express');
const router = new express.Router();
const postController = require('../controllers/PostController');

// обработка эндпоинтов соответствующими функциями
router.get('/', postController.createPost);


module.exports = router;