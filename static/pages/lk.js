let nav = get(".navbar_body");
let lk_main = get("#lk_main");
let links = getA("p", nav);
let account_btn = get("#header_account");
let logout_btn = get("#logout_btn");
let panel_slot_btn = get("#header_panel"),
   panel_slot = get("#panel_slot");
account_btn.addEventListener("click", (e) => {
   logout_btn.classList.toggle("active");
});
logout_btn.addEventListener("click", (e) => {
   logout();
});
console.log(links);
links.forEach((link) => {
   let href = link.getAttribute("data-href");
   if (href)
      link.addEventListener("click", (e) => {
         linkListener(e);
         changeNav(e);
      });
});
function changeNav(e, href) {
   if (e) {
      href = e.target.getAttribute("data-href");
   }
   href = href.split("/")[0];
   href = href.split("&")[0];
   console.log(params, href);
   links.forEach((link) => {
      if (link.getAttribute("data-href") != href)
         link.classList.remove("navbar_selected");
      else link.classList.add("navbar_selected");
   });
}
if (params.page) {
   (async () => {
      let href = params.page.replace(/\^id~(.+)/, "?id=$1");
      console.log(href);
      for (let key in params) {
         if (key.includes("filter")) href += `&${key}=${params[key]}`;
         if (key == "page_n") href += `&${key}=${params[key]}`;
         if (key == "status") href += `&${key}=${params[key]}`;
      }
      changeNav(null, href);
      if (!(await checkTournament(removeTrailingSlash(href)))) getPage(href);
   })();
} else {
   getPage("profile");
}
async function checkTournament(str, history_change = false) {
   const regexFormatAny = /^tournament\/id\/[^\/]+$/;
   const regexFormatAny2 = /^tournament\/id\/[^\/]+\/.+$/;

   const isFormatAny = regexFormatAny.test(str);
   const containsAny2 = regexFormatAny2.test(str);
   console.log({ isFormatAny, containsAny2 });
   if (isFormatAny || containsAny2) {
      const regex = /^(tournament\/id\/[^\/]+)\/.+$/;
      const regex2 = /^(match\/id\/[^\/]+)\/.+$/;
      console.log(str);
      let templateHref = str.replace(regex, "$1").replace(regex2, "$1");
      console.log(templateHref);
      await getPage(templateHref, lk_main, history_change);
      if (containsAny2) {
         console.log("containsAny2", str);
         let tour_body = get("#tour_body");
         await getPage(str, tour_body, history_change);
         let tour_navs = getA(".sub_nav_link");
         tour_navs.forEach((link) => {
            link.classList.remove("active_t_button");
         });
         get(`.sub_nav_link[data-href="${str.split("_")[0]}"]`).classList.add(
            "active_t_button"
         );
      }
      console.log("checkTournament");

      return true;
   }
   console.log("checkTournament false");
   return false;
}
window.addEventListener(
   "popstate",
   async function (event) {
      let href = location.href.split("?page=")[1];
      // The popstate event is fired each time when the current history entry changes.
      if (!(await checkTournament(removeTrailingSlash(href), true)))
         getPage(href, lk_main, true);
   },
   false
);
async function getPage(href, destInHtml = lk_main, history_change = false) {
   const baseUrl = "/api/lk/";
   const cleanedHref = href.replace(/(\?id=)(.+)/, "^id~$2");
   const pageUrl = `${baseUrl}${href.replace("&", "?")}`;
   let initHref = cleanedHref.split("?")[0].split("&")[0];
   console.log(initHref);
   const response = await sendFetch(pageUrl, null, "GET");
   destInHtml.innerHTML = response ? response : "Страница не найдена";

   params.subHref = href.split("?")[1] || href;
   //history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);
   if (!history_change) {
      history.pushState({ page: 1 }, "", `?page=${location.search}`);
      history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);
   }
   const navLinks = getA(".nav_link");
   navLinks.forEach((link) => {
      if (!link.hasEventListener("click")) {
         link.addEventListener("click", linkListener);
      }
   });
   let defLinks = getA(".def_link");
   defLinks.forEach((link) => {
      if (!link.hasEventListener("click")) {
         link.addEventListener("click", (e) => {
            e.preventDefault();
            location.href = e.target.getAttribute("data-href");
         });
      }
   });
   let vectorLinks = getA(".vector_link");
   vectorLinks.forEach((link) => {
      if (!link.hasEventListener("click")) {
         link.addEventListener("click", (e) => {
            e.preventDefault();
            let destS = e.target.getAttribute("data-dest");
            let el = get("#" + destS);
            if (el) getPage(link.getAttribute("data-href"), el);
         });
      }
   });
   initHref = initHref
      .replace(/\/id\/[^\/]+(\/[^\/]*)?/, "/id$1")
      .replace(/(get__group_edit).*/, "$1")
      .split("/^id~")[0];
   console.log(initHref);
   inits[removeTrailingSlash(initHref)]?.(href);
   setImgListener();
   init__filter();
   changeNav(null, href);
   initDel(params.subHref);
   return true;
}
function removeTrailingSlash(str) {
   return str.replace(/\/$/, "");
}
async function linkListener(e) {
   e.preventDefault();
   let nav = e.target.closest("*[data-href]");
   let href = nav.getAttribute("data-href");
   console.log(href);
   if (nav.getAttribute("new_tab")) {
      const baseUrl = "/lk?page=";
      const pageUrl = `${baseUrl}${href.replace("&", "?")}`;
      window.open(pageUrl, "_blank");
   } else getPage(href);
}
let hidNav = get(".header_hide_navbar");
let navDiv = get(".navbar");
hidNav.addEventListener("click", (e) => {
   navDiv.classList.toggle("navbar_mini");
});

