const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

router.get('/:nickname', userController.getUser);
router.post('/avatar', authMiddleware.isLoggedIn, userController.uploadImage);

module.exports = router; 