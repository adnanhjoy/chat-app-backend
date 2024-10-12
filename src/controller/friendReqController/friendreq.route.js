const router = require('express').Router();
const { authMiddleware } = require('../../middleware/authMiddleware ');
const friendReqController = require('../friendReqController/friendReq.controller')

router.post('/request', authMiddleware, friendReqController.sendFriendRequest)
router.post('/accept', friendReqController.acceptFriendRequest)
router.get('/request', authMiddleware, friendReqController.getFriendRequests)
router.get('/sent-request', authMiddleware, friendReqController.getSentFriendRequest)
router.get('/friendlist', authMiddleware, friendReqController.getFriendsList)
router.get('/all', authMiddleware, friendReqController.getAllUsers)
router.get('/:friendId', authMiddleware, friendReqController.getSingleFriend)

module.exports = { friendReqRoute } = router