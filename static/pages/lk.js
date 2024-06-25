
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
        changeNav(null, href)
        if(!await checkTournament(removeTrailingSlash(href)))
            getPage(href)
    })()
}
async function checkTournament(str) {
    const regexFormatAny = /^tournament\/id\/[^\/]+$/;
    const regexFormatAny2 = /^tournament\/id\/[^\/]+\/.+$/;
  
    const isFormatAny = regexFormatAny.test(str);
    const containsAny2 = regexFormatAny2.test(str);
    console.log({ isFormatAny, containsAny2 });
    if(isFormatAny || containsAny2) {
        const regex = /^(tournament\/id\/[^\/]+)\/.+$/;
        console.log(str)
        let templateHref =  str.replace(regex, '$1')
        console.log(templateHref)
        await getPage(templateHref)
        if(containsAny2) {
            let tour_body = get('#tour_body');
            await getPage(str, tour_body);
        }
        console.log('checkTournament')
        return true
    }
    console.log('checkTournament false')
    return false
}
async function getPage(href, destInHtml = lk_main) {
    
    const baseUrl = '/api/lk/';
    const cleanedHref = href.replace(/(\?id=)(.+)/, '^id~$2')
    console.log(cleanedHref, href)
    const pageUrl = `${baseUrl}${href}`;
    let initHref = cleanedHref.split('?')[0];
    console.log(initHref);
    const response = await sendFetch(pageUrl, null, 'GET');
    destInHtml.innerHTML = response ? response : 'Страница не найдена';

    params.subHref = href.split('?')[1] || '';
    history.replaceState({ page: 1 }, "", `?page=${cleanedHref}`);

    const navLinks = getA('.nav_link');
    navLinks.forEach(link => {
        if (!link.hasEventListener('click')) {
            link.addEventListener('click', linkListener);
        }
    });
    initHref = initHref.replace(/\/id\/[^\/]+(\/[^\/]*)?/, "/id$1").replace(/(get__group_edit).*/, '$1').split('/^id~')[0];
    console.log(initHref)
    console.log(removeTrailingSlash(initHref))
    inits[removeTrailingSlash(initHref)]?.(href);
    return true
}
function removeTrailingSlash(str) {
    return str.replace(/\/$/, '');
  }
async function linkListener(e) {
        e.preventDefault()
        let href = e.target.getAttribute('data-href')
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
    'profile': init__profile,
    'team': init__team,
    'team/get__create' : init__team_create,
    'team/get__team_list': init__team_list,
    'team/get__team_list_create' : init__team_list_create,
    'match': init__match,
    'match/get__create' : init__match_create,
    'tournament': init__tournament,
    'tournament/get__create' : init__tournament_create,
    'tournament/id' : init__tournament_template,
    'tournament/id/edit' : init__tournament_edit,
    'tournament/id/group' : init__tournament_group,
    'tournament/id/get__group_create' : init__tournament_group_create,
    'tournament/id/get__group_edit' : init__tournament_group_edit,
    'player': init__player,
    'player/get__create' : init__player_create,
    'player/get__edit' : init__player_edit,
    'representative/get__create' : init__representative_create,
}
for(let key in inits) {
    inits[key] = init_decorator(inits[key])
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
function init__tournament_create() {
    let form = get("#tournament_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
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
        form.addEventListener("submit", (e) => {
            console.log(form)
            e.preventDefault();
            let tourId = get('#tour_body').getAttribute('data-id')
            let data = formGetData(form)
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
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        sendFetch(`/api/lk/tournament/id/${tourId}/group/post__create`, JSON.stringify(data), "POST")
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
        console.log(getCurrentDate())
        data.date = getCurrentDate()
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
function init__player_create() {
    let form = get("#player_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        sendFetch("/api/lk/player/post__create", JSON.stringify(data), "POST")
    })
}

function init__player_edit() {
    let form = get("#player_edit__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        sendFetch("/api/lk/player/put__edit", JSON.stringify(data), "PUT")
    })
}
function init__representative_create() {
    let form = get("#representative_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = formGetData(form)
        sendFetch("/api/lk/representative/post__create", JSON.stringify(data), "POST")
    })
}