const User = require('../../../models/user-model');

class UserController {

    async put__edit(req, res) {
        try {
            if(!req.user.isAdmin)
                return res.json({message: 'Нет доступа'});
            const {userId, type} = req.body;
            let user = await User.findOne({_id: userId});
            
            if(!user) return res.json({message: 'Такого пользователя не существует'});
            if(type == 'unblock')
                user = await User.updateOne({_id: userId}, {isActive: true});
            else if(type == 'block')
                user = await User.updateOne({_id: userId}, {isActive: false});
            return res.json({message: 'Пользователь обновлен'});
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

module.exports = new UserController();
