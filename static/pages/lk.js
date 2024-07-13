
let nav = get('.navbar_body')
let lk_main = get('#lk_main')
let links = getA('p', nav)
let account_btn = get('#header_account');
let logout_btn = get('#logout_btn');
account_btn.addEventListener('click',(e)=>{
    logout_btn.classList.toggle('active');
    }
)
logout_btn.addEventListener('click',(e)=>{
    logout()
})
console.log(links)
links.forEach(link => {
    let href = link.getAttribute('data-href')
    if(href)
        link.addEventListener('click', (e) => {    
            linkListener(e);
            changeNav(e);    
       })
})
function changeNav(e, href) {
    if(e){
        href = e.target.getAttribute('data-href')
    }
    href = href.split('/')[0]
    href = href.split('&')[0]
    console.log(params, href)
    links.forEach(link => {
        if(link.getAttribute('data-href') != href)
            link.classList.remove('navbar_selected')
        else
            link.classList.add('navbar_selected')
    })

}
if(params.page) {
    (async() => {
        let href = params.page.replace(/\^id~(.+)/, '?id=$1')
        console.log(href)
        for(let key in params) {
            if(key.includes('filter'))
                href += `&${key}=${params[key]}`
            if(key =='page_n')
                href += `&${key}=${params[key]}`
            if(key =='status')
                href += `&${key}=${params[key]}`
        }
        changeNav(null, href)
        if(!await checkTournament(removeTrailingSlash(href)))
            getPage(href)
    })()
}
else
    getPage('profile')
async function checkTournament(str, history_change = false) {
    const regexFormatAny = /^tournament\/id\/[^\/]+$/;
    const regexFormatAny2 = /^tournament\/id\/[^\/]+\/.+$/;
  
    const isFormatAny = regexFormatAny.test(str);
    const containsAny2 = regexFormatAny2.test(str);
    console.log({ isFormatAny, containsAny2 });
    if(isFormatAny || containsAny2) {
        const regex = /^(tournament\/id\/[^\/]+)\/.+$/;
        const regex2 = /^(match\/id\/[^\/]+)\/.+$/;
        console.log(str)
        let templateHref =  str.replace(regex, '$1').replace(regex2, '$1');
        console.log(templateHref)
        await getPage(templateHref, lk_main, history_change);
        if(containsAny2) {
            console.log('containsAny2', str)
            let tour_body = get('#tour_body');
            await getPage(str, tour_body, history_change);
            let tour_navs = getA('.sub_nav_link');
            tour_navs.forEach(link => {
                link.classList.remove('active_t_button');
            })
            get(`.sub_nav_link[data-href="${str.split('_')[0]}"]`).classList.add('active_t_button');
        }
        console.log('checkTournament')

        return true
    }
    console.log('checkTournament false')
    return false
}
window.addEventListener('popstate', async function(event) {
    let href = location.href.split('?page=')[1];
    // The popstate event is fired each time when the current history entry changes.
    if(!await checkTournament(removeTrailingSlash(href), true))
        getPage(href, lk_main, true);
}, false);
async function getPage(href, destInHtml = lk_main, history_change = false) {
    
    const baseUrl = '/api/lk/';
    const cleanedHref = href.replace(/(\?id=)(.+)/, '^id~$2')
    console.log(cleanedHref, href)
    const pageUrl = `${baseUrl}${href.replace('&', '?')}`;
    let initHref = cleanedHref.split('?')[0];
    console.log(initHref);
    const response = await sendFetch(pageUrl, null, 'GET');
    destInHtml.innerHTML = response ? response : 'Страница не найдена';

    params.subHref = href.split('?')[1] || href;
    //history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);
    if(!history_change){
        history.pushState({ page: 1 }, "", `?page=${location.search}`);
        history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);
    }
    const navLinks = getA('.nav_link');
    navLinks.forEach(link => {
        if (!link.hasEventListener('click')) {
            link.addEventListener('click', linkListener);
        }
    });
    let defLinks = getA('.def_link');
    defLinks.forEach(link => {
        if (!link.hasEventListener('click')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                location.href = e.target.getAttribute('data-href')

            });
        }
    });
    initHref = initHref.replace(/\/id\/[^\/]+(\/[^\/]*)?/, "/id$1").replace(/(get__group_edit).*/, '$1').split('/^id~')[0];
    console.log(initHref)
    inits[removeTrailingSlash(initHref)]?.(href);
    setImgListener()
    init__filter()
    changeNav(null, href)
    initDel(params.subHref)
    return true
}
function removeTrailingSlash(str) {
    return str.replace(/\/$/, '');
  }
