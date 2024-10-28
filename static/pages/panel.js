let test = true;

let global_data = {};

let html = {
   table: `<tbody>
                <tr>
                    <th>имя</th>
                    <th>мал</th>
                    <th>бол</th>
                    <th>мал</th>
                    <th>бол</th>
                    <th>мал</th>
                    <th>бол</th>
                </tr>`,
   player: `<tr data-id="{{id}}" data-name="{{name}}">
                <td>{{name}}</td>
                <td><input type="button" value="1" class="square30" data-type="goal_s" name="pers1_1"></td>
                <td><input type="button" value="1" class="square30" data-type="goal_b" name="pers1_2"></td>
                <td><input type="button" value="1" class="square30 yellow" data-type="yellow_s" name="pers1_3"></td>
                <td><input type="button" value="1" class="square30 yellow" data-type="yellow_b" name="pers1_4"></td>
                <td><input type="button" value="1" class="square30 red" data-type="red_s" name="pers1_5"></td>
                <td><input type="button" value="1" class="square30 red" data-type="red_b" name="pers1_6"></td>
            </tr>`,
   playeOption: `<option value="{{id}}">{{name}}</option>`,

   penalty: `<div class="h-group penalty_box" data-team="{{team}}">
                    <input type="button" value="ГОЛ" class="square40 flex-form  {{selected_goal}}" data-type="goal" name="gol-pen1">
                    <input type="button" value="" class="square40 redo-icon  {{selected_clear}}" data-type="clear" name="pass-pen1">
                    <input type="button" value="CЭЙВ" class="square40 flex-form {{selected_defeat}}" data-type="defeat" name="save-pen1" >
                </div>`,
};
let testConnect = setInterval(() => {
   if (socket.connected) {
      clearInterval(testConnect);
      socket.emit("join_panel", tableId);
   }
}, 200);
let playerTables = {
   table_1: get("#table_team_1"),
   table_2: get("#table_team_2"),
   select_1: getA("#team1-replace ,#team1-replace-by"),
   select_2: getA("#team2-replace ,#team2-replace-by"),
};
let variations_tablo = getA(".tablo_variation > input");

socket.on("reload", () => {
   location.reload();
});

let play = get("#play");
play?.addEventListener("click", (e) => {
   socket.emit("play_timer");
});

let clearTimer = get("#clear_timer");
clearTimer?.addEventListener("click", (e) => {
   socket.emit("clear_timer");
});

let changeTimer = getA("#change_timer > input");
changeTimer?.forEach((input) => {
   input.addEventListener("click", (e) => {
      socket.emit("change_timer", e.target.value);
      socket.emit("timer_test", { timestamp: Date.now() });
   });
});
let match = get("#match"),
   match_accept = get("#match_accept");
match_accept?.addEventListener("click", (e) => {
   socket.emit("match", match.value);
});
match?.addEventListener("change", (e) => {
   socket.emit("match", e.target.value);
});
let couchDiv = get("#couches");
let style = get("#panel-style");

let max_time = get("#max_time");
max_time?.addEventListener("change", (e) => {
   let data = {
      max_time: e.target.value,
   };
   socket.emit("new_data", data);
});
let scenarios = get("#scenarios");
scenarios?.addEventListener("change", (e) => {
   let data = {
      scenarios: e.target.value,
   };
   socket.emit("new_data", data);
   socket.emit("get_time");
});

style?.addEventListener("change", (e) => {
   let data = {
      style: e.target.value,
   };
   formSet.disabled = true;
   // let data_2 = {
   //     'tablo' : 'little',
   // }
   setTimeout(() => {
      formSet.disabled = false;
   }, 1001);
   // socket.emit('new_data', data_2)
   socket.emit("style", data);
});
socket.on("connect", () => {
   console.log(socket.id);
   socket.emit("join_panel", tableId);
});
socket.on("reconnect", () => {
   console.log(socket.id);
   socket.emit("join_panel", tableId);
});

socket.on("timer", (data) => {
   console.log(data);
   if (data.changed) {
      socket.emit("get_data");
   }

   get(".time").value = data.value;
   get(".time").setAttribute("data-status", data.status);
   setTimer(data);

   console.log(data.value);
});

let timInp = get(".time");
timInp?.addEventListener("focus", (e) => {
   if (timInp.getAttribute("data-status") == "play") {
      socket.emit("play_timer");
   }
   socket.emit("get_data");
});
timInp?.addEventListener("change", (e) => {
   let el = e.target;
   let input = el.value;
   input = input.replace(/[^0-9:]/g, "");
   let parts = input.split(":");
   parts = parts.map((part) => {
      if (!part || isNaN(part) || parseInt(part, 10) < 0) {
         return "00";
      }

      if (parseInt(part, 10) > 60) {
         return "60";
      }
      return part;
   }); //part && (part.length > 2 || isNaN(part) || parseInt(part, 10) < 0 || parseInt(part, 10) > 60) ? '00' : part);
   if (!parts[0]) parts[0] = "00";
   if (!parts[1]) parts[1] = "00";

   el.value = parts[0].padStart(2, "0") + ":" + parts[1].padStart(2, "0");

   socket.emit("set_timer", el.value);
});
let addPen = get("#add-pen"),
   resetPen = get("#reset-pen");
