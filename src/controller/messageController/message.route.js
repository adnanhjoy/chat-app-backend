const router = require('express').Router();
const { authMiddleware } = require('../../middleware/authMiddleware ');
const messageController = require('../messageController/message.controller')

router.post('/send', authMiddleware, messageController.sendMessage)
router.get('/receive/:receiverId', authMiddleware, messageController.getMessages)

module.exports = { messageRouter } = router