async function linkListener(e) {
        e.preventDefault()
        let nav = e.target.closest('*[data-href]')
        let href = nav.getAttribute('data-href')
        console.log(href)
        getPage(href)
}
let hidNav = get('.header_hide_navbar')
let navDiv = get('.navbar')
hidNav.addEventListener('click', (e) => {
    navDiv.classList.toggle('navbar_mini')
})






let init_decorator = (func) => {
    let n_links = getA('li', nav)
    n_links.forEach(link => {
        if(!link.hasEventListener('click'))
            link.addEventListener('click', linkListener)
    })
   
    return func
}
let inits = {
    'league': init__league,
    'profile': init__profile,
    'team': init__team,
    'team/get__edit' : init__team_edit,
    'team/get__create' : init__team_create,
    'team/get__team_list': init__team_list,
    'team/get__team_list_create' : init__team_list_create,
    'team/get__team_representative' : init__team_representative,
    'team/get__team_couch' : init__team_couch,
    'match': init__match,
    'match/get__create' : init__match_create,
    'match/get__create_calendar' : init__match_create_calendar,
    'match/id/get__edit' : init__match_edit,
    'tournament': init__tournament,
    'tournament/get__create' : init__tournament_create,
    'tournament/id' : init__tournament_template,
    'tournament/id/edit' : init__tournament_edit,
    'tournament/id/team' : init__tournament_team,
    'tournament/id/team_in' : init__tournament_team_in,
    'tournament/id/judge'   : init__tournament_judge,
    'tournament/id/judge_in' : init__tournament_judge_in,
    'tournament/id/group' : init__tournament_group,
    'tournament/id/get__group_create' : init__tournament_group_create,
    'tournament/id/get__group_edit' : init__tournament_group_edit,
    'tournament/id/docs_create' : init__tournament_docs_create,
    'player': init__player,
    'player/get__create' : init__player_create,
    'player/get__edit' : init__player_edit,
    'representative/get__create' : init__representative_create,
    'couch/get__create' : init__couch_create,
    'judge/get__create' : init__judge_create,
    'commentator/get__create' : init__commentator_create,
    'user': init__user,
    'style' : init__style,
    'transfer/get__create': init__transfer_create,
    'guide/get__create': init__guide_create,
}
for(let key in inits) {
    inits[key] = init_decorator(inits[key])
}

