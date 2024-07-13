const UserModel = require('../models/user-model');
const UserDModel = require('../models/userD-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const emailToken= require('../models/emailToken-model');

class UserService {
    async registration(data) {
        const {email, password, address, league} = data;
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf
        data.activationLink = activationLink
        data.password = hashPassword
        const user = await UserModel.create(data);
        //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const {name, surname} = data
        const userD = await UserDModel.create({name, surname, creator: user._id})
        await userD.save();
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }
    async updatePassword(user, password) {
        try {
            const hashPassword = await bcrypt.hash(password, 3);
            user.password = hashPassword
            await user.save();
        } catch (e) {
            console.log(e);
            throw e
        }
    }
    async resetPassword(user) {
        try{
            const email = user.email
            const token = uuid.v4()
            let email_token = await emailToken.create({user, email, token})
            const link = `https://sporlive.ru/new_password/?token=${token}`;
            await mailService.sendMail(email, link);
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }
    async verifyEmailToken(token) {
        try {
            console.log(token);
            const tkn = await emailToken.findOne({token});
            if (!tkn) {
                throw ApiError.BadRequest('Неккоректная ссылка активации')
            }
            let user = await UserModel.findById(tkn.user);
            return user
        } catch (e) {
            console.log(e);
            return false
        }
    }
    async deleteEmailToken(token) {
        await emailToken.deleteOne({token})
    }
    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        console.log(await bcrypt.hash('qwerty', 3))
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        console.log(isPassEquals);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
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
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();
