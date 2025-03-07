import userService from "../../service/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../../exceptions/api-error.js";
import UserD from "../../models/userD-model.js";
import mongoose from "mongoose";
import Judge from "../../models/judge-model.js";
import Match from "../../models/match-model.js";
import Player from "../../models/player-model.js";
import Representative from "../../models/representative-model.js";
import Season from "../../models/season-model.js";
import Stadium from "../../models/stadium-model.js";
import Team from "../../models/team-model.js";
import Tournament from "../../models/tournament-model.js";
import Transfer from "../../models/transfer-model.js";
import User from "../../models/user-model.js";
import League from "../../models/league-model.js";
import Style from "../../models/style-model.js";
import Commentator from "../../models/commentator-model.js";
import Doc from "../../models/doc-model.js";
import Global from "../../models/global-model.js";
import Subscribe from "../../models/subscribe-model.js";
import Couch from "../../models/couch-model.js";
import dbService from "../../service/db-service.js";

import team from "./team/index.js";
import player from "./player/index.js";
import tournament from "./tournament/index.js";
import match from "./match/index.js";
import representative from "./representative/index.js";
import judge from "./judge/index.js";
import couch from "./couch/index.js";
import commentator from "./commentator/index.js";
import user from "./user/index.js";
import transfer from "./transfer/index.js";
import guide from "./guide/index.js";
import season from "./season/index.js";

