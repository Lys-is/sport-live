import jwt from "jsonwebtoken";
import tokenModel from "../models/token-model.js";
import User from "../models/user-model.js";

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
         expiresIn: "15s",
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
         expiresIn: "30d",
      });
      return {
         accessToken,
         refreshToken,
      };
   }

   validateAccessToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
         return userData;
      } catch (e) {
         console.log(e);
         return null;
      }
   }

   async validateRefreshToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
         let user = await User.findById(userData.id);
         return user;
      } catch (e) {
         return null;
      }
   }

   async saveToken(userId, refreshToken) {
      const tokenData = await tokenModel.findOne({ user: userId });
      if (tokenData) {
         tokenData.refreshToken = refreshToken;
         return tokenData.save();
      }
      const token = await tokenModel.create({ user: userId, refreshToken });
      return token;
   }

   async removeToken(refreshToken) {
      const tokenData = await tokenModel.deleteOne({ refreshToken });
      return tokenData;
   }

   async findToken(refreshToken) {
      const tokenData = await tokenModel.findOne({ refreshToken });
      return tokenData;
   }
}

export default new TokenService();
