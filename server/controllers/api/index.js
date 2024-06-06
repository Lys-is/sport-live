const authController = require('./auth-controller');
const lkController = require('./lk-controller');
const teamController = require('./team');
const { team } = require('./team');

module.exports = {
    auth: authController,
    lk: lkController,
    
}