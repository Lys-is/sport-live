const Router = require('express').Router;
const controller = require('../controllers/lk-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/profile', controller.profile);
router.get('/team', controller.team);
router.get('/team/create', controller.getCreateTeam);
router.post('/team/create', controller.createTeam);
router.put('/profile', controller.updateProfile);
module.exports = router