let init_decorator = (func) => {
   let n_links = getA("li", nav);
   n_links.forEach((link) => {
      if (!link.hasEventListener("click"))
         link.addEventListener("click", linkListener);
   });

   return func;
};
let inits = {
   league: init__league,
   profile: init__profile,
   team: init__team,
   "team/get__edit": init__team_edit,
   "team/get__create": init__team_create,
   "team/get__team_list": init__team_list,
   "team/get__team_list_create": init__team_list_create,
   "team/get__team_representative": init__team_representative,
   "team/get__team_couch": init__team_couch,
   match: init__match,
   "match/get__create": init__match_create,
   "tournament/id/matches": init__tournament_matches,
   "match/get__create_calendar": init__match_create_calendar,
   "match/id/get__edit": init__match_edit,
   tournament: init__tournament,
   "tournament/get__create": init__tournament_create,
   "tournament/id": init__tournament_template,
   "tournament/id/edit": init__tournament_edit,
   "tournament/id/team": init__tournament_team,
   "tournament/id/team_in": init__tournament_team_in,
   "tournament/id/judge": init__tournament_judge,
   "tournament/id/judge_in": init__tournament_judge_in,
   "tournament/id/group": init__tournament_group,
   "tournament/id/get__group_create": init__tournament_group_create,
   "tournament/id/get__group_edit": init__tournament_group_edit,
   "tournament/id/docs_create": init__tournament_docs_create,
   player: init__player,
   "player/get__create": init__player_create,
   "player/get__edit": init__player_edit,
   "representative/get__create": init__representative_create,
   "representative/get__edit": init__representative_edit,
   "couch/get__create": init__couch_create,
   "couch/get__edit": init__couch_edit,
   "judge/get__create": init__judge_create,
   "judge/get__edit": init__judge_edit,
   "commentator/get__create": init__commentator_create,
   "commentator/get__edit": init__commentator_edit,
   season: init__season,
   "season/get__create": init__season_create,
   "season/get__edit": init__season_edit,
   user: init__user,
   style: init__style,
   "transfer/get__create": init__transfer_create,
   "guide/get__create": init__guide_create,
};
for (let key in inits) {
   inits[key] = init_decorator(inits[key]);
}
function init__season() {}
function init__season_create() {
   let form = get("#season_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/season/post__create", JSON.stringify(data), "POST");
   });
}
function init__season_edit() {
   let form = get("#season_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.playerId = form.getAttribute("data-id");
      sendFetch("/api/lk/season/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__user() {
   let btns = getA(".table_links");
   btns.forEach((el) => {
      el.addEventListener("click", (e) => {
         e.preventDefault();
         let data = {
            userId: e.target.getAttribute("data-id"),
            type: e.target.getAttribute("data-type"),
         };
         if (data.type === "change_block") {
            data.new_date = get("#new_date").value;
         }
         sendFetch("/api/lk/user/put__edit", JSON.stringify(data), "PUT");
      });
   });
   let delBtns = getA(".delete_user");
   delBtns.forEach((el) => {
      el.addEventListener("click", (e) => {
         e.preventDefault();
         let answer = confirm("Удалить пользователя и все его данные?");
         if (!answer) return;
         let data = {
            userId: e.target.getAttribute("data-id"),
            type: e.target.getAttribute("data-type"),
         };
         sendFetch("/api/lk/user/delete__user", JSON.stringify(data), "DELETE");
      });
   });
}
function init__tournament() {}
function init__tournament_template() {
   let tour_navs = getA(".sub_nav_link");
   let tour_body = get("#tour_body");
   tour_navs.forEach((link) => {
      link.addEventListener("click", (e) => {
         e.preventDefault();
         let href = e.target.getAttribute("data-href");
         getPage(href, tour_body);
         tour_navs.forEach((link) => {
            link.classList.remove("active_t_button");
         });
         link.classList.add("active_t_button");
      });
   });
}
function init__league() {
   let form = get("#league_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/put__league", JSON.stringify(data), "PUT");
   });
}
function init__tournament_create() {
   let form = get("#tournament_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch(
         "/api/lk/tournament/post__create",
         JSON.stringify(data),
         "POST"
      );
   });
}

