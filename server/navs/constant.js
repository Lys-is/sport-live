import checkAuth from "../middlewares/checkAuth-middleware.js";
import Router from "express";
import controllers from "../controllers/index.js";
import getFans from "../middlewares/getFans-middleware.js";
import getLeague from "../middlewares/getLeague-middleware.js";

//qq - middleware
/*
 в nav можно добавлять маршруты, первого уровня добавляются как обычно, перед остальными идёт /api/

 'func' - для своего названия функции в контроллере, по умолчанию совпадает с названием маршрута
 'qq' - middleware для маршрута, qqRecurs - вызывать ли рекурсивно, по умолчанию false
*/

const nav = {
   user_agreement: {
      func: "get__user_agreement",
   },
   fans: {},
   "fans/:address": {
      func: "get__fans",
      qq: getFans,
      qqRecurs: true,
      "tournament/id/:id": {
         func: "get__tournament",
      },
      "calendar/id/:id": {
         func: "get__calendar",
      },
      "tables/id/:id": {
         func: "get__tables",
      },
      "teams/id/:id": {
         func: "get__teams",
      },
      "team/id/:id": {
         func: "get__team",
      },
      "docs/id/:id": {
         func: "get__docs",
      },
      "doc/id/:id": {
         func: "get__doc",
      },
      "goalkeepers/id/:id": {
         func: "get__goalkeepers",
      },
      "bombers/id/:id": {
         func: "get__bombers",
      },
      "assistants/id/:id": {
         func: "get__assistants",
      },
      "calendar_team/id/:id": {
         func: "get__calendar_team",
      },
      "roster_team/id/:id": {
         func: "get__roster_team",
      },
      players: {
         func: "get__players",
      },
      "player/id/:id": {
         func: "get__player",
      },
      judges: {
         func: "get__judges",
      },
      "judge/id/:id": {
         func: "get__judge",
      },
      commentators: {
         func: "get__commentators",
      },
      "commentator/id/:id": {
         func: "get__commentator",
      },
   },
   "fans_tournaments/:address/:season": {
      func: "get__fans_tournaments",
      qq: getFans,
   },
   "fans_members/:address": {
      func: "get__fans_members",
      qq: getFans,
   },
   "panel/:id": {
      func: "get__panel",
   },
   "panel_players/:id": {
      func: "get__panel_players",
   },
   "table/:id": {
      func: "get__table",
   },
   inactive: {
      func: "get__inactive",
   },
   login: {
      func: "get__login",
   },
   registration: {
      func: "get__registration",
   },
   reset_password: {
      func: "get__reset_password",
   },
   new_password: {
      func: "get__new_password",
   },
   auth: {
      qq: checkAuth.isNotAuth,

      post__registration: {},
      post__login: {},
      post__logout: {},
      "get__activate/:link": { func: "get__activate" },
      get__refresh: {},
      get__users: {},
      post__reset_password: {},
      post__new_password: {},
   },
   lk: {
      qq: checkAuth.isAuth,
      qqRecurs: true,
      profile: { func: "get__profile" },
      league: { func: "get__league" },
      put__profile: {},
      put__password: {},
      put__league: {},
      put__del: {},
      put__fulldel: {},
      team: {
         func: "get__team",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
         get__team_list: {},
         put__team_list: {},
         get__team_representative: {},
         put__team_representative: {},
         get__team_couch: {},
         put__team_couch: {},
      },
      player: {
         func: "get__player",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
         post__check_duplicate: {},
      },
      tournament: {
         func: "get__tournament",
         get__create: {},
         post__create: {},
         put__edit: {
            basic: { func: "put__basic" },
            reglament: { func: "put__reglament" },
            application_campaign: { func: "put__application_campaign" },
            visual: { func: "put__visual" },
            tags: { func: "put__tags" },
            admins: { func: "put__admins" },
         },
         put__team: {},
         delete__team: {},
         put__judge: {},
         delete__judge: {},
         "id/:id/": { func: "get__template" },
         "id/:id/edit": { func: "get__edit" },
         "id/:id/group": {
            func: "get__group",
            post__create: {},
         },
         "id/:id/get__group_edit/:group_id": { func: "get__group_edit" },
         "id/:id/get__group_create": { func: "get__group_create" },
         "id/:id/matches": { func: "get__matches" },
         "id/:id/team": { func: "get__team" },
         "id/:id/team_in": { func: "get__team_in" },
         "id/:id/judge": { func: "get__judge" },
         "id/:id/judge_in": { func: "get__judge_in" },
         "id/:id/t_team": { func: "get__t_team" },
         "id/:id/results": { func: "get__results" },
         "id/:id/docs": { func: "get__docs" },
         "id/:id/docs_create": { func: "get__docs_create" },
         post__docs_create: {},
         "id/:id/pages": { func: "get__pages" },
         "id/:id/widgets": { func: "get__widgets" },
      },
      match: {
         func: "get__match",
         get__create: {},
         get__create_calendar: {},
         post__create_calendar: {},
         post__create: {},
         "id/:id/get__edit": { func: "get__edit" },
         put__edit: {},
         put__results: {},
         put__judge: {},
         put__commentator: {},
         delete__results: {},
         get__teams: {},
         get__teams_by_tournament: {},
      },
      couch: {
         func: "get__couch",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      representative: {
         func: "get__representative",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      stadium: {
         func: "get__stadium",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      season: {
         func: "get__season",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      transfer: {
         func: "get__transfer",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      judge: {
         func: "get__judge",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      commentator: {
         func: "get__commentator",
         get__create: {},
         post__create: {},
         get__edit: {},
         put__edit: {},
      },
      user: {
         func: "get__user",
         put__edit: {},
         delete__user: {},
      },
      style: {
         func: "get__style",
      },
      guide: {
         func: "get__guide",
         get__create: {},
         "id/:id/": { func: "get__single_guide" },
         // 'admin' : {'func': 'get__guide_admin'},
         post__create: {},
      },
      guide_admin: {
         func: "get__guide_admin",
      },
      post__style: {},
      del__style: {},
      get__style_by_id: {},
      get__tournament_by_id: {},
   },
};
function start() {
   const router = new Router();

   router.get("/images/:model/:id", controllers.get__image);
   router.get("/api/funs/:address/placeholder", getFans, (req, res) => {
      const league = req.fans_league;
      res.send(league.img);
   });

   function loopThroughObjRecurs(obj, parents, propExec, middelware) {
      for (let k in obj) {
         propExec(k, parents, obj[k], middelware);
         if (typeof obj[k] === "object") {
            let md;
            if (middelware) {
               md = middelware;
            }
            if (obj[k].qqRecurs) {
               md = obj[k].qq;
            }
            loopThroughObjRecurs(obj[k], parents.concat(k), propExec, md);
         }
      }
   }
   loopThroughObjRecurs(nav, [], setRouts);

   function setRouts(obj, parents, elem, middelwareParent) {
      if (obj == "qq" || obj == "func") {
         return;
      }
      let middelware = (req, res, next) => {
         next();
      };
      let constrollerLink = obj;
      if (elem.func) {
         constrollerLink = elem.func;
      }
      constrollerLink = constrollerLink.replace("id/:id/", "");
      if (middelwareParent) {
         middelware = middelwareParent;
      }
      if (elem.qq) {
         middelware = elem.qq;
      }

      let method = elem.func ? elem.func.split("__") : obj.split("__");
      if (method.length > 1) {
         method = method[0];
      } else {
         method = "get";
      }
      let contoller = controllers;
      let now_parents = [...parents];
      let link = "/";
      if (parents.length > 0) {
         now_parents.unshift("api");
         now_parents.forEach((el) => {
            el = el.replace("id/:id/", "");
            contoller = contoller[el];
         });
      } else {
         link = "";
      }
      link += now_parents.join("/") + "/" + obj;
      //console.log(contoller, constrollerLink, link)
      router[method](link, middelware, (req, res) => {
         //console.log(req, res)
         contoller[constrollerLink](req, res);
      });
   }
   return router;
}

export default start();
