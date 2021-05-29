const express = require('express');
const router = new express.Router();
const user = require('../controllers/user');
const auth = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.get('/register', authMiddleware.isLoggedIn, auth.register);
router.post('/register', authMiddleware.isLoggedIn, user.register);
router.get('/login', authMiddleware.isLoggedIn, auth.login);
router.post('/login', authMiddleware.isLoggedIn, user.login);
router.get('/logout', user.logout);

module.exports = router;