function init__user() {
    let btns = getA('.table_links')
    btns.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault()
            let data = {
                userId: e.target.getAttribute('data-id'),
                type: e.target.getAttribute('data-type')
            }
            sendFetch('/api/lk/user/put__edit', JSON.stringify(data), 'PUT')
        })
    })
}
function init__tournament() {
}
function init__tournament_template() {
    let tour_navs = getA('.sub_nav_link');
    let tour_body = get('#tour_body');
    tour_navs.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let href = e.target.getAttribute('data-href');
            getPage(href, tour_body);
            tour_navs.forEach(link => {
                link.classList.remove('active_t_button');
            })
            link.classList.add('active_t_button');
        })
    })
}
function init__league() {
    let form = get("#league_edit__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/put__league", JSON.stringify(data), "PUT")
    })
}
function init__tournament_create() {
    let form = get("#tournament_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/tournament/post__create", JSON.stringify(data), "POST")
    })
}
function init__tournament_edit(href) {
    if(!get('#tour_body')) {
        checkTournament(removeTrailingSlash(href))
    }
    console.log('init__tournament_edit')
    let forms = getA('.tournament_edit__form');
    let forms_dest = {

    }
    forms.forEach(form => {
        form.addEventListener("submit", async (e) => {
            console.log(form)
            e.preventDefault();
            let tourId = get('#tour_body').getAttribute('data-id')
            let data = await formGetData(form)
            data.tournamentId = tourId
            let dest = form.getAttribute('data-submit')
            if(!dest) {
                alert('Неизвестная ошибка')
                return
            }
            console.log(dest, data)
            sendFetch(`/api/lk/tournament/put__edit/${dest}`, JSON.stringify(data), "PUT")
        })
    })
    console.log(forms_dest)
    let tourEditNavs = getA('.tour_edit_navs > input');
    tourEditNavs.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let href = e.target.getAttribute('data-dest');
            forms.forEach(form => {
                //console.log(href, form.getAttribute('data-submit'))
                if(form.getAttribute('data-submit') == href) {
                    form.classList.add('active')
                } else {
                    form.classList.remove('active')
                }
            })
            tourEditNavs.forEach(link => {
                if(link.getAttribute('data-dest') == href) {
                    link.classList.add('active_t_button')
                } else {
                    link.classList.remove('active_t_button')
                }
            })
        })
    })
}
function init__tournament_team(){
    let tourId = get('#tour_body').getAttribute('data-id');
    let addBtns = getA('.team_add');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let data = {
                tournamentId: tourId,
                teamId: e.target.getAttribute('data-id')
            }
            sendFetch('/api/lk/tournament/put__team', JSON.stringify(data), 'PUT')
        })
    })
}
function init__tournament_team_in(){
    let tourId = get('#tour_body').getAttribute('data-id');
    let addBtns = getA('.team_add');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let data = {
                tournamentId: tourId,
                teamId: e.target.getAttribute('data-id')
            }
            sendFetch('/api/lk/tournament/delete__team', JSON.stringify(data), 'DELETE')
        })
    })
}
function init__tournament_judge(){
    let tourId = get('#tour_body').getAttribute('data-id');
    let addBtns = getA('.judge_add');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let data = {
                tournamentId: tourId,
                teamId: e.target.getAttribute('data-id'),
                type: e.target.getAttribute('data-type')
            }
            sendFetch('/api/lk/tournament/put__judge', JSON.stringify(data), 'PUT')
        })
    })
}
function init__tournament_judge_in(){
    let tourId = get('#tour_body').getAttribute('data-id');
    let addBtns = getA('.judge_add');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let data = {
                tournamentId: tourId,
                teamId: e.target.getAttribute('data-id'),
                type: e.target.getAttribute('data-type')
            }
            sendFetch('/api/lk/tournament/delete__judge', JSON.stringify(data), 'DELETE')
        })
    })
}
function init__tournament_group(href) {
    if(!get('#tour_body')) {
        checkTournament(removeTrailingSlash(href))
    }
    let tour_navs = getA('.sub_nav_link');
    let tour_body = get('#tour_body');
    tour_navs.forEach(link => {
        if(!link.hasEventListener('click')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let href = e.target.getAttribute('data-href');
                console.log(href, e.target)
                getPage(href, tour_body);
            })
        }
        
    })
   
    console.log('init__tournament_group')
}
function init__tournament_group_edit() {
    let groupDivs = getA('.groups_body');
    let groupEditNavs = getA('.group_navs > input');
    groupEditNavs.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let href = e.target.getAttribute('data-dest');
            groupDivs.forEach(div => {
                //console.log(href, form.getAttribute('data-submit'))
                if(div.getAttribute('data-name') == href) {
                    div.classList.add('active')
                } else {
                    div.classList.remove('active')
                }
            })
            groupEditNavs.forEach(link => {
                if(link.getAttribute('data-dest') == href) {
                    link.classList.add('active_t_button')
                } else {
                    link.classList.remove('active_t_button')
                }
            })
        })
    })
}
function init__tournament_group_create() {
    let form = get("#tournament_group_create__form");
    let tourId = get('#tour_body').getAttribute('data-id')
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch(`/api/lk/tournament/id/${tourId}/group/post__create`, JSON.stringify(data), "POST")
    })
}
function init__profile() {
    initMasks()
    let profileForm = get("#profile__form");
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(profileForm)
        console.log(data)
        sendFetch("/api/lk/put__profile", JSON.stringify(data), "PUT")
    })
    let passwordForm = get("#password__form");
    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(passwordForm)
        if(data.password != data.password_confirm) {
            alert('Пароли не совпадают')
            return
        }
        sendFetch("/api/lk/put__password", JSON.stringify(data), "PUT")
    })
}
function init__match() {
}
function init__match_create() {
    let form = get("#match_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)

        sendFetch("/api/lk/match/post__create", JSON.stringify(data), "POST")
    })
}
function init__match_edit() {
    let matchId = get('#matchId').value

    let saveBtn = get("#match__submit");
    saveBtn.addEventListener("click", async (e) => {
        sendForm();
    })
        let commentatorForm = get("#match_commentators__form"); 
        commentatorForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            let dataCommentator = await formGetData(commentatorForm)
            dataCommentator.matchId = matchId
            console.log(dataCommentator)
            sendFetch("/api/lk/match/put__commentator", JSON.stringify(dataCommentator), "PUT")
        })
        let judgeForm = get("#match_judges__form");
        judgeForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            let dataJudge = await formGetData(judgeForm)
            dataJudge.matchId = matchId
            console.log(dataJudge)
            sendFetch("/api/lk/match/put__judge", JSON.stringify(dataJudge), "PUT")
        })

        

    async function sendForm() {
        let formEdit = get("#match_edit__form");
        
            if(!formEdit.checkValidity()) return
            let dataEdit = await formGetData(formEdit)
            console.log(dataEdit)
            sendFetch("/api/lk/match/put__edit", JSON.stringify(dataEdit), "PUT")

        
            let dataResult_1 = [], dataResult_2 = [];
            let table_1 = get("#team_1_results"),
                table_2 = get("#team_2_results")
            getA('.res_row', table_1).forEach(row => {
                dataResult_1[row.getAttribute('data-index')] = {
                    is_active: get('input[name="is_active"', row).checked,
                    red: get('input[name="red"', row).value,
                    yellow: get('input[name="yellow"', row).value,
                    transits: get('input[name="transits"', row).value,
                    goals: get('input[name="goals"', row).value
                }
            })
            getA('.res_row', table_2).forEach(row => {
                dataResult_2[row.getAttribute('data-index')] = {
                    is_active: get('input[name="is_active"', row).checked,
                    red: get('input[name="red"', row).value,
                    yellow: get('input[name="yellow"', row).value,
                    transits: get('input[name="transits"', row).value,
                    goals: get('input[name="goals"', row).value
                }
            })
            console.log(dataResult_1)
            let dataResult = {
                matchId,
                team_1: dataResult_1,
                team_2: dataResult_2
            }
            console.log(dataResult)
            sendFetch("/api/lk/match/put__results", JSON.stringify(dataResult), "PUT")
        
    }
}
function init__match_create_calendar() {
    let tour;
    let form = get("#match_create_calendar__form");
    form.tournamentId.addEventListener('change', async (e) => {
        let data = await formGetData(form)
        console.log(data)
        tour = await sendFetch(`/api/lk/get__tournament_by_id?id=${data.tournamentId}`)
        console.log(tour)
        setTip()
    })
    form.circles.addEventListener('change', async (e) => {
        if(tour) {
           setTip()
        }
    })
    function setTip() {
        let teamCount = tour.teams.length
        let matchCount = ((teamCount*(teamCount-1))/2) * form.circles.value
        let txt = `Матчей будет создано: ${matchCount}<br/>`
        // if(teamCount % 2 != 0)
        //     txt += 'Нечётное количество команд. Некоторые команды не имеют пары.'
        get('#tip').innerHTML = txt
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        data.date = formatDate()
        sendFetch("/api/lk/match/post__create_calendar", JSON.stringify(data), "POST")
    })
}
function count_match(teamCount) {
    return ((teamCount*(teamCount-1))/2)
}

