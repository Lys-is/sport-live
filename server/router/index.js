const Router = require('express').Router;
const userController = require('../controllers/api/auth-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const lkRouter = require('./lk-router');
const authRouter = require('./auth-router');
router.use('/lk', lkRouter);
router.use('/auth', authRouter);

module.exports = router