let is_foul = get("#is_fouls"),
   is_reverse = get("#is_reverse");
foul_inpts = getA(".foll_div input");
console.log(foul_inpts, is_foul);
is_foul.addEventListener("click", (e) => {
   let data = {
      is_fouls: is_foul.checked,
   };
   console.log(data);
   socket.emit("new_data", data);
});
is_reverse.addEventListener("click", (e) => {
   let data = {
      is_reverse: is_reverse.checked,
   };
   console.log(data);
   socket.emit("new_data", data);
   socket.emit("get_time");
});
let notif_type = get("#notif_type");
notif_type.addEventListener("change", (e) => {
   let type = e.target.value;
   let data = {
      notif_type: type,
   };
   socket.emit("new_data", data);
});
socket.on("update_data", (data) => {
   global_data = data;
   if (style) style.value = data.style;
   console.log(data);
   if (data.tablo) {
      variations_tablo.forEach((variation) => {
         if (variation.getAttribute("data-type") == data.tablo.type) {
            variation.classList.add("selected");
         } else variation.classList.remove("selected");
      });
   }
   if (data.match) {
      setMatch(data, 1);
      setMatch(data, 2);
   }
   if (data.scoreboard) {
      setScoreboard(data.scoreboard);
   }
   if (data.timer) {
      setTimer(data.timer);
   }

   timInp.setAttribute("data-status", data.timer.status);
   is_foul.checked = data.is_fouls;
   is_reverse.checked = data.timer.is_reverse;
   foul_inpts.forEach((inp) => (inp.disabled = !data.is_fouls));

   is_foul.disabled = false;

   notif_type.value = data.notif_type;
});

function setTimer(timer) {
   if (timer.max_time) max_time.value = timer.max_time;
   scenarios.value = timer.scenarios;
   is_reverse.checked = timer.is_reverse;
   let block = play.closest(".block");
   console.log(block);
   if (timer.status == "pause") {
      play.classList.replace("pause-icon", "play-icon");
      block.classList = "block pause";
   } else if (timer.status == "play") {
      play.classList.replace("play-icon", "pause-icon");
      block.classList = "block play";
   } else if (timer.status == "stop") {
      play.classList.replace("pause-icon", "play-icon");
      block.classList = "block";
   }
}
function setScoreboard(scoreboard) {
   get("#score_team1").value = scoreboard.team1;
   get("#score_team2").value = scoreboard.team2;
   get("#team1_color").value = scoreboard.team1_color;
   get("#team2_color").value = scoreboard.team2_color;
   get("#team1_foll").value = scoreboard.team1_foll;
   get("#team2_foll").value = scoreboard.team2_foll;
   setPenalty(scoreboard.penalty);
}
let penalty_num = 0;
penalty_numInput = get("#penalty_num");
penalty_numInput.addEventListener("input", pen_num);
function pen_num() {
   let num = penalty_numInput.value;
   if (num < 1) {
      penalty_numInput.value = 1;
      num = 1;
   }
   let penDivs = getA("#penalty_div > .h-group");
   penDivs.forEach((div) => {
      if (div.getAttribute("data-index") != num - 1) {
         div.style.display = "none";
      } else div.style.display = "flex";
   });
   console.log(penDivs.length, num);
   if (penDivs.length < num) {
      for (let i = penDivs.length; i < num; i++) {
         addPen.click();
      }
   }
}
function setPenalty(penalty) {
   let div = get("#penalty_div");
   div.innerHTML = "";
   penalty.forEach((el, i) => {
      let tempHTML = "";
      tempHTML = `<div class="h-group bigger-gap" data-index="${i}">`;
      tempHTML += html.penalty
         .replace("{{team}}", "1")
         .replace(`{{selected_${el.team1 ? el.team1 : "clear"}}}`, "selected");

      tempHTML += html.penalty
         .replace("{{team}}", "2")
         .replace(`{{selected_${el.team2 ? el.team2 : "clear"}}}`, "selected");
      tempHTML = tempHTML
         .replaceAll("{{selected_clear}}", "")
         .replaceAll("{{selected_defeat}}", "")
         .replaceAll("{{selected_goal}}", "");
      tempHTML += `</div>`;
      div.innerHTML += tempHTML;
   });
   let penDif = 5 - penalty.length;
   console.log(penDif);
   if (penDif > 0) {
      for (let i = 0; i < penDif; i++) {
         let tempHTML = "";
         tempHTML += `<div class="h-group bigger-gap" data-index="${
            i + penalty.length
         }">`;
         tempHTML += html.penalty
            .replace("{{selected_clear}}", "selected")
            .replace("{{team}}", "1");
         tempHTML += html.penalty
            .replace("{{selected_clear}}", "selected")
            .replace("{{team}}", "2");

         tempHTML += `</div>`;
         div.innerHTML += tempHTML;
      }
   }
   startPenaltys();
}
addPen.addEventListener("click", (e) => {
   let div = get("#penalty_div");

   let currLemgth = getA(".h-group.bigger-gap", div).length;
   let tempHTML = "";
   tempHTML += `<div class="h-group bigger-gap" data-index="${currLemgth}">`;
   tempHTML += html.penalty
      .replace("{{selected_clear}}", "selected")
      .replace("{{team}}", "1");
   tempHTML += html.penalty
      .replace("{{selected_clear}}", "selected")
      .replace("{{team}}", "2");

   tempHTML += `</div>`;
   div.innerHTML += tempHTML;
   let nPenalty = global_data.scoreboard.penalty;
   nPenalty.push({ team1: "clear", team2: "clear" });
   let data = {
      score: {
         penalty: nPenalty,
      },
   };
   socket.emit("new_data", data);
   startPenaltys();
});
resetPen.addEventListener("click", (e) => {
   let nPenalty = [];
   for (let i = 0; i < 5; i++) {
      nPenalty.push({ team1: "clear", team2: "clear" });
   }
   let data = {
      score: {
         penalty: nPenalty,
      },
   };
   console.log(data);
   socket.emit("new_data", data);
});
function startPenaltys() {
   pen_num();
   getA(".penalty_box > input").forEach((box) => {
      box.addEventListener("click", (e) => {
         let index = e.target
            .closest(".h-group.bigger-gap")
            .getAttribute("data-index");
         let team = e.target.closest(".penalty_box").getAttribute("data-team");
         let type = e.target.getAttribute("data-type");
         let nPenalty = global_data.scoreboard.penalty;
         for (let i = 0; i <= index; i++) {
            if (!nPenalty[i]) {
               nPenalty[i] = {
                  team1: "clear",
                  team2: "clear",
               };
            }
         }

         nPenalty[index]["team" + team] = type;
         let data = {
            score: {
               penalty: nPenalty,
            },
         };
         console.log(data);
         socket.emit("new_data", data);
      });
   });
}

