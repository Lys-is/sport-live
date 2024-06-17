const checkAuth = require('../middlewares/checkAuth-middleware');
const Router = require('express');
const controllers = require('../controllers');
//qq - middleware
const nav = {
    'panel' : {
        'func' : 'get__panel'
    },
    'table' : {
        'func' : 'get__table'
    },
    'login' : {
        'func' : 'get__login'
    },
    'registration' : {
        'func' : 'get__registration'
    },
    'auth' : {
        
        'qq': checkAuth.isNotAuth,

        'post__registration' : {},
        'post__login' : {},
        'post__logout' : {},
        'get__activate/:link' : {'func': 'get__activate'},
        'get__refresh' : {},
        'get__users' : {}
    },
    'lk' : {
        'qq': checkAuth.isAuth,
        'qqRecurs': true,
        'profile' : {'func': 'get__profile'},
        'put__profile' : {},
        'team' : {
            'func' : 'get__team',
            'get__create' : {},
            'post__create' : {},
            'get__team_list' : {},
            'get__team_list_create' : {},
            'post__team_list_create' : {}
        },
        'player' : {
            'func' : 'get__player',
            'get__create' : {},
            'post__create' : {}
        },
        'tournament' : {
            'func' : 'get__tournament',
            'get__create' : {},
            'post__create' : {},
            'put__edit' : {
                'basic' : { 'func' : 'put__basic' },
                'reglament' : { 'func' : 'put__reglament' },
                'application_campaign' : { 'func' : 'put__application_campaign' },
                'visual' : { 'func' : 'put__visual' },
                'tags' : { 'func' : 'put__tags' },
                'admins' : { 'func' : 'put__admins' }
            },
            'id/:id/' : {'func': 'get__template'},
            'id/:id/edit' : {'func': 'get__edit'},
            'id/:id/group' : {'func': 'get__group'},
            'id/:id/get__group_create' : {'func': 'get__group_create'},

            'id/:id/team' : {'func': 'get__team'},
            'id/:id/judge' : {'func': 'get__judge'},
            'id/:id/t_team' : {'func': 'get__t_team'},
            'id/:id/results' : {'func': 'get__results'},
            'id/:id/docs' : {'func': 'get__docs'},
            'id/:id/pages' : {'func': 'get__pages'},
            'id/:id/widgets' : {'func': 'get__widgets'},
        },
        'match' : {
            'func' : 'get__match',
            'get__create' : {},
            'post__create' : {}
        },
        'representative' : {
            'func' : 'get__representative',
            'get__create' : {},
            'post__create' : {}
        },
        'stadium' : {
            'func' : 'get__stadium',
            'get__create' : {},
            'post__create' : {}
        },
        'season' : {
            'func' : 'get__season',
            'get__create' : {},
            'post__create' : {}
        },
        'transfer' : {
            'func' : 'get__transfer',
            'get__create' : {},
            'post__create' : {}
        },
        'judge' : {
            'func' : 'get__judge',
            'get__create' : {},
            'post__create' : {}
        }

    }
}
function start(){
    const router = new Router();

    function loopThroughObjRecurs(obj, parents, propExec, middelware) {
        for (let k in obj) {
            propExec(k, parents, obj[k], middelware)
            if (typeof obj[k] === 'object') {
                let md
                if(middelware){
                    md = middelware
                }
                if(obj[k].qqRecurs){
                    md = obj[k].qq
                }
                loopThroughObjRecurs(obj[k], parents.concat(k), propExec, md)
            }
        }
      }
    loopThroughObjRecurs(nav, [], setRouts)
    
    function setRouts(obj, parents, elem, middelwareParent) {
        if(obj == 'qq' || obj == 'func'){
            return
        }
        let middelware = (req,res,next) => {next()}
        let constrollerLink = obj
        if(elem.func){
            constrollerLink = elem.func
        }
        if(middelwareParent){
            middelware = middelwareParent
        }
        if(elem.qq){
            middelware = elem.qq
        }
        
        let method = elem.func ? elem.func.split('__') : obj.split('__')
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
            //console.log(now_parents, obj)
            now_parents.forEach(el => {
                contoller = contoller[el]
            });
            //console.log(contoller, constrollerLink, link)
        }
        else {
            link = ''
        }
        link += now_parents.join('/') +'/'+ obj;
        
       // console.log(contoller, constrollerLink, link)
        router[method](link, middelware, (req, res) => {
            //console.log(req, res)
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