function init__tournament_matches() {
   const addMatchBtn = document.getElementById("match-create");
   const saveAllMatchesBtn = document.getElementById("save-all-matches");
   const matchesTable = document
      .querySelector(".commands_table")
      .querySelector("tbody");

   const tournamentId = document.getElementById("tournament-id").dataset.id;
   let newMatchesData = [];

   addMatchBtn.addEventListener("click", () => {
      const newRow = createNewMatchRow();
      matchesTable.insertAdjacentHTML("afterbegin", newRow);
   });

   saveAllMatchesBtn.addEventListener("click", () => {
      newMatchesData = [];
      const rows = matchesTable.querySelectorAll("tr[data-match-id='']");

      rows.forEach((row) => {
         const matchData = collectMatchData(row);
         newMatchesData.push(matchData);
      });

      if (newMatchesData.length > 0) {
         saveAllMatches(newMatchesData);
      } else {
         alert("Нет матчей для сохранения.");
      }
   });

   function saveAllMatches(matches) {
      fetch("https://sporlive.ru/api/lk/match/post__create", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            matches: matches,
            tournament: tournamentId,
         }),
      })
         .then((response) => response.json())
         .then((data) => {
            alert(data.message);
         })
         .catch((error) => {
            console.error("Ошибка:", error);
         });
   }

   document.body.addEventListener("click", (event) => {
      if (event.target.classList.contains("update-match-btn")) {
         const row = event.target.closest("tr[data-match-id]");
         if (row) {
            const matchId = row.getAttribute("data-match-id");
            const matchData = collectMatchData(row);
            updateMatch(matchId, matchData, !Boolean(matchId));
         }
      }
   });

   function createNewMatchRow() {
      const teamsDataElement = document.getElementById("teams-data");
      const teamsData = JSON.parse(teamsDataElement.dataset.teams);

      const teamOptions = teamsData
         .map((team) => `<option value="${team._id}">${team.name}</option>`)
         .join("");

      const newMatchId = "new_" + Date.now(); // Временный ID для новой строки
      return `
          <tr data-match-id="" style="background: #dddddd;">
              <td></td>
              <td>
                  <select name="team_1">
                     <option value="">Выберите команду</option>
                     ${teamOptions}
                  </select>
              </td>
              <td>
                  <select name="team_2">
                     <option value="">Выберите команду</option>
                     ${teamOptions}
                  </select>
              </td>
              <td><input type="date" name="date"></td>
              <td><input type="time" name="time" id="time" value="" /></td>
              <td>
                  <input type="number" name="team_1_score" value="0" />
                  <span>:</span>
                  <input type="number" name="team_2_score" value="0" />
              </td>
              <td>
                  <input type="text" name="circle" value="" />
              </td>
              <td><input type="text" name="stadium" id="stadium" value="" /></td>
              <td>
                  <button class="update-match-btn">Сохранить</button>
              </td>
          </tr>
      `;
   }

   function collectMatchData(row) {
      return {
         team_1: row.querySelector('select[name="team_1"]').value,
         team_2: row.querySelector('select[name="team_2"]').value,
         date: row.querySelector('input[name="date"]').value,
         team_1_score: row.querySelector('input[name="team_1_score"]').value,
         team_2_score: row.querySelector('input[name="team_2_score"]').value,
         circle: row.querySelector('input[name="circle"]').value,
         time: row.querySelector('input[name="time"]').value,
         stadium: row.querySelector('input[name="stadium"]').value,
         tournament: tournamentId,
      };
   }

   function updateMatch(matchId, matchData, isCreate) {
      console.log(`Обновление матча с ID: ${matchId}`);
      console.log("Данные матча:", matchData);

      // Здесь ваша логика обновления матча
      // Например, отправка AJAX-запроса на сервер

      fetch(
         `https://sporlive.ru/api/lk/match/${
            isCreate ? "post__create" : "put__edit"
         }`,
         {
            method: isCreate ? "POST" : "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               matchId: matchId,
               ...matchData,
            }),
         }
      )
         .then((response) => response.json())
         .then((data) => {
            alert(data.message);
         })
         .catch((error) => {
            console.error("Ошибка:", error);
         });
   }
}

