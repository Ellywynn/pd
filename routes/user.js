const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');

router.get('/:nickname', userController.getUser);

module.exports = router;