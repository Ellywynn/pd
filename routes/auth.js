const express = require('express');
const router = new express.Router();
const user = require('../controllers/user');
const auth = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.get('/register', authMiddleware.alreadyLogged, auth.register);
router.post('/register', authMiddleware.alreadyLogged, user.register);
router.get('/login', authMiddleware.alreadyLogged, auth.login);
router.post('/login', authMiddleware.alreadyLogged, user.login);
router.get('/logout', user.logout);

module.exports = router;