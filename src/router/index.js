const authRouter = require('../controller/authController/auth.route')
const friendReqRoute = require('../controller/friendReqController/friendreq.route')
const messageRouter = require('../controller/messageController/message.route')
const router = require('express').Router();

const defaultRoutes = [
    {
        path: "/friend",
        handler: friendReqRoute,
    },
    {
        path: "/auth",
        handler: authRouter,
    },
    {
        path: "/message",
        handler: messageRouter,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.handler);
});

module.exports = router;