function init__tournament_edit(href) {
   if (!get("#tour_body")) {
      checkTournament(removeTrailingSlash(href));
   }
   console.log("init__tournament_edit");
   let forms = getA(".tournament_edit__form");
   let forms_dest = {};
   forms.forEach((form) => {
      form.addEventListener("submit", async (e) => {
         console.log(form);
         e.preventDefault();
         let tourId = get("#tour_body").getAttribute("data-id");
         let data = await formGetData(form);
         data.tournamentId = tourId;
         let dest = form.getAttribute("data-submit");
         if (!dest) {
            alert("Неизвестная ошибка");
            return;
         }
         console.log(dest, data);
         sendFetch(
            `/api/lk/tournament/put__edit/${dest}`,
            JSON.stringify(data),
            "PUT"
         );
      });
   });
   console.log(forms_dest);
   let tourEditNavs = getA(".tour_edit_navs > input");
   tourEditNavs.forEach((link) => {
      link.addEventListener("click", (e) => {
         e.preventDefault();
         let href = e.target.getAttribute("data-dest");
         forms.forEach((form) => {
            //console.log(href, form.getAttribute('data-submit'))
            if (form.getAttribute("data-submit") == href) {
               form.classList.add("active");
            } else {
               form.classList.remove("active");
            }
         });
         tourEditNavs.forEach((link) => {
            if (link.getAttribute("data-dest") == href) {
               link.classList.add("active_t_button");
            } else {
               link.classList.remove("active_t_button");
            }
         });
      });
   });
}
function init__tournament_team() {
   let tourId = get("#tour_body").getAttribute("data-id");
   let addBtns = getA(".team_add");
   addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         let data = {
            tournamentId: tourId,
            teamId: e.target.getAttribute("data-id"),
         };
         sendFetch("/api/lk/tournament/put__team", JSON.stringify(data), "PUT");
      });
   });

   const checkboxes = document.querySelectorAll("input[data-id]");
   const tournamentId = document
      .querySelector("[data-tour-id]")
      .getAttribute("data-tour-id");

   checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
         const teamId = e.target.getAttribute("data-id");
         const isChecked = e.target.checked;

         console.log({ teamId, isChecked });

         fetch(
            `/api/lk/tournament/${isChecked ? "put__team" : "delete__team"}`,
            {
               method: isChecked ? "PUT" : "DELETE",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  teamId,
                  tournamentId,
               }),
            }
         )
            .then((response) => response.json())
            .then((data) => {
               // alert(data.message);
            });
      });
   });
}
function init__tournament_team_in() {
   let tourId = get("#tour_body").getAttribute("data-id");
   let addBtns = getA(".team_add");
   addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         let data = {
            tournamentId: tourId,
            teamId: e.target.getAttribute("data-id"),
         };
         sendFetch(
            "/api/lk/tournament/delete__team",
            JSON.stringify(data),
            "DELETE"
         );
      });
   });
}
function init__tournament_judge() {
   let tourId = get("#tour_body").getAttribute("data-id");
   let addBtns = getA(".judge_add");
   addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         let data = {
            tournamentId: tourId,
            teamId: e.target.getAttribute("data-id"),
            type: e.target.getAttribute("data-type"),
         };
         sendFetch(
            "/api/lk/tournament/put__judge",
            JSON.stringify(data),
            "PUT"
         );
      });
   });
}
function init__tournament_judge_in() {
   let tourId = get("#tour_body").getAttribute("data-id");
   let addBtns = getA(".judge_add");
   addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         let data = {
            tournamentId: tourId,
            teamId: e.target.getAttribute("data-id"),
            type: e.target.getAttribute("data-type"),
         };
         sendFetch(
            "/api/lk/tournament/delete__judge",
            JSON.stringify(data),
            "DELETE"
         );
      });
   });
}
function init__tournament_group(href) {
   if (!get("#tour_body")) {
      checkTournament(removeTrailingSlash(href));
   }
   let tour_navs = getA(".sub_nav_link");
   let tour_body = get("#tour_body");
   tour_navs.forEach((link) => {
      if (!link.hasEventListener("click")) {
         link.addEventListener("click", (e) => {
            e.preventDefault();
            let href = e.target.getAttribute("data-href");
            console.log(href, e.target);
            getPage(href, tour_body);
         });
      }
   });

   console.log("init__tournament_group");
}
function init__tournament_group_edit() {
   let groupDivs = getA(".groups_body");
   let groupEditNavs = getA(".group_navs > input");
   groupEditNavs.forEach((link) => {
      link.addEventListener("click", (e) => {
         e.preventDefault();
         let href = e.target.getAttribute("data-dest");
         groupDivs.forEach((div) => {
            //console.log(href, form.getAttribute('data-submit'))
            if (div.getAttribute("data-name") == href) {
               div.classList.add("active");
            } else {
               div.classList.remove("active");
            }
         });
         groupEditNavs.forEach((link) => {
            if (link.getAttribute("data-dest") == href) {
               link.classList.add("active_t_button");
            } else {
               link.classList.remove("active_t_button");
            }
         });
      });
   });
}
function init__tournament_group_create() {
   let form = get("#tournament_group_create__form");
   let tourId = get("#tour_body").getAttribute("data-id");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch(
         `/api/lk/tournament/id/${tourId}/group/post__create`,
         JSON.stringify(data),
         "POST"
      );
   });
}
function init__profile() {
   initMasks();
   let profileForm = get("#profile__form");
   profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(profileForm);
      console.log(data);
      sendFetch("/api/lk/put__profile", JSON.stringify(data), "PUT");
   });
   let passwordForm = get("#password__form");
   passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(passwordForm);
      if (data.password != data.password_confirm) {
         alert("Пароли не совпадают");
         return;
      }
      sendFetch("/api/lk/put__password", JSON.stringify(data), "PUT");
   });
}
function init__match() {}
function init__match_create() {
   let form = get("#match_create__form");

   let team_1 = get("#team"),
      team_2 = get("#team_2");
   // form.tournament.addEventListener("change", async (e) => {
   //    let data = await formGetData(form);
   //    let teams;
   //    if (data.tournament) {
   //       teams = await sendFetch(
   //          `/api/lk/match/get__teams_by_tournament?id=${data.tournament}`,
   //          null,
   //          "GET"
   //       );
   //       console.log(teams);
   //    } else {
   //       teams = await sendFetch(`/api/lk/match/get__teams`, null, "GET");
   //       console.log(teams);
   //    }
   //    pushTeams(team_1, teams.teams);
   //    pushTeams(team_2, teams.teams);
   // });
   function pushTeams(datalist, teams) {
      datalist.innerHTML = "";
      teams.forEach((team) => {
         let option = document.createElement("option");
         option.value = team.name;
         option.setAttribute("data-value", team.id);
         option.innerText = team.name;
         datalist.appendChild(option);
      });
   }
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);

      sendFetch("/api/lk/match/post__create", JSON.stringify(data), "POST");
   });
}
function init__match_edit() {
   let matchId = get("#matchId").value;

   get("#match_results__reset").addEventListener("click", async (e) => {
      sendFetch(
         "/api/lk/match/delete__results",
         JSON.stringify({ matchId: matchId }),
         "DELETE"
      );
   });

   get("#match__submit").addEventListener("click", async (e) => {
      sendForm();
   });

   let commentatorForm = get("#match_commentators__form");
   commentatorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let dataCommentator = await formGetData(commentatorForm);
      dataCommentator.matchId = matchId;
      console.log(dataCommentator);
      sendFetch(
         "/api/lk/match/put__commentator",
         JSON.stringify(dataCommentator),
         "PUT"
      );
   });

   let judgeForm = get("#match_judges__form");
   judgeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let dataJudge = await formGetData(judgeForm);
      dataJudge.matchId = matchId;
      console.log(dataJudge);
      sendFetch("/api/lk/match/put__judge", JSON.stringify(dataJudge), "PUT");
   });

   async function sendForm() {
      let formEdit = get("#match_edit__form");

      if (!formEdit.checkValidity()) {
         console.log("error validation");
         return;
      }

      let dataEdit = await formGetData(formEdit);
      console.log(dataEdit);
      sendFetch("/api/lk/match/put__edit", JSON.stringify(dataEdit), "PUT");

      let dataResult_1 = [],
         dataResult_2 = [];
      let table_1 = get("#team_1_results"),
         table_2 = get("#team_2_results");
      getA(".res_row", table_1).forEach((row) => {
         dataResult_1[row.getAttribute("data-index")] = {
            is_active: get('input[name="is_active"', row).checked,
            red: get('input[name="red"', row).value,
            yellow: get('input[name="yellow"', row).value,
            transits: get('input[name="transits"', row).value,
            goals: get('input[name="goals"', row).value,
         };
      });
      getA(".res_row", table_2).forEach((row) => {
         dataResult_2[row.getAttribute("data-index")] = {
            is_active: get('input[name="is_active"', row).checked,
            red: get('input[name="red"', row).value,
            yellow: get('input[name="yellow"', row).value,
            transits: get('input[name="transits"', row).value,
            goals: get('input[name="goals"', row).value,
         };
      });
      console.log(dataResult_1);
      let dataResult = {
         matchId,
         team_1: dataResult_1,
         team_2: dataResult_2,
      };
      console.log(dataResult);
      sendFetch(
         "/api/lk/match/put__results",
         JSON.stringify(dataResult),
         "PUT"
      );
   }
}
function init__match_create_calendar() {
   let tour;
   let form = get("#match_create_calendar__form");
   form.tournamentId.addEventListener("change", async (e) => {
      let data = await formGetData(form);
      console.log(data);
      tour = await sendFetch(
         `/api/lk/get__tournament_by_id?id=${data.tournamentId}`
      );
      console.log(tour);
      setTip();
   });
   form.circles.addEventListener("change", async (e) => {
      if (tour) {
         setTip();
      }
   });
   function setTip() {
      let teamCount = tour.teams.length;
      let matchCount = ((teamCount * (teamCount - 1)) / 2) * form.circles.value;
      let txt = `Матчей будет создано: ${matchCount}<br/>`;
      // if(teamCount % 2 != 0)
      //     txt += 'Нечётное количество команд. Некоторые команды не имеют пары.'
      get("#tip").innerHTML = txt;
   }
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.date = formatDate();
      sendFetch(
         "/api/lk/match/post__create_calendar",
         JSON.stringify(data),
         "POST"
      );
   });
}
function count_match(teamCount) {
   return (teamCount * (teamCount - 1)) / 2;
}

