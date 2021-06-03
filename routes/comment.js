const express = require('express');
const router = new express.Router();
const commentController = require('../controllers/comment');
const authMiddleware = require('../middleware/auth');

router.post('/:post_id', authMiddleware.isLoggedIn, commentController.addComment);
router.post('/like/:comment_id', authMiddleware.isLoggedIn, commentController.likeComment);
router.post('/dislike/:comment_id', authMiddleware.isLoggedIn, commentController.dislikeComment);
router.delete('/:comment_id',  commentController.deleteComment);

module.exports = router;