const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const User = require('../models/user-model');
const League = require('../models/league-model');

module.exports = async function (req, res, next) {
    const address = req.params.address;
    const league = await League.findOne({address: address});

    if(!league) return res.json({message: 'Лига не найдена'});
    req.fans_league = league
    next();
}