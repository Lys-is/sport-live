
const socket = io();
socket.on('confirm',()=>{
    window.location = '/authentication'
})
socket.on('updateInfo', ()=>{
    getNotification();
    let btn = get('.notification_fixed ')
    btn.style.right = "0px";
    setTimeout(() => {
        btn.style.right = "";
    }, 2000)
})
document.addEventListener("DOMContentLoaded", (e)=>{
    let modals = getA('.modal');
    console.log(modals);
    modals = [...modals];
    modals.forEach(el => {
    el.addEventListener('click',(e)=>{
        if(!e.target.closest('.modal_wrap') || e.target.closest('.close_modal'))
            el.classList.remove('active')
      })
    });
});

function logout()  {
    fetch('/api/auth/logout', {
        method: 'POST'
    })
        .then(() => window.location = '/')
}

var params = (function oneValues() {
    var query = location.search.substr(1)
    query = query.split('&')
    var params = {}
    for (let i = 0; i < query.length; i++) {
        let q = query[i].split('=')
        if (q.length === 2) {
            params[q[0]] = q[1]
        }
    }
    return params
}());
console.log(params);
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


window.onload = function(){
    
}

class Auth {
    setToken(token) {
        this.token = token;
    }

}
async function sendFetch(url, data, method, headers = {'Content-Type': 'application/json;charset=utf-8'}) {
    console.log(data, headers)
    let token = localStorage.getItem('token')
    if(token)
        headers['Authorization'] = 'Bearer ' + token

    let resp = await fetch(url, {
        method: method,
        headers: headers,
        body: data,
    })
    .then((res) => res.json())
    .then(res => {
        console.log(res)
        if(res.message){
            alert(res.message)
            return res.message
        }
        return res
    })
    .catch(err => {
        console.log(err);
        return
    })
    console.log(resp)
    return resp

}

// const checkAuth = async () => {
//     let data = [];
//     let status;
//     await fetch('/api/auth/check', { 
//         method: 'POST', 
//         headers: new Headers({
//           'Authorization': 'Bearer ' + token,
//           'Content-Type': 'application/json'
//         })
        
//       })
//       .then(res => {status = res.status; return res.json()})
//       .then(response => {data = response;})
//     if(status == 200) 
//         login(data.message)
// };
// //checkAuth();
// function login (name) {
//     let authBtn = document.querySelector('.menu_elem.authentication');
//     if(!authBtn)
//         return
//     authBtn.innerHTML = ''
//     let span = document.createElement('span');
//     span.classList.add('nickname')
//     span.innerHTML = '#'+name;
//     authBtn.append(span);
//     authBtn.href = '/lk'
// }




let windowWidth = window.innerWidth
let windowHeight = window.innerHeight

window.addEventListener('resize', function(event) {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
}, true);

function resizeMain() {
    let headerHeight = get('.header').getBoundingClientRect().width;
    console.log(headerHeight)
    let mainHeight = windowHeight - headerHeight;
    console.log(mainHeight)
    let main = get('main')
    main.style.height = mainHeight+'px';
}

function setAutoMainResize(){
    window.addEventListener('resize', resizeMain, true);
}

function get(selector,  element = document) {
    return element.querySelector(selector);
}

function getA(selector, element = document) {
    return element.querySelectorAll(selector);
}


function input_file_text(inp){
    let span = inp.closest('form').querySelector('.file_input_text');
    let file = inp.files[0]
    if(file)
        span.innerHTML = file.name;
}

async function sendImg(e) {
    console.log(e);
    e.preventDefault(); 
    let href = window.location.href;
    let files = get('#file_input_btn').files[0];

    let data = {
        text: get('#send_message_text').value,
        themeId: href.slice(href.lastIndexOf('/')+1),
    }
    console.log(files);
    console.log(e.target);
    const formData = new FormData(form);

    fetch("/api/forumController/upload_files", {
        method: 'POST',
         file: formData,
         body: data
})
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));

}


async function getNotification(){

    let notification_messages = get('.notification_messages')
    let countDivs = getA('.notif_count_da')
    let data = await sendFetch('/api/auth/getNotifications', null, 'GET')
    console.log(data)
    let count = data.count
    let notificationForm = data.notificationMessages
    if(count && count >= 0){
        countDivs.forEach(div => {
            div.setAttribute('data-count', count)
            div.classList.remove('no-after')

        })
    }
    else{
        countDivs.forEach(div => {
            div.setAttribute('data-count', '')
            div.classList.add('no-after')
        })
    }
    if(notificationForm)
        notification_messages.innerHTML = notificationForm

}

function searchInit() {
    try {
        let searchInpts = getA('.search_input')
        console.log(searchInpts)
        if(searchInpts){
            searchInpts.forEach(inp => {
                let dataSearch = inp.getAttribute('data-search');
                dataSearch = dataSearch.split(',').map(el => el.trim());
                let searchDiv = get(dataSearch[0]);
                let searchElems = getA(dataSearch[2], searchDiv);
                console.log(searchElems)
                inp.addEventListener('input', (e) => {
                    let value = inp.value.toLowerCase();

                    searchElems.forEach(elem => {
                        console.log(elem, value)
                        let box = elem.closest(dataSearch[1])
                        if(box.getAttribute('data-searchChecked') == value)
                            return

                        box.classList.add('hidden');
                        box.removeAttribute('data-searchChecked');
                        if(elem.innerHTML.toLowerCase().includes(value)){
                            box.classList.remove('hidden');
                            box.setAttribute('data-searchChecked', value);
                        }
                    })
                });
            });
        }
    } catch (e) {
      console.log(e)  
    }
    
}