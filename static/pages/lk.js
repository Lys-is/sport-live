
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
    if(link.getAttribute('data-href'))
        link.addEventListener('click', linkListener)
})
if(params.page) {
    (() => {
        console.log(params.page.replace(/\$([^\\^]+)\^([^&]*)/g, '?$1=$2'))
        getPage(params.page.replace(/\$([^\\^]+)\^([^&]*)/g, '?$1=$2'))
    })()
}
async function getPage(href) {
    const baseUrl = '/api/lk/';
    const cleanedHref = href.replace(/\/\?([^=]+)=([^&]+)/g, '/$1~$2');
    const pageUrl = `${baseUrl}${href}`;
    const initHref = cleanedHref.split('?')[0];
    console.log(pageUrl);
    const response = await sendFetch(pageUrl, null, 'GET');
    lk_main.innerHTML = response ? response : 'Страница не найдена';

    params.subHref = href.split('?')[1] || '';
    history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);

    const navLinks = getA('.nav_link');
    navLinks.forEach(link => {
        if (!link.hasEventListener('click')) {
            link.addEventListener('click', linkListener);
        }
    });

    initHref.replace(/\/id\/[^\/]+\/([^\/]+)/, "/id/$1")
    inits[initHref]?.();
}

async function linkListener(e) {
        e.preventDefault()
        // links.forEach(link => {
        //     link.classList.remove('navbar_selected')
        // });
        // e.target.classList.add('navbar_selected')
        let href = e.target.getAttribute('data-href')
        console.log(href)
        getPage(href)
}
let init_decorator = (func) => {
    links = getA('li', nav)
    console.log(links)
    links.forEach(link => {
        link.addEventListener('click', linkListener)
    })
    return func
}
let inits = {
    'profile': init__profile,
    'team': init__team,
    'team/get__create' : init__team_create,
    'team/get__team_list': init__team_list,
    'team/get__team_list_create' : init__team_list_create,
    'match': init__match,
    'match/get__create' : init__match_create,
    'tournament': init__tournament,
    'tournament/get__create' : init__tournament_create,
    'tournament/id/get__edit' : init__tournament_edit,
    'player': init__player
}
for(let key in inits) {
    inits[key] = init_decorator(inits[key])
}
function init__tournament() {
}
function init__tournament_create() {
    let form = get("#tournament_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        sendFetch("/api/lk/tournament/post__create", JSON.stringify(data), "POST")
    })
}
function init__tournament_edit() {
    let form = get("#tournament_reglament__form");
    form.addEventListener("submit", (e) => {
    
    })    
}
function init__profile() {
    let profileForm = get("#profile__form");
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(profileForm)
        console.log(data)
        sendFetch("/api/lk/put__profile", JSON.stringify(data), "PUT")
    })
}
function init__match() {
}
function init__match_create() {
    let form = get("#match_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)

        sendFetch("/api/lk/match/post__create", JSON.stringify(data), "POST")
    })
}
function init__team() {
}
function init__team_create() {
    let form = get("#team_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)

        sendFetch("/api/lk/team/post__create", JSON.stringify(data), "POST")
    })
}
function init__team_list_create() {
    let form = get("#team_list_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        data.teamId = getParams(params.sub_href).id
        console.log(data)
        sendFetch("/api/lk/team/post__team_list_create", JSON.stringify(data), "POST")
    })
}
function init__team_list() {
    
}
function init__player() {
    
}




