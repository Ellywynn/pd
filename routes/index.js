const express = require('express');
const router = new express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.index);
router.get('/all', indexController.getPostsWithFilter);

module.exports = router;