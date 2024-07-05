const checkAuth = require('../middlewares/checkAuth-middleware');
const Router = require('express');
const controllers = require('../controllers');
const getFans = require('../middlewares/getFans-middleware');
//qq - middleware
const nav = {
    'fans/:address' : {
        'func' : 'get__fans',
        'qq': getFans,
        'qqRecurs': true
    },
    'panel/:id' : {
        'func' : 'get__panel'
    },
    'panel_players/:id' : {
        'func' : 'get__panel_players'
    },
    'table/:id' : {
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
        'league' : {'func': 'get__league'},
        'put__profile' : {},
        'put__league' : {},
        'put__del' : {},
        'team' : {
            'func' : 'get__team',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {},
            'get__team_list' : {},
            'put__team_list' : {},
            'get__team_representative' : {},
            'put__team_representative' : {},
            'get__team_couch' : {},
            'put__team_couch' : {},
        },
        'player' : {
            'func' : 'get__player',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
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
            'put__team' : {},
            'delete__team' : {},
            'id/:id/' : {'func': 'get__template'},
            'id/:id/edit' : {'func': 'get__edit'},
            'id/:id/group' : {
                'func': 'get__group',
                'post__create' : {},
                
            },
            'id/:id/get__group_edit/:group_id' : {'func': 'get__group_edit'},
            'id/:id/get__group_create' : {'func': 'get__group_create'},
            'id/:id/team' : {'func': 'get__team'},
            'id/:id/team_in' : {'func': 'get__team_in'},
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
            'get__create_calendar' : {},
            'post__create_calendar' : {},
            'post__create' : {},
            'id/:id/get__edit' : {'func': 'get__edit'},
            'put__edit' : {},
            'put__results':{},
            'put__judge':{},
            'put__commentator':{}
        },
        'couch' : {
            'func' : 'get__couch',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'representative' : {
            'func' : 'get__representative',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'stadium' : {
            'func' : 'get__stadium',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'season' : {
            'func' : 'get__season',
            'get__create' : {},
            'post__create' : {}
        },
        'transfer' : {
            'func' : 'get__transfer',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'judge' : {
            'func' : 'get__judge',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'commentator' : {
            'func' : 'get__commentator',
            'get__create' : {},
            'post__create' : {},
            'get__edit' : {},
            'put__edit' : {}
        },
        'user' : {
            'func' : 'get__user',
            'put__edit' : {}
        },
        'style' : {
            'func' : 'get__style',
        },
        'post__style' : {},
        'get__style_by_id'  : {},
        'get__tournament_by_id'  : {},
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
        constrollerLink = constrollerLink.replace('id/:id/', '')
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
            now_parents.forEach(el => {
                el = el.replace('id/:id/', '')
                contoller = contoller[el]
            });
        }
        else {
            link = ''
        }
        link += now_parents.join('/') +'/'+ obj;
        //console.log(contoller, constrollerLink, link)
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