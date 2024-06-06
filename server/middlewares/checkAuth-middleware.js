const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

class CheckAuthMiddleware {
    isAuth(req, res, next) {
        try {
            if(req.user) {
                next();
            } else {
                return res.redirect('/auth');
            }
        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    }
    isNotAuth(req, res, next) {
        try {
            if(!req.user) {
                next();
            } else {
                return res.redirect('/lk');
            }
        } catch (e) {
            return next(ApiError.AuthorizedError());
        }
    }
}

module.exports = new CheckAuthMiddleware()