function init__team() {}
function init__team_create() {
   let form = get("#team_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      console.log(getCurrentDate());
      data.date = getCurrentDate();
      sendFetch("/api/lk/team/post__create", JSON.stringify(data), "POST");
   });
}
function init__team_list_create() {
   let form = get("#team_list_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.teamId = await getParams(params.sub_href).id;
      console.log(data);
      sendFetch(
         "/api/lk/team/post__team_list_create",
         JSON.stringify(data),
         "POST"
      );
   });
}
function init__team_list() {
   let form = get("#player_add__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      console.log(data);
      sendFetch("/api/lk/team/put__team_list", JSON.stringify(data), "PUT");
   });
}
function init__team_representative() {
   let form = get("#team_representative__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch(
         "/api/lk/team/put__team_representative",
         JSON.stringify(data),
         "PUT"
      );
   });
}
function init__team_couch() {
   let form = get("#team_couch__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/team/put__team_couch", JSON.stringify(data), "PUT");
   });
}
function init__team_edit() {
   let form = get("#team_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/team/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__player() {}
function init__player_create() {
   let form = get("#player_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      let check_data = { fio: data.fio };
      let check = await sendFetch(
         "/api/lk/player/post__check_duplicate",
         JSON.stringify(check_data),
         "POST"
      );
      console.log(check);
      if (check && check.data) {
         let conf = confirm("Такой игрок уже существует. Продолжить создание?");
         console.log(conf);
         if (conf) {
            sendFetch(
               "/api/lk/player/post__create",
               JSON.stringify(data),
               "POST"
            );
         }
      } else
         sendFetch("/api/lk/player/post__create", JSON.stringify(data), "POST");
   });
}

function init__player_edit() {
   let form = get("#player_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      await sendFetch("/api/lk/player/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__representative_create() {
   let form = get("#representative_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch(
         "/api/lk/representative/post__create",
         JSON.stringify(data),
         "POST"
      );
   });
}
function init__representative_edit() {
   let form = get("#representative_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.representativeId = form.getAttribute("data-id");
      sendFetch(
         "/api/lk/representative/put__edit",
         JSON.stringify(data),
         "PUT"
      );
   });
}
function init__couch_create() {
   let form = get("#couch_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/couch/post__create", JSON.stringify(data), "POST");
   });
}
function init__couch_edit() {
   let form = get("#couch_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.couchId = form.getAttribute("data-id");
      sendFetch("/api/lk/couch/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__judge_create() {
   let form = get("#judge_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch("/api/lk/judge/post__create", JSON.stringify(data), "POST");
   });
}
function init__judge_edit() {
   let form = get("#judge_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.judgeId = form.getAttribute("data-id");
      sendFetch("/api/lk/judge/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__commentator_create() {
   let form = get("#commentator_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      sendFetch(
         "/api/lk/commentator/post__create",
         JSON.stringify(data),
         "POST"
      );
   });
}
function init__commentator_edit() {
   let form = get("#commentator_edit__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.commentatorId = form.getAttribute("data-id");
      sendFetch("/api/lk/commentator/put__edit", JSON.stringify(data), "PUT");
   });
}
function init__style() {
   let option = get("#style_select");
   let form = get("#style__form");
   let colorInputs = getA('input[type="color"]', form);
   let new_style_inp = get("#new_style_inp");
   let delBtn = get("#delBtn");
   let nStyleBtn = get("#newStyleBtn");
   option.addEventListener("change", async (e) => {
      let id = option.value;
      let data = await sendFetch(`/api/lk/get__style_by_id?id=${id}`);
      data = data.style;
      for (let key in data) {
         console.log(key);
         if (form[key]) form[key].value = String(data[key]).substring(0, 7);
      }
      new_style_inp.style.display = "none";
      delBtn.style.display = "block";
      nStyleBtn.style.display = "block";
      setBackground(form.opacity.value);
   });
   nStyleBtn.addEventListener("click", async (e) => {
      location.reload();
   });
   delBtn.addEventListener("click", async (e) => {
      sendFetch(`/api/lk/del__style?id=${option.value}`, null, "DELETE");
   });
   form.opacity.addEventListener("change", async (e) => {
      setBackground(e.target.value);
   });

   setBackground(255);
   colorInputs.forEach((inp) => {
      inp.addEventListener("input", async (e) => {
         setBackground(form.opacity.value);
      });
   });
   function setBackground(opacity) {
      colorInputs.forEach((inp) => {
         inp.style.backgroundColor =
            inp.value +
            (opacity == 255
               ? ""
               : parseInt(opacity).toString(16).padStart(2, "0"));
      });
   }
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      for (let key in data) {
         if (form[key] && form[key].type == "color") {
            data[key] =
               form[key].value +
               (form.opacity.value == 255
                  ? ""
                  : parseInt(form.opacity.value).toString(16).padStart(2, "0"));
         }
      }
      sendFetch("/api/lk/post__style", JSON.stringify(data), "POST");
   });
}

