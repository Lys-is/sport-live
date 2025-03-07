import Team from "../../../models/team-model.js";
import Player from "../../../models/player-model.js";
import Representative from "../../../models/representative-model.js";
import Couch from "../../../models/couch-model.js";

class TeamsController {
   async get__create(req, res) {
      try {
         return sendRes("partials/lk_part/team_create", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async post__create(req, res) {
      try {
         let { name, description } = req.body;
         let team = await Team.create({
            creator: req.user.id,
            admins: req.user.id,
            ...req.body,
         });
         return res.json({
            message: "Команда создана",
            redirect: `lk?page=team/get__team_list/^id~${team._id}`,
         });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__edit(req, res) {
      try {
         let teamId = req.query.id;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         return sendRes("partials/lk_part/team_edit", { team }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async put__edit(req, res) {
      try {
         let teamId = req.body.teamId;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         await Team.updateOne({ _id: teamId }, req.body);
         return res.json({
            message: "Команда обновлена",
            redirect: `lk?page=team`,
         });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__team_list(req, res) {
      try {
         console.log(req.query);
         let teamId = req.query.id;
         let team = await Team.findOne({ _id: teamId });
         console.log(team);
         if (!team) return res.json({ message: "Такой команды не существует" });
         console.log(teamId);
         let players = await Player.find({ team: teamId }).populate(
            "team creator"
         );
         console.log(players);
         let playersAll = await Player.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         });
         return sendRes(
            "partials/lk_part/team_list",
            { players: players, team: team, playersAll },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async put__team_list(req, res) {
      try {
         let teamId = req.body.teamId;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         console.log(req.user, team.creator);
         if (!req.user._id.equals(team.creator._id))
            return res.json({ message: "Вы не являетесь создателем команды" });
         await Player.updateOne({ _id: req.body.playerId }, { team: teamId });
         return res.json({ message: "Игрок добавлен", reload: true });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__team_couch(req, res) {
      try {
         console.log(req.query);
         let teamId = req.query.id;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         let couches = await Couch.find({
            team: teamId,
            status_doc: { $ne: "deleted" },
         }).populate("team creator");
         let couchesAll = await Couch.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         });
         return sendRes(
            "partials/lk_part/team_couch",
            { couches, team, couchesAll },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async put__team_couch(req, res) {
      try {
         let teamId = req.body.teamId;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         if (!req.user._id.equals(team.creator._id))
            return res.json({ message: "Вы не являетесь создателем команды" });
         await Couch.updateOne({ _id: req.body.couchId }, { team: teamId });
         return res.json({ message: "Тренер добавлен", reload: true });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async delete__team_couch(req, res) {
      try {
         let teamId = req.body.teamId; // ID команды
         let couchId = req.body.couchId; // ID тренера

         // Находим команду по ID
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });

         // Проверяем, является ли пользователь создателем команды
         if (!req.user._id.equals(team.creator._id)) {
            return res.json({ message: "Вы не являетесь создателем команды" });
         }

         // Обновляем запись о тренере, удаляя команду
         await Couch.updateOne({ _id: couchId }, { $unset: { team: "" } });

         return res.json({ message: "Тренер удален", reload: true });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__team_representative(req, res) {
      try {
         let teamId = req.query.id;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         let representatives = await Representative.find({
            team: teamId,
         }).populate("team creator");
         let representativesAll = await Representative.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         });
         return sendRes(
            "partials/lk_part/team_representative",
            { representatives, team, representativesAll },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async put__team_representative(req, res) {
      try {
         let teamId = req.body.teamId;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         console.log(req.user, team.creator);
         if (!req.user._id.equals(team.creator._id))
            return res.json({ message: "Вы не являетесь создателем команды" });
         await Representative.updateOne(
            { _id: req.body.representativeId },
            { team: teamId }
         );
         return res.json({ message: "Представитель добавлен", reload: true });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__team_list_create(req, res) {
      try {
         return sendRes("partials/lk_part/team_list_create", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async post__team_list_create(req, res) {
      try {
         let { fio, date, teamId } = req.body;
         let team = await Team.findOne({ _id: teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         let player = await Player.create({
            fio,
            date,
            team: teamId,
            creator: req.user.id,
         });
         console.log(player);
         return res.json({ message: "Игрок создан" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
}
async function sendRes(path, data, res) {
   return res.render(path, data, function (err, html) {
      if (err) console.log(err);
      res.json(html);
   });
}

export default new TeamsController();
