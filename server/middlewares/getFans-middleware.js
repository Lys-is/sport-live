import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token-service.js";
import User from "../models/user-model.js";
import League from "../models/league-model.js";

export default async function (req, res, next) {
   const address = req.params.address;
   let league = await League.findOne({ address: address });

   if (!league) {
      return res.json({ message: "Лига не найдена" });
   }

   req.fans_league = league;
   next();
}
