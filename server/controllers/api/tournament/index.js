import Team from "../../../models/team-model.js";
import Player from "../../../models/player-model.js";
import Judge from "../../../models/judge-model.js";
import Tournament from "../../../models/tournament-model.js";
import Match from "../../../models/match-model.js";
import Season from "../../../models/season-model.js";
import editController from "./edit-controller.js";
import groupController from "./group-controller.js";
import Commentator from "../../../models/commentator-model.js";
import Doc from "../../../models/doc-model.js";
import dbService from "../../../service/db-service.js";
import mammoth from "mammoth";
import fs from "fs";
import { Stream } from "stream";
import matchModel from "../../../models/match-model.js";
import { match } from "assert";

const Readable = Stream.Readable;

function padTo2Digits(num) {
   return num.toString().padStart(2, "0");
}

const TournamentController = {
   put__edit: editController,
   group: groupController,

   async get__create(req, res) {
      try {
         let seasons = await Season.find({ creator: req.user.id });
         return sendRes(
            "partials/lk_part/tour/tournament_create",
            { seasons },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async post__create(req, res) {
      try {
         let data = {};
         data.creator = req.user.id;
         data.basic = req.body;
         let tournament = await Tournament.create(data);
         if (!tournament)
            return res.json({ message: "Турнир не создан, ошибка" });
         return res.json({
            message: "Турнир создан",
            redirect: "/lk?page=tournament/id/" + tournament._id + "/edit",
         });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка: " + e.message });
      }
   },
   async get__template(req, res) {
      try {
         let tourId = req.params.id;
         console.log(tourId);
         let tournament = await Tournament.findOne({ _id: tourId });
         console.log(tournament);
         if (!tournament)
            return res.json({ message: "Такой команды не существует" });
         return sendRes(
            "partials/lk_part/tour/tournament_template",
            { tournament },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async put__team(req, res) {
      try {
         let tourId = req.body.tournamentId;
         console.log(tourId);
         let tournament = await Tournament.findOne({ _id: tourId });
         console.log(tournament);
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         let team = await Team.findOne({ _id: req.body.teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         tournament.teams.push(req.body.teamId);
         await tournament.save();
         return res.json({ message: "Обновлено" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async delete__team(req, res) {
      try {
         let tourId = req.body.tournamentId;
         console.log(tourId);
         let tournament = await Tournament.findOne({ _id: tourId });
         console.log(tournament);
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         let team = await Team.findOne({ _id: req.body.teamId });
         if (!team) return res.json({ message: "Такой команды не существует" });
         tournament.teams = tournament.teams.filter(
            (t) => t._id != req.body.teamId
         );
         await tournament.save();
         return res.json({ message: "Обновлено" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async put__judge(req, res) {
      try {
         let tourId = req.body.tournamentId;
         console.log(tourId);
         let tournament = await Tournament.findOne({ _id: tourId });
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         if (req.body.type == "judge") {
            let judge = await Judge.findOne({ _id: req.body.teamId });
            if (!judge)
               return res.json({ message: "Такого судьи не существует" });
            tournament.judges.push(req.body.teamId);
            await tournament.save();
            return res.json({ message: "Обновлено", reload: true });
         } else if (req.body.type == "commentator") {
            let commentator = await Commentator.findOne({
               _id: req.body.teamId,
            });
            if (!commentator)
               return res.json({
                  message: "Такого комментатора не существует",
               });
            tournament.commentators.push(req.body.teamId);
            await tournament.save();
            return res.json({ message: "Обновлено", reload: true });
         }
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async delete__judge(req, res) {
      try {
         let tourId = req.body.tournamentId;
         let tournament = await Tournament.findOne({ _id: tourId });
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         if (req.body.type == "judge") {
            let judge = await Judge.findOne({ _id: req.body.teamId });
            if (!judge)
               return res.json({ message: "Такого судьи не существует" });
            tournament.judges = tournament.judges.filter(
               (t) => t._id != req.body.teamId
            );
            await tournament.save();
            return res.json({ message: "Обновлено", reload: true });
         } else if (req.body.type == "commentator") {
            let commentator = await Commentator.findOne({
               _id: req.body.teamId,
            });
            if (!commentator)
               return res.json({
                  message: "Такого комментатора не существует",
               });
            tournament.commentators = tournament.commentators.filter(
               (t) => t._id != req.body.teamId
            );
            await tournament.save();
            return res.json({ message: "Обновлено", reload: true });
         } else
            return res.json({ message: "Такого типа команды не существует" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__edit(req, res) {
      try {
         let tourId = req.params.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         let seasons = await Season.find({ creator: req.user.id });
         console.log(tournament);
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         if (!tournament.creator.equals(req.user.id))
            return res.json({ message: "Ошибка доступа" });
         console.log(tourId);
         // let players = await Player.find({team: teamId}).populate('team creator');
         // console.log(players)

         return sendRes(
            "partials/lk_part/tour/tournament_edit",
            { tournament, seasons },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },

   async get__group(req, res) {
      try {
         let tourId = req.params.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         let groups = await tournament.getGroups();
         console.log(groups);
         return sendRes(
            "partials/lk_part/tour/tournament_group",
            { tournament, groups },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__group_create(req, res) {
      try {
         return sendRes(
            "partials/lk_part/tour/tournament_group_create",
            {},
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__group_edit(req, res) {
      try {
         return sendRes("partials/lk_part/tour/tournament_group_edit", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__judge(req, res) {
      try {
         let tourId = req.params.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         let chooseJudges = tournament.judges;
         let chooseCommentators = tournament.commentators;

         let judges = await Judge.find({
            creator: req.user.id,
            $nor: [{ _id: { $in: chooseJudges } }],
         });
         let commentators = await Commentator.find({
            creator: req.user.id,
            $nor: [{ _id: { $in: chooseCommentators } }],
         });

         return sendRes(
            "partials/lk_part/tour/tournament_judge",
            { tournament, judges, commentators },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__judge_in(req, res) {
      try {
         let tourId = req.params.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         let judges = tournament.judges;
         let commentators = tournament.commentators;
         return sendRes(
            "partials/lk_part/tour/tournament_judge_in",
            { tournament, judges, commentators },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__docs(req, res) {
      try {
         let tournament = await Tournament.findOne({ _id: req.params.id });
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         let docs = await Doc.find({
            creator: req.user.id,
            tournament: req.params.id,
         });
         return sendRes(
            "partials/lk_part/tour/tournament_docs",
            { docs, tourId: req.params.id },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__docs_create(req, res) {
      try {
         return sendRes(
            "partials/lk_part/tour/tournament_docs_create",
            {},
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async post__docs_create(req, res) {
      try {
         let data = req.body;
         let tourId = data.tournament;
         data.creator = req.user.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         if (!tournament)
            return res.json({ message: "Такого турнира не существует" });
         if (!tournament.creator.equals(req.user.id))
            return res.json({ message: "Ошибка доступа" });
         data.type = "doc";
         data.tournament = tourId;
         let doc = await Doc.create(data);
         if (!doc) return res.json({ message: "Документ не создан, ошибка" });
         return res.json({ message: "Документ создан" });
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__team(req, res) {
      try {
         const tourId = req.params.id;
         const search_query = req.query.filter_name;
         const tournament = await Tournament.findOne({ _id: tourId });
         const chooseTeams = tournament.teams;

         let teams = await Team.find({
            creator: req.user.id,
         });

         if (search_query) {
            const filterName = search_query.toLowerCase();
            teams = teams.filter((team) =>
               team.name.toLowerCase().includes(filterName)
            );
         }

         return sendRes(
            "partials/lk_part/tour/tournament_teams",
            { tournament, teams, chooseTeams },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__matches(req, res) {
      try {
         const tourId = req.params.id;

         const tournament = await Tournament.findOne({ _id: tourId });
         const chooseTeams = tournament.teams;
         const teams = await Team.find({
            creator: req.user.id,
            _id: { $in: chooseTeams },
         });

         const tournaments = await Tournament.find({
            creator: req.user.id,
            status_doc: { $ne: "deleted" },
         }).select("basic.full_name _id");

         req.query["creator"] = req.user.id;

         const matches = await Match.find({
            tournament: tourId,
            status_doc: { $ne: "deleted" },
         })
            .select(
               "team_1 team_2 stadium team_1_score team_2_score status date time format_only_day circle"
            )
            .populate("team_1 team_2")
            .lean();

         const totalMatches = await Match.countDocuments({
            tournament: tourId,
         });

         return sendRes(
            "partials/lk_part/tour/tournament_matches",
            {
               matches,
               tournament,
               tournaments,
               total: totalMatches,
               teams,
               formatDatePretty: (date, sep = ".") => {
                  date = new Date(date);
                  return [
                     padTo2Digits(date.getDate()),
                     padTo2Digits(date.getMonth() + 1),
                     date.getFullYear(),
                  ].join(sep);
               },
               padTo2Digits,
            },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__team_in(req, res) {
      try {
         console.log(req);
         let tourId = req.params.id;
         let tournament = await Tournament.findOne({ _id: tourId });
         let teams = tournament.teams;
         if (req.query?.filter_name) {
            teams = teams.filter((el) =>
               el.name.includes(req.query?.filter_name)
            );
         }
         console.log(teams);
         return sendRes(
            "partials/lk_part/tour/tournament_teams_in",
            { tournament, teams },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__team_list_create(req, res) {
      try {
         return sendRes("partials/lk_part/team_list_create", {}, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
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
   },
};

async function sendRes(path, data, res) {
   return res.render(path, data, function (err, html) {
      if (err) console.log(err);
      res.json(html);
   });
}

export default TournamentController;