const LkController = {
   tournament,
   team,
   player,
   match,
   representative,
   judge,
   couch,
   commentator,
   user,
   transfer,
   guide,
   season,
   async get__create(req, res) {
      try {
         return sendRes("partials/lk_part/team_create", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async post__create(req, res) {
      try {
         let { name, description } = req.body;
         await Team.create({
            creator: req.user.id,
            admins: req.user.id,
            name,
            description,
         });
         return res.json({ message: "Команда создана" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__judge(req, res) {
      try {
         req.query["creator"] = req.user.id;

         //console.log(req);
         let [judges, total] = await dbService.getAggregate(Judge, req);
         //let total = await Judge.countDocuments({creator: req.user.id});
         return sendRes("partials/lk_part/judge", { judges, total }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__commentator(req, res) {
      try {
         req.query["creator"] = req.user.id;

         //console.log(req);
         let [commentators, total] = await dbService.getAggregate(
            Commentator,
            req
         );
         //let total = await Commentator.countDocuments({creator: req.user.id});
         return sendRes(
            "partials/lk_part/commentator",
            { commentators, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__representative(req, res) {
      try {
         req.query["creator"] = req.user.id;

         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("name _id");
         let [representatives, total] = await dbService.getAggregate(
            Representative,
            req
         );
         //let total = await Representative.countDocuments({creator: req.user.id});
         return sendRes(
            "partials/lk_part/representative",
            { representatives, teams, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__couch(req, res) {
      try {
         req.query["creator"] = req.user.id;

         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("name _id");
         let [couches, total] = await dbService.getAggregate(Couch, req);
         //let total = await Couch.countDocuments({creator: req.user.id});
         return sendRes(
            "partials/lk_part/couch",
            { couches, teams, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__season(req, res) {
      try {
         //console.log(req);
         let [seasons, total] = await dbService.getAggregate(Season, req);

         return sendRes("partials/lk_part/season", { seasons, total }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__stadium(req, res) {
      try {
         //console.log(req);
         console.log(await Stadium.find());
         let stadiums = await Stadium.find({});

         return sendRes("partials/lk_part/stadium", { stadiums }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__transfer(req, res) {
      try {
         req.query["creator"] = req.user.id;

         //console.log(req);
         console.log(await Transfer.find());
         let [transfers, total] = await dbService.getAggregate(Transfer, req);
         //let total = await Transfer.countDocuments({creator: req.user.id});
         return sendRes("partials/lk_part/transfer", { transfers, total }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__league(req, res) {
      try {
         let league = await League.findOne({ creator: req.user.id });
         if (!league)
            league = await League.create({
               creator: req.user.id,
               name: req.user.name,
               address: req.user._id,
            });
         return sendRes("partials/lk_part/league", { league }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async put__league(req, res) {
      try {
         await League.findOneAndUpdate({ creator: req.user.id }, req.body);
         return res.json({ message: "Лига обновлена", reload: true });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__player(req, res) {
      try {
         req.query["creator"] = req.user.id;

         //console.log(req);
         // console.log(await Player.find());
         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("name _id");
         let [players, total] = await dbService.getAggregate(Player, req);
         //let total = await Player.countDocuments({creator: req.user.id}) ;

         return sendRes(
            "partials/lk_part/player",
            { players, teams, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__team(req, res) {
      try {
         // let teams = await Team.find({})
         // teams = teams.map((team) => {
         //     console.log(team.date);
         //     return team
         // })
         req.query["creator"] = req.user.id;

         let [teams, total] = await dbService.getAggregate(Team, req);
         //let total = await Team.countDocuments({creator: req.user.id});
         return sendRes("partials/lk_part/team", { teams, total }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__tournament(req, res) {
      try {
         req.query["creator"] = req.user.id;
         //console.log(req);
         let allTournaments = await Tournament.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("basic.full_name _id");
         let [tournaments, total] = await dbService.getAggregate(
            Tournament,
            req
         );
         //let total = await Tournament.countDocuments({creator: req.user.id});
         return sendRes(
            "partials/lk_part/tournament",
            { tournaments, allTournaments, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__match(req, res) {
      try {
         let tournaments = await Tournament.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("basic.full_name _id");
         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("name _id");
         req.query["creator"] = req.user.id;
         let [matches, total] = await dbService.getAggregate(Match, req);
         //let total = await Match.countDocuments({creator: req.user.id});
         // console.log(matches, total);
         return sendRes(
            "partials/lk_part/match",
            { matches, tournaments, teams, total },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__profile(req, res) {
      try {
         console.log(req.user);
         let profile = await UserD.findOne({ creator: req.user.id });
         console.log(profile);
         if (!profile) profile = await UserD.create({ creator: req.user.id });
         console.log(profile);
         let site_img = await Global.findOne({ name: "site_img" }),
            site_name = await Global.findOne({ name: "site_name" });
         return sendRes(
            "partials/lk_part/profile",
            {
               user: req.user,
               profile: profile,
               isAdmin: req.user.isAdmin,
               site_img: site_img?.data || "/static/styles/icons/logo.jpg",
               site_name: site_name?.data || "Sporlive",
            },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async put__profile(req, res) {
      try {
         const { ...data } = req.body;
         console.log(data);
         await User.updateOne({ _id: req.user.id }, data);
         await UserD.updateOne({ creator: req.user.id }, data);
         if (req.user.isAdmin) {
            console.log("fsdfs");
            let site_name = await Global.findOne({ name: "site_name" }),
               site_img = await Global.findOne({ name: "site_img" });
            if (!site_name && data.site_name)
               site_name = await Global.create({
                  name: "site_name",
                  data: data.site_name,
               });
            if (!site_img && data.site_img)
               site_img = await Global.create({
                  name: "site_img",
                  data: data.site_img,
               });

            console.log(site_name, site_img);
            if (site_name && data.site_name)
               await Global.updateOne(
                  { name: "site_name" },
                  { data: data.site_name }
               );
            if (site_img && data.site_img)
               await Global.updateOne(
                  { name: "site_img" },
                  { data: data.site_img }
               );
         }
         return res.json({ message: "Профиль обновлен" });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   },
   async put__password(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(
               ApiError.BadRequest("Ошибка при валидации", errors.array())
            );
         }
         const { ...data } = req.body;
         console.log(data);
         if (!data.password)
            return res.json({ message: "Новый пароль не может быть пустым" });

         await userService.updatePassword(req.user, data.password);
         return res.json({ message: "Пароль обновлен" });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   },
   async get__style(req, res) {
      try {
         let styles = await Style.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         });
         return sendRes("partials/lk_part/style", { styles }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async post__style(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(
               ApiError.BadRequest("Ошибка при валидации", errors.array())
            );
         }
         const { ...data } = req.body;
         console.log(data);
         if (data.style_id && !data.style_name_new) {
            let style = await Style.findById(data.style_id);
            if (!style) return res.json({ message: "Такого стиля нет" });
            style = await Style.findByIdAndUpdate(data.style_id, data);
            return res.json({ message: "Стиль обновлен", style });
         }
         if (data.style_name_new) {
            let style = await Style.create({
               ...data,
               name: data.style_name_new,
               creator: req.user.id,
            });
            return res.json({ message: "Стиль создан", style, reload: true });
         }
         return res.json({ message: "Стиль создан" });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   },
   async del__style(req, res) {
      try {
         let style = await Style.findById(req.query.id);
         if (!style) return res.json({ message: "Такого стиля нет" });
         await Style.deleteOne({ creator: req.user.id, _id: style._id });
         return res.json({ message: "Стиль удален", reload: true });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   },
   async get__style_by_id(req, res) {
      try {
         let style = await Style.findById(req.query.id);
         return res.json({ style });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__tournament_by_id(req, res) {
      try {
         let tournament = await Tournament.findById(req.query.id);
         if (!tournament || !tournament.creator.equals(req.user.id))
            return res.json({ message: "Турнир не найден" });
         return res.json(tournament);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__user(req, res) {
      try {
         if (!req.user.isAdmin) return res.json({ message: "Нет доступа" });
         let [users, total] = await dbService.getAggregate(User, req);
         // users = users.sort((a, b) => (new Date(b.dateActive).getTime()|| 0) - (new Date(a.dateActive).getTime() || 0));
         //let total = await User.countDocuments({});
         users = await Promise.all(
            users.map(async (item) => {
               let userD = await UserD.findOne({ creator: item._id });
               let block_date;
               let subscribe = await Subscribe.findOne({ creator: item._id });
               if (subscribe) {
                  console.log(subscribe.createdAt, typeof subscribe.createdAt);
                  console.log(formatDate(subscribe.createdAt));
                  block_date = formatDate(subscribe.createdAt);
               }
               return {
                  ...item._doc,
                  surname: userD?.surname,
                  name: userD?.name,
                  patronymic: userD?.patronymic,
                  subscribe,
                  block_date,
               };
            })
         );
         console.log(users, total);
         return sendRes("partials/lk_part/user", { users, total }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__guide(req, res) {
      try {
         let guides = await Doc.find({
            type: "guide",
            status_doc: { $ne: "deleted" },
         });
         return sendRes("partials/lk_part/guide", { guides }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__guide_admin(req, res) {
      try {
         if (!req.user.isAdmin) return res.json({ message: "Нет доступа" });
         let guides = await Doc.find({ type: "guide" });
         return sendRes("partials/lk_part/guide_admin", { guides }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async put__del(req, res) {
      try {
         let data = req.body;
         let msg = "";
         console.log(data);
         let schema = mongoose.models[data.model];
         console.log(schema);
         if (!schema) return res.json({ message: "Такой схемы нет" });
         let doc = await schema.findById(data.id);
         if (!doc) return res.json({ message: "Такого документа нет" });
         if (!doc.creator.equals(req.user.id))
            return res.json({ message: "Нет доступа" });

         if (doc.status_doc === "active") {
            doc.status_doc = "deleted";
            msg = "Документ архивирован";
            if (data.model == "Team") {
               await Tournament.deleteTeam(doc._id);
            } else if (data.model == "Player") {
               doc.team = null;
            } else if (data.model == "Match") {
            }
         } else if (doc.status_doc === "deleted") {
            doc.status_doc = "active";
            msg = "Документ восстановлен";
         }
         await doc.save();
         return res.json({ message: msg, reload: true });
      } catch (e) {
         console.log(e);
         res.json({ message: "Произошла ошибка" });
      }
   },
   async put__fulldel(req, res) {
      try {
         const { model, id } = req.body;
         const schema = mongoose.models[model];

         if (!schema) return res.json({ message: "Схема не существует" });

         const doc = await schema.findById(id);

         if (!doc) return res.json({ message: "Документ не найден" });

         if (!doc.creator.equals(req.user.id)) {
            return res.json({ message: "Нет доступа" });
         }

         await schema.deleteOne({ _id: id });

         return res.json({ message: "Документ успешно удален", reload: true });
      } catch (error) {
         console.error(error);
         return res
            .status(500)
            .json({ message: "Произошла ошибка", error: error.message });
      }
   },
};

async function sendRes(path, data, res) {
   data.formatDatePretty = formatDatePretty;
   return res.render(path, data, function (err, html) {
      if (err) console.log(err);
      res.json(html);
   });
}
export function formatDatePretty(date, sep = ".") {
   date = new Date(date);
   return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
   ].join(sep);
}
function formatDate(date = new Date(), sep = "-") {
   return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
   ].join(sep);
}
function padTo2Digits(num) {
   return num.toString().padStart(2, "0");
}

export default LkController;
