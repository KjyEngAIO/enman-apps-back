var express = require('express');
var authController = require('../controllers/AuthController')
var router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/histories', authController.histories);

module.exports = router;
