const router = require('express').Router();
const messageController = require('../messageController/message.controller')

router.post('/send', messageController.sendMessage)
router.post('/receive', messageController.getMessages)

module.exports = { messageRouter } = router