function init__transfer_create() {
   let form = get("#transfer_create__form");
   form.player.addEventListener("change", async (e) => {
      let options = [...form.player.list.options];
      console.log(options);
      let selectedEl = options.filter((el) => form.player.value == el.value)[0];
      console.log(selectedEl);
      if (selectedEl)
         form.team_from.value = selectedEl.getAttribute("data-team");
   });
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      data.date = formatDate();
      sendFetch("/api/lk/transfer/post__create", JSON.stringify(data), "POST");
   });
}

function init__tournament_docs_create() {
   let tourId = get("#tour_body").getAttribute("data-id");
   let form = get("#tournament_docs_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      let html = await readDocxContents(form.doc.files[0]);
      data.doc = html;
      data.tournament = tourId;
      //get('#tour_body').innerHTML = html
      sendFetch(
         "/api/lk/tournament/post__docs_create",
         JSON.stringify(data),
         "POST"
      );
   });
}
function init__guide_create() {
   let form = get("#guide_create__form");
   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = await formGetData(form);
      let html = await readDocxContents(form.doc_file.files[0]);
      data.doc = html;
      sendFetch("/api/lk/guide/post__create", JSON.stringify(data), "POST");
   });
}
function setImgListener() {
   let imgsLabels = getA(".image_upload");
   imgsLabels.forEach((label) => {
      let preview = get(".image_preview", label),
         input = get(".image_input", label);

      input.addEventListener("change", async (e) => {
         try {
            input.setAttribute("changed", "true");
            console.log(e.target.files[0]);
            let base64 = await getBase64(e.target.files[0]);
            preview.src = base64;
         } catch (e) {
            input.setAttribute("changed", "");
            e.target.value = "";
         }
      });
   });
}

