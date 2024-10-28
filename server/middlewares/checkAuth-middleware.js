import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token-service.js";
import League from "../models/league-model.js";
import Subscribe from "../models/subscribe-model.js";

class CheckAuthMiddleware {
   async isAuth(req, res, next) {
      try {
         if (req.user) {
            let subscribe = await Subscribe.findOne({ creator: req.user.id });
            req.user.subscribe = subscribe;
            if (subscribe)
               req.user.block_date = formatDate(subscribe.createdAt, ".");
            if (!req.user.subscribe && !req.user.isAdmin)
               return res.redirect("/inactive");
            let league = await League.findOne({ creator: req.user.id });
            if (league) res.locals.league_href = league.address;
            else res.locals.league_href = false;
            next();
         } else {
            return res.redirect("/auth");
         }
      } catch (e) {
         return next(ApiError.UnauthorizedError());
      }
   }
   isNotAuth(req, res, next) {
      try {
         if (!req.user) {
            next();
         } else {
            return res.redirect("/lk");
         }
      } catch (e) {
         return next(ApiError.AuthorizedError());
      }
   }
}
function formatDate(date = new Date(), sep = "-") {
   return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
   ].join(sep);
}
function padTo2Digits(num) {
   return num.toString().padStart(2, "0");
}
export default new CheckAuthMiddleware();
