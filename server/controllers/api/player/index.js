import Team from "../../../models/team-model.js";
import Player from "../../../models/player-model.js";

class PlayersController {
   async get__create(req, res) {
      try {
         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("name _id");
         return sendRes("partials/lk_part/player_create", { teams }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async post__create(req, res) {
      try {
         let data = req.body;
         data.creator = req.user.id;
         let team = await Team.findOne({ _id: data.team });
         if (!team) return res.json({ message: "Такой команды не существует" });
         let player = await Player.create(data);
         if (!player) return res.json({ message: "Игрок не создан, ошибка" });
         return res.json({
            message: "Игрок создан",
            redirect: "lk?page=player",
         });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__team_list(req, res) {
      try {
         let teamId = req.query.id;
         let team = await Team.findOne({ _id: teamId });
         console.log(team);
         if (!team) return res.json({ message: "Такой команды не существует" });
         console.log(teamId);
         let players = await Player.find({ team: teamId }).populate(
            "team creator"
         );
         console.log(players);

         return sendRes(
            "partials/lk_part/team_list",
            { players: players, team: team },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async post__check_duplicate(req, res) {
      try {
         console.log(req.body);
         let player = await Player.findOne({ fio: req.body.fio });
         if (player) return res.status(203).json({ data: true });
         return res.status(200).json({ data: false });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async get__edit(req, res) {
      try {
         let player = await Player.findOne({ _id: req.query.id });
         let teams = await Team.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         });
         return sendRes("partials/lk_part/player_edit", { player, teams }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   }
   async put__edit(req, res) {
      try {
         const { playerId } = req.body;
         let player = await Player.findOne({ _id: playerId });
         if (!player)
            return res.json({ message: "Такого игрока не существует" });
         player = await Player.updateOne({ _id: playerId }, req.body);
         return res.json({
            message: "Игрок обновлен",
            redirect: `lk?page=player`,
         });
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

export default new PlayersController();
