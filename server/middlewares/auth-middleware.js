import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token-service.js";

export default async function (req, res, next) {
   try {
      const accessToken = req.cookies.refreshToken;
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
      let query = req.query;
      console.log(query);

      next();
   } catch (e) {
      return next(ApiError.UnauthorizedError());
   }
}
