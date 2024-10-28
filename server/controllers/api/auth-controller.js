import userService from "../../service/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../../exceptions/api-error.js";
import User from "../../models/user-model.js";
import mailService from "../../service/mail-service.js";

class UserController {
   async post__registration(req, res, next) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(
               ApiError.BadRequest("Ошибка при валидации", errors.array())
            );
         }
         //const {email, password} = req.body;
         const userData = await userService.registration(req.body);
         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         return res.json({
            message: "Пользователь зарегистрирован",
            redirect: "/login",
         });
      } catch (e) {
         return res.json({ message: e.message });
      }
   }

   async post__login(req, res, next) {
      try {
         const { email, password } = req.body;
         const userData = await userService.login(email, password);
         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         // console.log(userData);
         return res.json(userData);
      } catch (e) {
         return res.json({ message: e.message });
      }
   }

   async post__logout(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         // console.log(refreshToken);
         const token = await userService.logout(refreshToken);
         res.clearCookie("refreshToken");
         return res.json(token);
      } catch (e) {
         console.log(e);
         //next(e);
      }
   }

   async get__activate(req, res, next) {
      try {
         const activationLink = req.params.link;
         await userService.activate(activationLink);
         return res.redirect(process.env.CLIENT_URL);
      } catch (e) {
         next(e);
      }
   }

   async get__refresh(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const userData = await userService.refresh(refreshToken);
         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async get__users(req, res, next) {
      try {
         const users = await userService.getAllUsers();
         return res.json(users);
      } catch (e) {
         next(e);
      }
   }
   async post__reset_password(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(
               ApiError.BadRequest("Ошибка при валидации", errors.array())
            );
         }
         const { email } = req.body;
         let user = await User.findOne({ email });
         if (!user)
            return res.json({ message: "Такого пользователя не существует" });
         await userService.resetPassword(user);

         return res.json({
            message: "Ссылка для смены пароля отправлена на почту",
         });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async post__new_password(req, res) {
      try {
         //console.log(req);
         let data = req.body;
         const token = data.token;
         if (!token)
            return res.json({ message: "Ссылка сброса пароля истекла" });
         // console.log(data);
         if (!data.password || data.password != data.password_confirm)
            return res.json({
               message:
                  "Новый пароль не может быть пустым или не совпадать с подтверждением",
            });
         let user = await userService.verifyEmailToken(token);
         if (!user)
            return res.json({ message: "Ссылка сброса пароля истекла" });
         await userService.updatePassword(user, data.password);
         await userService.deleteEmailToken(token);
         return res.json({ message: "Пароль обновлен" });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   }
}
async function sendRes(path, data, res) {
   return res.render(path, data, function (err, html) {
      if (err) console.log(err);
      res.json(html);
   });
}

export default new UserController();
