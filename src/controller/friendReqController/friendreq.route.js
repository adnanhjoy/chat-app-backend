const router = require('express').Router();
const { authMiddleware } = require('../../middleware/authMiddleware ');
const friendReqController = require('../friendReqController/friendReq.controller')

router.post('/request', authMiddleware, friendReqController.sendFriendRequest)
router.post('/accept', friendReqController.acceptFriendRequest)
router.get('/request', authMiddleware, friendReqController.getFriendRequests)
router.get('/friendlist', authMiddleware, friendReqController.getFriendsList)
router.get('/all', authMiddleware, friendReqController.getAllUsers)

module.exports = { friendReqRoute } = router