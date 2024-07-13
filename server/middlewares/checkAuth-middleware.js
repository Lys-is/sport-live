const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const League = require('../models/league-model');

class CheckAuthMiddleware {
    async isAuth(req, res, next) {
        try {
            if(req.user) {
                let league = await League.findOne({creator: req.user.id});
                if(league)
                    res.locals.league_href = league.address
                else res.locals.league_href = false
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