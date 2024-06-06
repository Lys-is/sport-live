let nav = get('#dashboard_nav_list')
let lk_main = get('#lk_main')
let links = getA('li', nav)
console.log(links)
links.forEach(link => {
    link.addEventListener('click', linkListener)
})
async function linkListener(e) {
        e.preventDefault()
        let href = e.target.getAttribute('data-href')
        console.log(href)
        let res = await sendFetch('/api/lk/' + href, null, 'GET')
        lk_main.innerHTML = res;
        inits[href]()
        let nav_links = getA('.nav_link')
        nav_links.forEach(link => {
            link.addEventListener('click', linkListener)
        })
}

let inits = {
    'profile': init__profile,
    'team': init__team,
    'team/create' : init__team_create
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