console.log(socket.id);
let textInpts = getA(
   'input[type="text"], input[type="color"], input[type="number"]'
);
console.log(textInpts);

textInpts.forEach((input) => {
   let fTimer;
   function f(e) {
      if (fTimer) {
         clearTimeout(fTimer);
      }
      fTimer = setTimeout(
         function () {
            fTimer = void 0;
            console.log("dfsdfsdf");
            standartListener(e);
         }.bind(this),
         500
      );
   }
   input.addEventListener("input", f);
});
let scoreDivs = getA(".score_div");
let resetScore = get("#score_reset");
resetScore?.addEventListener("click", (e) => {
   socket.emit("reset_score");
});
let reset_all = get("#reset_all");
reset_all?.addEventListener("click", (e) => {
   socket.emit("reset_all");
});
let reload_all = get("#reload_all");
reload_all?.addEventListener("click", (e) => {
   socket.emit("reload_all");
});
scoreDivs.forEach((div) => {
   let plus_minus = getA('input[type="button"]', div),
      score = get('input[type="number"]', div);
   console.log(plus_minus, score);
   plus_minus.forEach((btn) => btn.addEventListener("click", listener));
   function listener(e) {
      let name = e.target.name;
      if (name == "plus") {
         score.value = +score.value + 1;
      } else if (name == "minus") {
         score.value = +score.value - 1;
      }
      let data = {
         score: {},
      };
      data.score[score.name] = score.value;
      socket.emit("new_data", data);
   }
});
function standartListener(e) {
   let data = {};
   let name = e.target.name,
      value = e.target.value;
   if (e.target.getAttribute("data-type") == "score") {
      data.score = {};
      data.score[name] = value;
   } else data[name] = value;
   console.log(data);
   socket.emit("new_data", data);
}

function sendTime() {
   let time = `${minuts}:${seconds}`;
   let data = {
      name: "timer",
      value: time,
   };
   socket.emit("new_data", data);
}
let formSet = get("#variants");
variations_tablo.forEach((variation) => {
   variation.addEventListener("click", (e) => {
      if (formSet.disabled) return;
      formSet.disabled = true;
      let data = {
         tablo: e.target.getAttribute("data-type"),
      };
      setTimeout(() => {
         formSet.disabled = false;
      }, 1301);
      socket.emit("new_data", data);
   });
});

function setMatch(data, team) {
   getA(".data_team_" + team).forEach((el) => {
      console.log(el);
      if (el.localName == "input") {
         el.value = data["team" + team + "_name"];
         //el.setAttribute('readonly', true)
      } else if (el.getAttribute("data-type") == "replace")
         el.innerHTML = "Замена " + data.match["team_" + team].name;
      else el.innerHTML = data.match["team_" + team].name;
   });
   match.value = data.match._id;
   console.log(data);
}
