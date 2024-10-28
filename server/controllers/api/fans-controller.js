import League from "../../models/league-model.js";
import User from "../../models/user-model.js";
import Tournament from "../../models/tournament-model.js";
import Match from "../../models/match-model.js";
import Team from "../../models/team-model.js";
import Player from "../../models/player-model.js";
import PlayerResult from "../../models/playerResult-model.js";
import Commentator from "../../models/commentator-model.js";
import Judge from "../../models/judge-model.js";
import Doc from "../../models/doc-model.js";

const FansController = {
   async get__tournament(req, res) {
      try {
         const { id } = req.params;
         //console.log(req)
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         }).sort({ date: "asc" });
         matches = sortMatches(matches);

         let futureMatches = await getFutureMatches(matches);
         futureMatches = await getDates(futureMatches);
         // console.log(futureMatches);
         return sendRes(
            "fans/fans_tour/tournament",
            { tournament, futureMatches, compareDates },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__calendar(req, res) {
      try {
         const { id } = req.params;
         //console.log(req)
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         }).sort({ date: "asc" });
         matches = await getDates(matches);

         return sendRes(
            "fans/fans_tour/calendar",
            { tournament, matches, compareDates },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },

   async get__tables(req, res) {
      try {
         const { id } = req.params;
         //console.log(req)
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         });
         let previusMatches = await getPreviousMatches(matches);
         //  console.log(previusMatches);
         return sendRes(
            "fans/fans_tour/tables",
            { tournament, previusMatches, compareDates, getTeamData },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__teams(req, res) {
      try {
         const { id } = req.params;
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }

         return sendRes(
            "fans/fans_tour/teams",
            { tournament, compareDates },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__team(req, res) {
      try {
         const { id } = req.params;
         const team = await Team.findById(id);
         // await Match.deleteMany()
         // await PlayerResult.deleteMany()

         if (!team || !team.creator.equals(req.fans_league.creator)) {
            return res.json({ message: "Команда не найдена" });
         }

         let matches = await Match.find({
            $or: [{ team_1: id }, { team_2: id }],
            status_doc: { $ne: "deleted" },
         });

         matches = sortMatches(matches);
         matches = await getDates(matches);

         let previusMatches = await getPreviousMatches(matches);
         let futureMatches = await getFutureMatches(matches);

         return sendRes(
            "fans/fans_members/team",
            { team, matches, previusMatches, getTeamData, futureMatches },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__docs(req, res) {
      try {
         const { id } = req.params;
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let docs = await Doc.find({
            creator: req.fans_league.creator,
            tournament: req.params.id,
         });
         return sendRes(
            "fans/fans_tour/docs",
            { docs, tournament, compareDates },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__doc(req, res) {
      try {
         let guide = await Doc.findById(req.params.id);
         let tournament = await Tournament.findById(guide.tournament);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         return sendRes(
            "fans/fans_tour/doc",
            { guide, tournament, compareDates },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__goalkeepers(req, res) {
      try {
         const { id } = req.params;
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         }).select(
            "results_1 results_2 date time result_1.player result_2.player team_1_score team_2_score"
         );

         let previusMatches = await getPreviousMatches(matches);
         let playersResult = new Map();
         let goalkeepers = new Set();

         // Using forEach instead of map since we are not transforming the array
         previusMatches.forEach((match) => {
            // Check results for team 1
            if (match.results_1) {
               match.results_1.forEach((result) => {
                  if (result.player && result.player.ampl === "goalkeeper") {
                     result["match"] = match; // Attach match to result
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        goalkeepers.add(result.player); // Add to goalkeepers set
                     }
                     playersResult.get(result.player.id).push(result); // Store result
                  }
               });
            }

            // Check results for team 2
            if (match.results_2) {
               match.results_2.forEach((result) => {
                  if (result.player && result.player.ampl === "goalkeeper") {
                     result["match"] = match; // Attach match to result
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        goalkeepers.add(result.player); // Add to goalkeepers set
                     }
                     playersResult.get(result.player.id).push(result); // Store result
                  }
               });
            }
         });

         // Convert Set to array before sending response
         const goalkeeperArray = Array.from(goalkeepers);

         return sendRes(
            "fans/fans_tour/goalkeepers",
            {
               goalkeepers: goalkeeperArray,
               playersResult,
               previusMatches,
               tournament,
               getTeamData,
               compareDates,
            },
            res
         );
      } catch (e) {
         console.error(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__bombers(req, res) {
      try {
         const { id } = req.params;
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         }).select(
            "results_1 results_2 date time result_1.player result_2.player"
         );

         let previusMatches = await getPreviousMatches(matches);
         let playersResult = new Map();
         let players = new Set();

         previusMatches.map((match) => {
            if (match.results_1) {
               match.results_1.map((result) => {
                  result["match"] = match;
                  if (result.player && result.player.id) {
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        players.add(result.player);
                     }
                     playersResult.get(result.player.id).push(result);
                  }
               });
            }
            if (match.results_2) {
               match.results_2.map((result) => {
                  result["match"] = match;
                  if (result.player && result.player.id) {
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        players.add(result.player);
                     }
                     playersResult.get(result.player.id).push(result);
                  }
               });
            }
         });

         return sendRes(
            "fans/fans_tour/bombers",
            {
               tournament,
               players,
               playersResult,
               previusMatches,
               compareDates,
            },
            res
         );
      } catch (e) {
         console.error(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__assistants(req, res) {
      try {
         const { id } = req.params;
         const tournament = await Tournament.findById(id);
         if (
            !tournament ||
            !tournament.creator.equals(req.fans_league.creator)
         ) {
            return res.json({ message: "Турнир не найден" });
         }
         let matches = await Match.find({
            tournament: id,
            status_doc: { $ne: "deleted" },
         }).select(
            "results_1 results_2 date time result_1.player result_2.player"
         );

         let previusMatches = await getPreviousMatches(matches);
         let playersResult = new Map();
         let players = new Set();

         previusMatches.map((match) => {
            if (match.results_1) {
               match.results_1.map((result) => {
                  result["match"] = match;
                  if (result.player && result.player.id) {
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        players.add(result.player);
                     }
                     playersResult.get(result.player.id).push(result);
                  }
               });
            }
            if (match.results_2) {
               match.results_2.map((result) => {
                  result["match"] = match;
                  if (result.player && result.player.id) {
                     if (!playersResult.has(result.player.id)) {
                        playersResult.set(result.player.id, []);
                        players.add(result.player);
                     }
                     playersResult.get(result.player.id).push(result);
                  }
               });
            }
         });

         return sendRes(
            "fans/fans_tour/assistants",
            {
               tournament,
               players,
               playersResult,
               previusMatches,
               compareDates,
            },
            res
         );
      } catch (e) {
         console.error(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__calendar_team(req, res) {
      try {
         const { id } = req.params;
         const team = await Team.findById(id);
         if (!team || !team.creator.equals(req.fans_league.creator)) {
            return res.json({ message: "Команда не найдена" });
         }
         let matches = await Match.find({
            $or: [{ team_1: id }, { team_2: id }],
            status_doc: { $ne: "deleted" },
         });
         matches = sortMatches(matches);
         matches = await getDates(matches);
         //  console.log(matches);
         let previusMatches = await getPreviousMatches(matches);
         return sendRes(
            "fans/fans_members/calendar",
            { team, matches, previusMatches, getTeamData },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__roster_team(req, res) {
      try {
         const { id } = req.params;
         const team = await Team.findById(id);
         if (!team || !team.creator.equals(req.fans_league.creator)) {
            return res.json({ message: "Команда не найдена" });
         }
         let matches = await Match.find({
            $or: [{ team_1: id }, { team_2: id }],
            status_doc: { $ne: "deleted" },
         });
         matches = sortMatches(matches);
         matches = await getDates(matches);
         let previusMatches = await getPreviousMatches(matches);

         let players = await Player.find({ team: id }).populate("team creator");
         let playersResult = await getPlayersResult(players);
         console.log(playersResult);
         return sendRes(
            "fans/fans_members/roster",
            { team, players, playersResult, previusMatches, getTeamData },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__players(req, res) {
      const league_address = req.query.address;
      console.log(league_address);

      try {
         const matches = await Match.find({
            creator: req.fans_league.creator._id,
            status_doc: { $ne: "deleted" },
         }).select("results_1 results_2 date time");

         if (!matches) res.json({ message: "Не удалось получить матчи" });

         let previusMatches = await getPreviousMatches(matches);
         let playersResult = {};
         console.time("time");

         let players = await Player.find({
            creator: req.fans_league.creator._id,
            status_doc: { $ne: "deleted" },
         }).populate("team creator");

         let league = await League.findOne({ address: league_address });

         previusMatches.map((match) => {
            if (match.results_1) {
               match.results_1.map((result) => {
                  if (result.player && result.player.id) {
                     if (!playersResult[result.player.id])
                        playersResult[result.player.id] = [];
                     playersResult[result.player.id].push(result);
                  }
               });
            }
            if (match.results_2) {
               match.results_2.map((result) => {
                  if (result.player && result.player.id) {
                     if (!playersResult[result.player.id])
                        playersResult[result.player.id] = [];
                     playersResult[result.player.id].push(result);
                  }
               });
            }
         });

         console.timeEnd("time");

         return sendRes(
            "fans/fans_members/players",
            {
               players,
               playersResult,
               previusMatches,
               getTeamData,
            },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__player(req, res) {
      try {
         const player = await Player.findById(req.params.id);

         if (!player || !player.creator.equals(req.fans_league.creator)) {
            return res.json({ message: "Игрок не найден" });
         }

         //let results = await PlayerResult.find({player: req.params.id, is_active: true, match: { $exists: true, $ne: null }, 'match.status_doc': { $ne: 'deleted' }}).populate('player team match');
         // const results = await PlayerResult.aggregate([
         //    {
         //       $match: {
         //          player: req.params.id,
         //          is_active: true,
         //       },
         //    },
         //    {
         //       $lookup: {
         //          from: "matches",
         //          localField: "match",
         //          foreignField: "_id",
         //          as: "match",
         //       },
         //    },
         //    {
         //       $match: {
         //          "match.status_doc": { $ne: "deleted" },
         //       },
         //    },
         // ]);

         const results = await PlayerResult.find({
            player: req.params.id,
            // is_active: true,
            status_doc: "active",
            match: { $exists: true, $ne: null },
         }).populate("match player team");

         //  console.log(results);
         return sendRes("fans/fans_members/player", { player, results }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
      //let total = await Player.countDocuments({creator: req.user.id}) ;
   },
   async get__judges(req, res) {
      try {
         let judges = await Judge.find({ creator: req.fans_league.creator });
         return sendRes("fans/fans_members/judges", { judges }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__judge(req, res) {
      try {
         let judge = await Judge.findById(req.params.id);
         return sendRes("fans/fans_members/judge", { judge }, res);
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__commentators(req, res) {
      try {
         let commentators = await Commentator.find({
            creator: req.fans_league.creator,
         });
         return sendRes(
            "fans/fans_members/commentators",
            { commentators },
            res
         );
      } catch (e) {
         console.log(e);
         return res.json({ message: "Произошла ошибка" });
      }
   },
   async get__commentator(req, res) {
      try {
         let commentator = await Commentator.findById(req.params.id);
         return sendRes("fans/fans_members/commentator", { commentator }, res);
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

async function getPlayersResult(players) {
   try {
      let results = {};
      await Promise.all(
         players.map(async (item) => {
            results[item._id] = await PlayerResult.find({
               player: item._id,
               is_active: true,
               "match.status_doc": "active",
            }).populate("player team match");
         })
      );
      return results;
   } catch (e) {
      console.error(e);
      return {};
   }
}

async function getFutureMatches(matches) {
   try {
      return matches.filter((item) => {
         //return true
         return new Date(`${item.date} ${item.time || "00:00"}`) > Date.now();
      });
   } catch (e) {
      console.error(e);
      return matches;
   }
}
async function getPreviousMatches(matches) {
   try {
      return matches.filter((item) => {
         return new Date(`${item.date} ${item.time || "00:00"}`) < Date.now();
      });
   } catch (e) {
      console.error(e);
      return matches;
   }
}
async function getDates(matches) {
   try {
      return matches.map((match) => {
         let date = new Date(`${match.date} ${match.time || "00:00"}`);
         return {
            ...match._doc,
            format_min: formatDate(date, "minuts"),
            format_only_day: formatDate(date, "only_days"),
         };
      });
   } catch (e) {
      console.error(e);
      return matches;
   }
}
let getTeamData = (team, matches) => {
   let teamData = {
      count_matches: matches.length,
      count_wins: 0,
      count_goals: 0,
      count_tournaments_set: new Set(),
      results: [],
   };
   //previusMatches = previusMatches.sort((a, b) => a.time.localeCompare(b.time));
   for (let i = 0; i < matches.length; i++) {
      if (matches[i].tournament)
         teamData.count_tournaments_set.add(matches[i].tournament.id);
   }
   let results = matches.map((match) => {
      let data = {
         id: match.id,
      };
      if (team.id == match.team_2.id && team.id != match.team_1.id) {
         data.team_1 = match.team_2;
         data.team_2 = match.team_1;
         data.team_1_score = match.team_2_score;
         data.team_2_score = match.team_1_score;
         return data;
      }
      data.team_1 = match.team_1;
      data.team_2 = match.team_2;
      data.team_1_score = match.team_1_score;
      data.team_2_score = match.team_2_score;
      return data;
   });
   results = results.map((match) => {
      let data = {
         id: match.id,
         result:
            match.team_1_score > match.team_2_score
               ? "В"
               : match.team_1_score < match.team_2_score
               ? "П"
               : "Н",
         goals: match.team_1_score,
      };
      return data;
   });
   teamData.results = results;

   teamData.count_wins = results.filter((match) => match.result == "В").length;
   teamData.count_goals = results.reduce((acc, match) => acc + match.goals, 0);
   return teamData;
};
const sortMatches = (matches) => {
   return matches.sort(function (a, b) {
      let af = a.date;
      let bf = b.date;
      let as = new Date(af + " " + a?.time || "00:00").getTime();
      let bs = new Date(bf + " " + b?.time || "00:00").getTime();

      if (af == bf) {
         return as > bs ? -1 : as < bs ? 1 : 0;
      } else {
         return af > bf ? -1 : 1;
      }
   });
};

const compareDates = (from, to) => {
   if (!from || !to) return "Неопределено";

   let dateNow = new Date();
   let dateFrom = new Date(from);
   let dateTo = new Date(to);
   if (dateNow > dateFrom && dateNow < dateTo) {
      return "Идёт";
   } else if (dateNow > dateTo) {
      return "Завершён";
   } else if (dateNow < dateFrom) {
      return "Не начат";
   }
   return "Неопределено";
};

function formatDate(date, type) {
   let args = {
      year: "numeric",
      month: "long",
      day: "numeric",
   };
   switch (type) {
      case "days":
         args = {
            year: "numeric",
            month: "long",
            day: "numeric",
         };
         break;
      case "only_days":
         args = {
            month: "long",
            day: "numeric",
         };
         break;
      case "hours":
         args = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
         };
         break;

      case "minuts":
         args = {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
         };
         break;
      case "full":
         args = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
         };
         break;
   }
   let formatter = new Intl.DateTimeFormat("ru", args);

   return formatter.format(date);
}

export default FansController;
