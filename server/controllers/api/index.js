const authController = require('./auth-controller');
const lkController = require('./lk-controller');
const fansController = require('./fans-controller');
const { team } = require('./team');

module.exports = {
    auth: authController,
    lk: lkController,
    'fans/:address': fansController,
    
}