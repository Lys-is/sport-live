const User = require('../../../models/user-model');
const mailService = require('../../../service/mail-service');
const mongoose = require('mongoose');
class UserController {

    async put__edit(req, res) {
        try {
            if(!req.user.isAdmin)
                return res.json({message: 'Нет доступа'});
            const {userId, type} = req.body;
            console.log(userId, type);
            let user = await User.findById(userId);
            console.log(user);
            if(!user) return res.json({message: 'Такого пользователя не существует'});
            if(type == 'unblock'){
                user = await User.updateOne({_id: userId}, {isActive: true, dateActive: formatDate()});
            }
            else if(type == 'block')
                user = await User.updateOne({_id: userId}, {isActive: false, dateActive: ''});
            return res.json({message: 'Пользователь обновлен', reload: true});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async delete__user(req, res) {
        try {
            if(!req.user.isAdmin)
                return res.json({message: 'Нет доступа'});
            const {userId} = req.body;
            console.log(userId);
            let user = await User.findById(userId);
            console.log(user);
            if(!user) return res.json({message: 'Такого пользователя не существует'});
            var models = mongoose.modelNames()
            console.log(models);
            await Promise.all(models.map(async(model) => {
                await mongoose.model(model).deleteMany({creator: userId});
            }))
            user = await User.deleteOne({_id: userId});
            return res.json({message: 'Пользователь удален', reload: true});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
   
}
async function sendRes(path, data, res) {
    return res.render(path, data,
    function(err, html) {
        if(err) console.log(err);
        res.json(html);
    });
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date = new Date()) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }
module.exports = new UserController();
