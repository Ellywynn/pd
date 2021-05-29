const express = require('express');
const { index } = require('../controllers/index');
const router = new express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.index);

router.get('/register', indexController.register);

router.get('/login', indexController.login);

module.exports = router;