const Router = require('express').Router;
const userController = require('../controllers/api/auth-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.post__registration
);
router.post('/login', userController.post__login);
router.post('/logout', userController.post__logout);
router.get('/activate/:link', userController.get__activate);
router.get('/refresh', userController.get__refresh);
router.get('/users', authMiddleware, userController.get__users);
module.exports = router
