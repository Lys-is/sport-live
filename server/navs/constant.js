const checkAuth = require('../middlewares/checkAuth-middleware');
const Router = require('express');
const controllers = require('../controllers');
const nav = {
    'auth' : {
        'post__registration' : {},
        'post__login' : {},
        'post__logout' : {},
        'get__activate/:link' : {'func': 'get__activate'},
        'get__refresh' : {},
        'get__users' : {}
    },
    'lk' : {
        'qq': checkAuth.isAuth,
        'profile' : {'func': 'get__profile'},
        'put__profile' : {},
        'team' : {
            'func' : 'get__team',
            'get__create' : {},
            'post__create' : {},
            'get__team_list' : {},
            'get__team_list_create' : {},
        }
    }
}
function start(){
    const router = new Router();

    function loopThroughObjRecurs(obj, parents, propExec) {
        for (let k in obj) {
            propExec(k, parents, obj[k])
            if (typeof obj[k] === 'object') {
              loopThroughObjRecurs(obj[k], parents.concat(k), propExec)
            }
        }
      }
    loopThroughObjRecurs(nav, [], setRouts)
    
    function setRouts(obj, parents, elem) {
        if(obj == 'qq' || obj == 'func'){
            return
        }
        let middelware = (req,res,next) => {next()}
        let constrollerLink = obj
        if(elem.func){
            constrollerLink = elem.func
        }
        if(elem.qq){
            middelware = elem.qq
        }
    
        let method = obj.split('__')
        if(method.length > 1){
            method = method[0]
        }
        else {
            method = 'get'
        }
        let contoller = controllers;
        let now_parents = [...parents]
        let link = '/'
        if(parents.length > 0){
            now_parents.unshift('api')
            console.log(now_parents)
            now_parents.forEach(el => {
                contoller = contoller[el]
            });
        }
        else {
            link = ''
        }
        link += now_parents.join('/') +'/'+ obj;
        
        console.log(contoller, constrollerLink, link)
        router[method](link, middelware, (req, res) => {
            console.log(req, res)
            contoller[constrollerLink](req, res)
        }
        )
    }
    return router
}

function getRouter() {
    return router
}
module.exports = start()