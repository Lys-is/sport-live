import UserModel from "../models/user-model.js";
import UserDModel from "../models/userD-model.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import emailToken from "../models/emailToken-model.js";

class UserService {
   async registration(data) {
      const { email, password, address, league } = data;
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
         throw ApiError.BadRequest(
            `Пользователь с почтовым адресом ${email} уже существует`
         );
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid(); // v34fa-asfasf-142saf-sa-asf
      data.activationLink = activationLink;
      data.password = hashPassword;
      const user = await UserModel.create(data);
      //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
      const { name, surname } = data;
      const userD = await UserDModel.create({
         name,
         surname,
         creator: user._id,
      });
      await userD.save();
      const userDto = new UserDto(user); // id, email, isActivated
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return { ...tokens, user: userDto };
   }
   async updatePassword(user, password) {
      try {
         const hashPassword = await bcrypt.hash(password, 3);
         user.password = hashPassword;
         await user.save();
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
   async resetPassword(user) {
      try {
         const email = user.email;
         const token = uuid();
         let email_token = await emailToken.create({ user, email, token });
         const link = `https://sporlive.ru/new_password/?token=${token}`;
         await mailService.sendMail(email, link);
      } catch (e) {
         console.log(e);
         throw e;
      }
   }
   async verifyEmailToken(token) {
      try {
         console.log(token);
         const tkn = await emailToken.findOne({ token });
         if (!tkn) {
            throw ApiError.BadRequest("Неккоректная ссылка активации");
         }
         let user = await UserModel.findById(tkn.user);
         return user;
      } catch (e) {
         console.log(e);
         return false;
      }
   }
   async deleteEmailToken(token) {
      await emailToken.deleteOne({ token });
   }
   async activate(activationLink) {
      const user = await UserModel.findOne({ activationLink });
      if (!user) {
         throw ApiError.BadRequest("Неккоректная ссылка активации");
      }
      user.isActivated = true;
      await user.save();
   }

   async login(email, password) {
      const user = await UserModel.findOne({ email });
      console.log(await bcrypt.hash("qwerty", 3));
      if (!user) {
         throw ApiError.BadRequest("Пользователь с таким email не найден");
      }
      const isPassEquals = await bcrypt.compare(password, user.password);
      console.log(isPassEquals);
      if (!isPassEquals) {
         throw ApiError.BadRequest("Неверный пароль");
      }
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return { ...tokens, user: userDto };
   }

   async logout(refreshToken) {
      const token = await tokenService.removeToken(refreshToken);
      console.log(token);
      return token;
   }

   async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
         throw ApiError.UnauthorizedError();
      }
      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return { ...tokens, user: userDto };
   }

   async getAllUsers() {
      const users = await UserModel.find();
      return users;
   }
}

export default new UserService();