function init__team() {

}
function init__team_create() {
    let form = get("#team_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        console.log(getCurrentDate())
        data.date = getCurrentDate()
        sendFetch("/api/lk/team/post__create", JSON.stringify(data), "POST")
    })
}
function init__team_list_create() {
    let form = get("#team_list_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        data.teamId = await getParams(params.sub_href).id
        console.log(data)
        sendFetch("/api/lk/team/post__team_list_create", JSON.stringify(data), "POST")
    })
}
function init__team_list() {
    let form = get("#player_add__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        console.log(data)
        sendFetch("/api/lk/team/put__team_list", JSON.stringify(data), "PUT")
    })
}
function init__team_representative() {
    let form = get("#team_representative__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/team/put__team_representative", JSON.stringify(data), "PUT")
    })
}
function init__team_couch() {
    let form = get("#team_couch__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/team/put__team_couch", JSON.stringify(data), "PUT")
    })
}
function init__team_edit() {
    let form = get("#team_edit__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/team/put__edit", JSON.stringify(data), "PUT")
    })
}
function init__player() {
    
}
function init__player_create() {
    let form = get("#player_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/player/post__create", JSON.stringify(data), "POST")
    })
}

 function init__player_edit() {
    let form = get("#player_edit__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        await sendFetch("/api/lk/player/put__edit", JSON.stringify(data), "PUT")
    })
}
function init__representative_create() {
    let form = get("#representative_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/representative/post__create", JSON.stringify(data), "POST")
    })
}
function init__couch_create() {
    let form = get("#couch_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/couch/post__create", JSON.stringify(data), "POST")
    })
}

