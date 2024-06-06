const Router = require('express').Router;
const controller = require('../controllers/api/lk-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/profile', controller.get__profile);
router.get('/team', controller.get__team);
router.get('/team/create', controller.get__create);
router.post('/team/create', controller.post__create);
router.put('/profile', controller.put__profile);
module.exports = router
