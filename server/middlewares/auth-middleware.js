const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = async function (req, res, next) {
    try {


        const accessToken = req.cookies.refreshToken;//authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next();
        }

        const userData = await tokenService.validateRefreshToken(accessToken);
        console.log(userData);
        if (!userData) {
            return next();
        }

        req.user = userData;
        console.log(req.user);
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