function init__judge_create() {
    let form = get("#judge_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/judge/post__create", JSON.stringify(data), "POST")
    })
}
function init__commentator_create() {
    let form = get("#commentator_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/commentator/post__create", JSON.stringify(data), "POST")
    })
}
function init__style() {
    let option = get('#style_select');
    let form = get("#style__form");
    option.addEventListener('change', async (e) => {
        let id = option.value
        let data = await sendFetch(`/api/lk/get__style_by_id?id=${id}`)
        data = data.style
        for(let key in data){
            console.log(key)
            if(form[key])
                form[key].value = data[key]
        }
    })
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        sendFetch("/api/lk/post__style", JSON.stringify(data), "POST")
    })
}

function init__transfer_create() {
    let form = get("#transfer_create__form");
    form.player.addEventListener('change', async (e) => {

            let options = [...form.player.list.options];
                console.log(options)
                let selectedEl = options.filter(el => form.player.value == el.value)[0];
                console.log(selectedEl)
                if(selectedEl)
                    form.team_from.value = selectedEl.getAttribute('data-team')
        
    })
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        data.date = formatDate()
        sendFetch("/api/lk/transfer/post__create", JSON.stringify(data), "POST")
    })
}

function init__tournament_docs_create() {
    let tourId = get('#tour_body').getAttribute('data-id')
    let form = get("#tournament_docs_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        let html = await readDocxContents(form.doc.files[0])
        data.doc = html
        data.tournament = tourId
        //get('#tour_body').innerHTML = html
        sendFetch("/api/lk/tournament/post__docs_create", JSON.stringify(data), "POST")
    })
}
function init__guide_create() {

    let form = get("#guide_create__form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = await formGetData(form)
        let html = await readDocxContents(form.doc_file.files[0])
        data.doc = html
        sendFetch("/api/lk/guide/post__create", JSON.stringify(data), "POST")
    })
}
function setImgListener(){
    let imgsLabels = getA('.image_upload')
    imgsLabels.forEach(label => {
        let preview = get('.image_preview', label),
        input = get('.image_input', label)

        input.addEventListener('change', async (e) => {
            input.setAttribute('changed', 'true')
            console.log(e.target.files[0])
            let base64 = await getBase64(e.target.files[0])
            preview.src = base64
        })
    })
}




// window.addEventListener('popstate', function(event){
//     event.preventDefault();
//     if(event.state){
//         console.log(event.state)
//         console.log(location)
//         getPage(getParams(location.search).page)
//     }
// });


function hex2text(hex_string)
{
    const hex = hex_string.toString(); // конвертируем в строку
    let out = '';

    // i += 2 - так в шестнадцатеричном виде число представлено двумя символами
    for (let i = 0; i < hex.length; i += 2)
    {
        // код символа в шестнадцетиричном представлении
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
            const binaryString = uint8Array.reduce((acc, value) => acc + String.fromCharCode(value), '');
      
            // Parse the DOCX contents using mammoth.js
            let res = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, {includeDefaultStyleMap: true})
              .then(result => result.value )
              .catch(error => {
                console.error('Error parsing DOCX:', error);
              });
              resolve(res)
          };
      
          reader.readAsArrayBuffer(file);
    });
  
      
    } else {
      alert('Please select a DOCX file.');
    }
  }

