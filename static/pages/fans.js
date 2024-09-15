closeLoader()

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
window.addEventListener('popstate', function(event) {
    // The popstate event is fired each time when the current history entry changes.
    getPage(location.href.split('?page=')[1], true);
}, false);
function openLoader() {
    console.log('open')
    get('.loader').classList.remove('closed');
}
function closeLoader() {
    console.log('close')
    get('.loader').classList.add('closed');
    window.scrollTo(0,0)
}
async function getPage(href, history_change = false) {
    
    if(!href) location.href = location.pathname;
    let initHref = href.split('?')[0];
    const baseUrl = `/api/fans/${leagueId}/`;
    const pageUrl = `${baseUrl}${href.replace('&', '?')}`;
    console.log('before', href)
    openLoader();
    const response = await sendFetch(pageUrl, null, 'GET');
    console.log('after', href)
    closeLoader();
    fans_main.innerHTML = response ? response : 'Страница не найдена';
    params.subHref = href.split('?')[1] || href;
    console.log(params)
    
    if(!history_change){
        history.pushState({ page: 1 }, "", `?page=${location.search}`);
        history.replaceState({ page: 1 }, "", `?page=${initHref}`);
    }
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
    'docs/id' : init__docs,
    'doc/id' : init__docs,
    'goalkeepers/id' : init__goalkeepers,
    'bombers/id' : init__bombers,
    'assistants/id' : init__assistants,
    'calendar_team/id' : init__calendar_team,
    'roster_team/id' : init__roster_team,
    'players' : init__players,
    'player/id' : init__player,
    'judges' : init__judges,
    'judge/id' : init__judge,
    'commentators' : init__commentators,
    'commentator/id' : init__commentator,
}



async function init__tournament () {
    changeTourNav('tournament');
}
async function init__calendar () {
    changeTourNav('calendar');
}
async function init__tables () {
    changeTourNav('tables');
    let tables_nav = getA('.table-header > input');
    let tables = getA('.table_dest');
    console.log(tables)
    tables_nav.forEach(table_nav => {
        
        table_nav.addEventListener('click', () => {
            tables.forEach(table => {
                table.style.display = 'none';
            })
            tables_nav.forEach(table_nav => {
                table_nav.classList.remove('selected-table-button')
            })
            table_nav.classList.add('selected-table-button')
            let dest = table_nav.getAttribute('data-dest');
            let tableDest = getA(`.table_dest.${dest}`)
            console.log(tableDest)
            tableDest.forEach(table => {
                table.style.display = '';
            })
        })
    })
}
async function init__teams () {
    changeTourNav('teams');
}
async function init__team () {
    changeTourNav('team');
}
async function init__docs () {
    changeTourNav('docs');
}
async function init__goalkeepers () {
    changeTourNav('goalkeepers');
}
async function init__bombers () {
    changeTourNav('bombers');
}
async function init__assistants () {
    changeTourNav('assistants');
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
function init__judges () {
    changeMembersNav('judges');
}
function init__judge () {
    changeMembersNav('judges');
}
function init__commentators () {
    changeMembersNav('commentators');
}
function init__commentator () {
    changeMembersNav('commentators');
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
            let target = e.target.closest('.nav-menu-item')
            if(!target) return
            let name = target.getAttribute('data-name');
            let page = params.get[`page`];
            let href = page.replace(nowPage, name);
            getPage(href);
        })
    })
}