// window.addEventListener('popstate', function(event){
//     event.preventDefault();
//     if(event.state){
//         console.log(event.state)
//         console.log(location)
//         getPage(getParams(location.search).page)
//     }
// });

function hex2text(hex_string) {
   const hex = hex_string.toString();
   let out = "";
   for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      out += String.fromCharCode(charCode);
   }

   return out;
}

function readDocxContents(file) {
   if (file) {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = async function (e) {
            const arrayBuffer = e.target.result;

            // Convert the ArrayBuffer to a Uint8Array
            const uint8Array = new Uint8Array(arrayBuffer);

            // Convert the Uint8Array to a binary string
            const binaryString = uint8Array.reduce(
               (acc, value) => acc + String.fromCharCode(value),
               ""
            );

            // Parse the DOCX contents using mammoth.js
            let res = await mammoth
               .convertToHtml(
                  { arrayBuffer: arrayBuffer },
                  { includeDefaultStyleMap: true }
               )
               .then((result) => result.value)
               .catch((error) => {
                  console.error("Error parsing DOCX:", error);
               });
            resolve(res);
         };

         reader.readAsArrayBuffer(file);
      });
   } else {
      alert("Please select a DOCX file.");
   }
}

function init__filter() {
   let filter_data = {
      filters: null,
      page: 1,
   };

   let filter_div = get(".filter");
   console.log(filter_div);
   if (!filter_div) return;
   let filters = getA("input:not([type='button']), select", filter_div);
   filter_data.filters = filters;
   let dest = filter_div.getAttribute("data-dest");
   console.log(params.get);
   let prms = params.get;
   for (let param in prms) {
      console.log(param);
      if (param.includes("filter")) {
         console.log(param);
         console.log(param.replace("filter_", ""));
         get(`[name="${param.replace("filter_", "")}"]`, filter_div).value =
            decodeURI(prms[param]);
      }
   }
   filters.forEach((filter) => {
      filter.addEventListener("change", (e) => {
         filter_data["filters"] = filters;
         setFilter(filter_data, dest);
      });
   });
   let status_btns = getA(".table_status");
   if (status_btns.length > 0) {
      status_btns.forEach((btn) => {
         console.log(btn, prms.status);
         filter_data.status = prms.status || "active";
         if (prms.status == btn.getAttribute("data-name"))
            btn.classList.add("table_radio_active");
         else btn.classList.remove("table_radio_active");
         btn.addEventListener("click", (e) => {
            filter_data.filters = filters;
            filter_data.status = e.target.getAttribute("data-name");
            setFilter(filter_data);
         });
      });
      if (!prms.status) {
         status_btns[0].classList.add("table_radio_active");
      }
   }
   let clear_btn = get("#clear_filters");
   clear_btn?.addEventListener("click", (e) => {
      filters.forEach((filter) => {
         filter.value = "";
      });

      filter_data.page = 1;
      filter_data.filters = filters;
      setFilter(filter_data, dest);
   });

   let pagination_div = get("#pagination");
   if (pagination_div) {
      let pagePlus = get("#page_plus"),
         pageMinus = get("#page_minus"),
         pageNum = get("#page_num");

      if (prms.page_n) {
         filter_data.page = prms.page_n;
         pageNum.innerHTML = prms.page_n;
      }

      let total = +pagination_div.getAttribute("data-total");
      console.log(total);
      let pageSize = +pagination_div.getAttribute("data-page-size") || 10;
      if (+pageNum.innerHTML * pageSize >= total)
         pagePlus.setAttribute("disabled", "true");
      if (+pageNum.innerHTML <= 1) pageMinus.setAttribute("disabled", "true");

      pagePlus.addEventListener("click", (e) => {
         let page = +pageNum.innerHTML;
         page++;
         filter_data.page = page;
         setFilter(filter_data);
      });
      pageMinus.addEventListener("click", (e) => {
         console.log(pageNum.innerHTML);
         let page = +pageNum.innerHTML;
         page--;
         filter_data.page = page;
         setFilter(filter_data);
      });
   }
}
function setFilter(data, dest) {
   console.log(data);
   let { filters, page, status } = data;
   let currHref = location.href;
   currHref = currHref.split("&status")[0];
   currHref = currHref.split("&page_n")[0];

   let indx = currHref.indexOf("&filter");
   if (indx != -1) {
      currHref = currHref.split("&filter")[0];
   }
   console.log();
   let newHref = currHref;
   filters.forEach((filter) => {
      if (filter.value) newHref += `&filter_${filter.name}=${filter.value}`;
   });
   if (page && !isNaN(page)) newHref += `&page_n=${page}`;
   if (status) newHref += `&status=${status}`;
   console.log({ currHref, indx });
   history.replaceState({ page: 1 }, "", newHref);
   //location.reload()
   let dest_div;
   if (dest) {
      dest_div = get(`#${dest}`);
   }
   console.log(dest, dest_div);
   if (dest_div) getPage(newHref.split("?page=")[1], dest_div);
   else getPage(newHref.split("?page=")[1]);
}