function init__filter() {
    let filter_data = {
        filters: null,
        page: 1,
        status: 'active'
    }

    let filter_div = get(".filter");
    console.log(filter_div)
    if(!filter_div) return
    let filters = getA("input", filter_div);
    filter_data.filters = filters

    console.log(params.get)
    let prms = params.get
    for(let param in prms) {
        console.log(param)
        if(param.includes('filter')) {
            console.log(param)
            console.log(param.replace('filter_', ''))
            get(`input[name="${param.replace('filter_', '')}"]`, filter_div).value = decodeURI(prms[param])

        }

    }
    filters.forEach(filter => {
        
        filter.addEventListener("change", (e) => {
            filter_data['filters'] = filters
            setFilter(filter_data);
        });
    });
    let status_btns = getA(".table_status");
    if(status_btns.length > 0) {
        status_btns.forEach(btn => {
            console.log(btn, prms.status)
            filter_data.status = prms.status || 'active'
            if(prms.status == btn.getAttribute("data-name")) btn.classList.add("table_radio_active");
            else btn.classList.remove("table_radio_active");
            btn.addEventListener("click", (e) => {
                filter_data.filters = filters
                filter_data.status = e.target.getAttribute("data-name")
                setFilter(filter_data)

            });
        })
        if(!prms.status) {
            
            status_btns[0].classList.add("table_radio_active");
        }
    }
    let clear_btn = get("#clear_filters");
    clear_btn.addEventListener("click", (e) => {
        filters.forEach(filter => {
            filter.value = "";
        })
        filter_data.status = 'active'
        filter_data.page = 1
        filter_data.filters = filters
        setFilter(filter_data);
    })

    let pagination_div = get("#pagination");
    if(!pagination_div) return

    let pagePlus = get("#page_plus"),
    pageMinus = get("#page_minus"),
    pageNum = get("#page_num");

    if(prms.page_n) {
        filter_data.page = prms.page_n
        pageNum.innerHTML = prms.page_n
    }


    let total = +pagination_div.getAttribute("data-total");
    console.log(total)
    let pageSize = +pagination_div.getAttribute("data-page-size") || 10;
    if((+pageNum.innerHTML) * pageSize >= total ) pagePlus.setAttribute("disabled", "true");
    if((+pageNum.innerHTML <= 1)) pageMinus.setAttribute("disabled", "true");

    pagePlus.addEventListener("click", (e) => {
        let page = +pageNum.innerHTML;
        page++;
        filter_data.page = page
        setFilter(filter_data);
    });
    pageMinus.addEventListener("click", (e) => {
        console.log(pageNum.innerHTML)
        let page = +pageNum.innerHTML;
        page--;
        filter_data.page = page
        setFilter(filter_data);
    });

}    
function setFilter(data) {
    console.log(data)
    let {filters, page, status} = data
    let currHref = location.href
    currHref = currHref.split('&status')[0]
    currHref = currHref.split('&page_n')[0]

    let indx = currHref.indexOf('&filter')
    if(indx != -1) {
        currHref = currHref.split('&filter')[0]

    }
    console.log()
    let newHref = currHref
    filters.forEach(filter => {
        if(filter.value)
            newHref += `&filter_${filter.name}=${filter.value}`
    })
    if(page && !isNaN(page)) newHref += `&page_n=${page}`
    if(status) newHref += `&status=${status}`
    console.log({currHref, indx})
    history.replaceState({ page: 1 }, "", newHref);
    //location.reload()

    getPage(newHref.split('?page=')[1])
}


function initDel () {
    let btns = getA('.table_links_del')
    btns.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault()
            let data = {
                id: e.target.getAttribute('data-id'),
                model: e.target.getAttribute('data-model')
            }
            sendFetch('/api/lk/put__del', JSON.stringify(data), 'PUT')
        })
    })
}