let nav = get('#dashboard_nav_list')
let lk_main = get('#lk_main')
let links = getA('li', nav)
console.log(links)
links.forEach(link => {
    link.addEventListener('click', linkListener)
})
if(params.page) {
    (async () => {
        lk_main.innerHTML = sendFetch('/api/lk/' + params.page, null, 'GET')

    })
}
async function linkListener(e) {
        e.preventDefault()
        let href = e.target.getAttribute('data-href')
        console.log(href)
        let res = await sendFetch('/api/lk/' + href, null, 'GET')
        lk_main.innerHTML = res;
        let init_href = href.slice(0, href.includes('?') ? href.lastIndexOf('/') : href.length);
        history.replaceState({ page: 1 }, "", '?page=' + href);

        console.log(init_href)
        inits[init_href]()
        let nav_links = getA('.nav_link')
        nav_links.forEach(link => {
            link.addEventListener('click', linkListener)
        })
}
let init_decorator = (func) => {
    links = getA('li', nav)
    console.log(links)
    links.forEach(link => {
        link.addEventListener('click', linkListener)
    })
    func()
}
let inits = {
    'profile': init__profile,
    'team': init__team,
    'team/create' : init__team_create,
    'team/get__team_list': init__team_list
}
for(let key in inits) {
    inits[key] = init_decorator(inits[key])
}
function init__profile() {
    let profileForm = get("#profile__form");
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = {
            name: profileForm.name.value,
            surname: profileForm.surname.value,
            patronymic: profileForm.patronymic.value
        }
        sendFetch("/api/lk/put__profile", JSON.stringify(data), "PUT")
    })
}

function init__team() {
}
function init__team_create() {
    let form = get("#team_create__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = {
            name: form.name.value,
            description: form.description.value
        }
        sendFetch("/api/lk/team/post_create", JSON.stringify(data), "POST")
    })
}

function init__team_list() {
    
}