function initDel() {
   let btns = getA(".table_links_del");
   btns.forEach((el) => {
      el.addEventListener("click", (e) => {
         e.preventDefault();
         let data = {
            id: e.target.getAttribute("data-id"),
            model: e.target.getAttribute("data-model"),
         };
         sendFetch("/api/lk/put__del", JSON.stringify(data), "PUT");
      });
   });

   getA(".table_links_fulldel").forEach((el) => {
      el.addEventListener("click", (e) => {
         e.preventDefault();
         sendFetch(
            "/api/lk/put__fulldel",
            JSON.stringify({
               id: e.target.getAttribute("data-id"),
               model: e.target.getAttribute("data-model"),
            }),
            "PUT"
         );
      });
   });
}

panel_slot_btn.addEventListener("click", (e) => {
   e.preventDefault();
   panel_slot.classList.toggle("active");
});

let open_panel_btn = get("#open_panel"),
   open_players = get("#open_panel_players"),
   open_table = get("#open_table"),
   panel_select = get("#panel_select");

function getHrefPanel() {
   let value = panel_select.value == "default" ? "" : "_" + panel_select.value;
   let href = panel_slot.getAttribute("data-id") + value;
   return href;
}
open_panel.addEventListener("click", (e) => {
   window.open("/panel/" + getHrefPanel(), "_blank");
   window.focus();
});

open_players.addEventListener("click", (e) => {
   window.open("/panel_players/" + getHrefPanel(), "_blank");
   window.focus();
});
open_table.addEventListener("click", (e) => {
   window.open("/table/" + getHrefPanel(), "_blank");
   window.focus();
});

console.error("TEST");

const updateMatch = (element) => {};
