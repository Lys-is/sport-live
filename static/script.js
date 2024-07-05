
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
(function() {
	var proto = HTMLElement.prototype,
		addEventListener = proto.addEventListener,
		removeEventListener = proto.removeEventListener;

	proto.addEventListener = function(type, callback, useCapture) {
		if(!this._listeners) {
			this._listeners = {};
		}
		if(!(type in this._listeners)) {
			this._listeners[type] = [];
		}

		if(this._listeners[type].indexOf(callback) === -1) {
			this._listeners[type].push(callback);
		}

		addEventListener.call(this, type, callback, useCapture);
	};

	proto.removeEventListener = function(type, callback, useCapture) {
		var index = this._listeners && type in this._listeners ? this._listeners[type].indexOf(callback) : -1;

		if(index !== -1) {
			this._listeners[type].splice(index, 1);
		}

		removeEventListener.call(this, type, callback, useCapture);
	};

	proto.hasEventListener = function(type) {
		return !!(this._listeners && type in this._listeners && this._listeners[type].length || typeof this['on' + type] === 'function');
	};


})();

function logout()  {
    fetch('/api/auth/post__logout', {
        method: 'POST'
    })
    .then(() => window.location = '/auth')
}


// function getParams(href = window.location.href) {
//     console.log(href)
//     var query = href.substr(1)
//     query = query.split('&')
//     console.log(query)
//     var params = {}
//     for (let i = 0; i < query.length; i++) {
//         let q = query[i].split('=')
//         console.log(q)
//         if (q.length === 2) {
//             params[q[0]] = q[1]
//         }
//     }
//     return params
// }

const params = getParams();

// Определяем геттер для params, который вызывает getParams()
Object.defineProperty(params, 'get', {
  get: function() {
    return getParams();
  },
  enumerable: true // Делаем свойство перечисляемым (можно опустить, так как по умолчанию true)
});
params.get
function getParams(href = window.location.href) {
    // Ищем символ вопроса в строке запроса
    const questionMarkIndex = href.indexOf('?');
    if (questionMarkIndex === -1) {
      // Если символ вопроса не найден, возвращаем пустой объект
      return {};
    }
  
    // Вырезаем строку запроса после символа вопроса
    const queryString = href.substring(questionMarkIndex + 1);
  
    // Разделяем строку запроса на массив параметров
    const queryParams = new URLSearchParams(queryString);
  
    // Инициализируем объект для хранения параметров
    const params = {};
  
    // Перебираем все параметры и добавляем их в объект params
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
  
    return params;
  }

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
    console.log('onload')
    let dataInpts = getA('input[type="date"]');
    console.log(dataInpts)
    dataInpts.forEach(inp => {
        console.log(inp)
        if(inp.value == ''){
            inp.value = new Date().toLocaleDateString({timeZone: "Europe/Moscow"})
            console.log(inp.value)
        }
    })
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date = new Date()) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }
function getCurrentDate() {
    return new Date().toLocaleDateString({timeZone: "Europe/Moscow"})
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
        //console.log(res)
        if(res.message){
            alert(res.message)
           // return res.message
        }
        if(res.redirect){
            window.location = res.redirect
        }
        if(res.reload){
            window.location.reload()
        }
        return res
    })
    .catch(err => {
        console.log(err);
        return
    })
    //console.log(resp)
    return resp

}



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
    let el = element.querySelector(selector);
    if (el) return el;
    else {
        console.log('no element' + selector)
        return null
    }
}

function getA(selector, element = document) {
    let el = element.querySelectorAll(selector);
    if (el) return el;
    else {
        console.log('no element' + selector)
        return null
    }
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
const isCheckboxOrRadio = type => ['checkbox', 'radio'].includes(type);
const isDatalist = field => field.list;
const isFile = type => ['file'].includes(type);
async function formGetData(form) {
    const data = {};
    for (let field of form) {
        const {name} = field;
        if (name) {
            const {type, checked, value} = field;
            let datalist = isDatalist(field);
            if (datalist) {
                let options = [...datalist.options];
                let selectedEl = options.filter(el => field.value == el.value)[0];
                if(selectedEl)
                    data[name] = selectedEl.getAttribute('data-value')
            }
            else if(isCheckboxOrRadio(type)) {
                data[name] = checked
            }
            else if(isFile(type)) {
                if(field.getAttribute('changed'))
                data[name] = await getBase64(field.files[0])
            }
            else {
                data[name] = value
            }
            //data[name] = isCheckboxOrRadio(type) ? checked : value;
        }
    }

    console.log(data);
    return data;
}


function addClass(elem, className) {
    elem.classList.add(className)
}
function delClass(elem, className) {
    elem.classList.remove(className)
}

function getRealValue(ele){
    var dl=ele.list.options;
    for (var x=0;x<dl.length;x++){
      if (dl[x].value==ele.value){
        ele.value=dl[x].dataset.value;
        return dl[x].dataset.value;
      }
    }
  }
function getBase64(file) {
    if(!file) return ''
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function () {
//       console.log(reader.result);
//       return reader.result
//     };
//     reader.onerror = function (error) {
//       console.log('Error: ', error);
//     };
//  }



function initMasks(){
    let tel_inputs = getA('.tel_input')
    let emailInputs = getA('.email_input')
    let telegrammInputs = getA('.telegramm_input')
    let telMask = {
        mask: '+{7}(000) 000-00-00'
    };
    tel_inputs.forEach(element => {
        IMask(element, telMask);

        element.addEventListener('input', (e) => {
            let regex = /^\+7\(\d{3}\) \d{3}-\d{2}-\d{2}$/
            if(regex.test(element.value)){
                element.setCustomValidity("")
            }
            else {
                element.setCustomValidity("Tel invalid")
            }
        })
    })
    
    emailInputs.forEach(element => {
        element.addEventListener('input', (e) => {
            let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ 

        if(regex.test(element.value)){
            element.setCustomValidity("")
        }
        else {
            element.setCustomValidity("Email invalid")
        }
        })
        
    })
    
}