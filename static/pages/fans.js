let links = getA('.fans_link')
links.forEach(link => {
    link.addEventListener('click', standartLinkListener)
})
const fans_main = get('.content');

let prms = params.get
if(prms['page']) {
    getPage(prms['page'])
}

function standartLinkListener(e) {
    e.preventDefault();
    let el = e.target.closest('.fans_link');
    let href = el.getAttribute('data-href');
    getPage(href);
}
let member_hrefs = getA('.small_buttons > input');

async function getPage(href) {
    if(!href) location.href = location.pathname;
    let initHref = href.split('?')[0];
    const baseUrl = `/api/fans/${leagueId}/`;
    const pageUrl = `${baseUrl}${href.replace('&', '?')}`;
    const response = await sendFetch(pageUrl, null, 'GET');
    fans_main.innerHTML = response ? response : 'Страница не найдена';
    params.subHref = href.split('?')[1] || href;
    console.log(params)
    history.replaceState({ page: 1 }, "", `?page=${initHref}`);

    const navLinks = getA('.fans_link');
    console.log(navLinks)
    navLinks.forEach(link => {
        if (!link.hasEventListener('click')) {
            link.addEventListener('click', standartLinkListener);
        }
    });

    initHref = initHref.replace(/\/id\/[^\/]+(\/[^\/]*)?/, "/id$1").split('/^id~')[0];
    console.log(initHref)
    inits[removeTrailingSlash(initHref)]?.(href);
    initNav(initHref);
    return true
}
function removeTrailingSlash(str) {
    return str.replace(/\/$/, '');
}

const inits = {
    'tournament/id' : init__tournament,
    'calendar/id' : init__calendar,
    'tables/id' : init__tables,
    'teams/id' : init__teams,
    'team/id' : init__team,
    'calendar_team/id' : init__calendar_team,
    'roster_team/id' : init__roster_team,
    'players' : init__players,
    'player/id' : init__player
}



async function init__tournament () {
    changeTourNav('tournament');
}
async function init__calendar () {
    changeTourNav('calendar');
}
async function init__tables () {
    changeTourNav('tables');
}
async function init__teams () {
    changeTourNav('teams');
}
async function init__team () {
    changeTourNav('team');
}
async function init__calendar_team () {
    changeTourNav('calendar_team');
}
async function init__roster_team () {
    changeTourNav('roster_team');
}
async function init__players () {
    changeMembersNav('players');
}
async function init__player () {
    changeMembersNav('players');
}
function changeTourNav(name) {
    let navs = getA('.content-nav > .nav-menu-item');
    navs.forEach(nav => {
        nav.classList.remove('selected');
    })
    get(`.content-nav > .nav-menu-item[data-name="${name}"]`).classList.add('selected');
}
function changeMembersNav(name) {
    let navs = getA('.members_header > .fans_link');
    navs.forEach(nav => {
        nav.classList.remove('selected-table-button');
    })
    get(`.members_header > .fans_link[data-href="${name}"]`).classList.add('selected-table-button');
}
function initNav(nowHref) {
    let nowPage = nowHref.split('/')[0];
    let navs = getA('.content-nav > .nav-menu-item');
    navs.forEach(nav => {
        nav.addEventListener('click', (e) => {
            let name = e.target.getAttribute('data-name');
            let page = params.get[`page`];
            let href = page.replace(nowPage, name);
            getPage(href);
        })
    })
}