const router = require('express').Router();
const authController = require('../authController/auth.controller')

router.post('/signup', authController.signup)
router.post('/login', authController.login)

module.exports = { authRouter } = router