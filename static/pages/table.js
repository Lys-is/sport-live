const notif = `<div class="notification disabled" id={{id}}>
        {{img_place}}
        <div class="content">
            <div class="name">{{name}}</div>
            <div class="region">{{description}}</div>
        </div>
        <div class="img {{main_class}} {{add_class}}"></div>
    </div>`
const notifImg = `<img src="{{img}}">`
let testConnect = setInterval(() => {
    if (socket.connected) {
        clearInterval(testConnect)
        socket.emit('join_table', tableId);
    }
}, 200)
socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('join_table', tableId);

})
socket.on('reload', () => {
    location.reload();
})
socket.on('update_data', (data) => {
    setData(data)
})
socket.on('update_style', () => {
    location.reload()
})
let notifyTimer
let notifyDivs = []
let notifyBlock = get('.notifications_div')

socket.on('new_notify', (data) => {
    console.log(data)
    for (let i = 0; i < data.ids.length; i++) {
        let newNotify = notif;
        let id = 'id' + Math.random().toString(36).substr(2, 9)
        if(data.size == 's'){
            newNotify = newNotify.replace('{{img_place}}', '')
        }
        else{
            newNotify = newNotify.replace('{{img_place}}', notifImg)
        }
        newNotify = newNotify.replace('{{id}}', id)
        newNotify = newNotify.replace('{{name}}', data.text[i])
        newNotify = newNotify.replace('{{description}}', data.title)
        newNotify = newNotify.replace('{{img}}', data.imgArr[i])
        newNotify = newNotify.replace('{{main_class}}', data.type || '')
        if(data.add_class && data.add_class[i]) newNotify = newNotify.replace('{{add_class}}', data.add_class[i])
        else newNotify = newNotify.replace('{{add_class}}', '')
        console.log(data)

        notifyBlock.innerHTML += newNotify
        setNotify(id, (i+1)*10)
        clearNotify(id, (i+1)*100)

        
    }
    function setNotify(id, time) {
        setTimeout(() => {
            let notf = get(`#${id}`)
            notifyDivs.push(notf)
            notf.classList.remove('disabled')
            
        }, 100 + time)
        
    }
    function clearNotify(id,time) {
        console.log(id)
        setTimeout(() => {
            let notf = get(`#${id}`)
            notf.remove()
        }, 3000 + time)
    }

})

let timerDivs = {
    t: getA('.q_time'),
    r: getA('.q_round'),
    n: getA('.q_name'),
    tr: getA('.q_time_round'),
    nr: getA('.q_name_round'),
    trn: getA('.q_time_round_name'),
    // s: get('#top-timer'),
    // b: get('#info'),
    // c: get('.var-time')
}
console.log(timerDivs)
let scenariosA = {
    'begin': 'Начало матча',
    '1': '1T',
    'pause': 'Перерыв',
    '2': '2T',
    'end': 'Конец матча'
}
socket.on('timer', (data) => {
    console.log(data)
    if(data.timer?.changed) {
        socket.emit('get_data')
    }

    setTime(data)
    
    // timerDivs.s.innerHTML = data.value
    // timerDivs.b.innerHTML = data.value
    console.log(data.value)
})
socket.on('start', (data) => {
  console.log(data)
  setData(data)
})
let base_divs = getA('.big, .mid, .little, .little-ploff, .home-roster, .away-roster, .pen, .refs, .weather')
let n_div = 'little'
console.log(base_divs)
let first_style_tag = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            let tag = get('#style_start')
            tag.remove()
            document.body.style.display = 'block'
        }
    };
})();
function setData(data) {
    let foll_divs = getA('.fouls-container')
    console.log(data.is_fouls)
    foll_divs.forEach(el => {
        el.style.display = data.is_fouls ? '' : 'none'
    })
    

    first_style_tag()
    console.log(data)
    setNames(data)
    
    setTime(data.timer)
    if(data.tablo) {
        switchDiv(data.tablo.type)
    }
    if(data.scoreboard) {
        setScoreboard(data.scoreboard)
    }
    if(data.match) {
        getA('.home-logo').forEach(el => {
            el.src = data.match.team_1.img ? data.match.team_1.img : '/static/styles/icons/logo.jpg'
        })
        getA('.away-logo').forEach(el => {
            el.src = data.match.team_2.img ? data.match.team_2.img : '/static/styles/icons/logo.jpg'
        })

        let players = [data.players_1, data.players_2]
        players.forEach((el, i) => {
            setRoster(el, i+1)
        })

    }
}
function setRoster(players, i) {
    if(!players) 
        return
    let rosterDiv
    if(i == 1) {
        rosterDiv = get('.roster-container.home-roster')
    }
    else {
        rosterDiv = get('.roster-container.away-roster')
    }
    playersDiv = get('.roster-content', rosterDiv)
    playersDiv.innerHTML = ''
    players.forEach(el => {
        playersDiv.innerHTML += `<div class="roster-teamate">
                                    <p class="roster-teamate-name">${el.fio}</p>
                                    <img width="40" height="40" src="${el.img || '/static/styles/icons/logo.jpg'}">
                                </div>`
                    })
    
}
function setTime(data) {

    let min = data.minuts < 10 ? `0${data.minuts}` : data.minuts
    let sec = data.seconds < 10 ? `0${data.seconds}` : data.seconds
    if(!data.value)
        data.value = `${min}:${sec}`
    Object.keys(timerDivs).forEach(key => {
        if(key == 't'){
            timerDivs[key]?.forEach(el => el.innerHTML = data.value)
        }
        else if(key == 'r'){
            timerDivs[key]?.forEach(el => el.innerHTML = ( data.scenarios == '1' || data.scenarios == '2' ) ? ` ${data.scenarios}T` : '')
        }
        else if(key == 'tr'){
            timerDivs[key]?.forEach(el => el.innerHTML = data.value +  ( data.scenarios == '1' || data.scenarios == '2' ) ? ` ${data.scenarios}T` : '')
        }
        else if(key == 'nr'){
            timerDivs[key]?.forEach(el => el.innerHTML = scenariosA[data.scenarios])
        }
        else if(key == 'n'){
            if( data.scenarios != '1' && data.scenarios != '2')
                timerDivs[key]?.forEach(el => el.innerHTML = scenariosA[data.scenarios])
            else
                timerDivs[key]?.forEach(el => el.innerHTML = '')
        }
        else if(key == 'trn'){
            timerDivs[key]?.forEach(el => el.innerHTML = data.value +  ( data.scenarios == '1' || data.scenarios == '2' ) ? ` ${data.scenarios}T` : scenariosA[data.scenarios])
        }
       // if(timerDivs[key]) timerDivs[key].innerHTML = data.value
    })
    let ord = get('.var-ordinal')
    if(ord) ord.style.display = 'none'

}
function switchDiv(type) {
    scrollTo(0, 0)
    let mb = get('#match-info > .q_time_name_round')
    if(mb) mb.style.display = 'block'
    console.log(type)
    base_divs.forEach(div => {
        div.style.display = 'none'
    })
    if(type == 'pen') {
        getA(`.${n_div}`).forEach(div => div.style.display = 'block')
        if(mb) mb.style.display = 'none'
    }
    else {
        n_div = type
    }
    
    console.log(n_div)
    getA(`.${type}`).forEach(div => div.style.display = 'block')
    
}


function setScoreboard(scoreboard) {
    getA('.var-home-score').forEach(el => el.innerHTML = scoreboard.team1)
    getA('.var-away-score').forEach(el => el.innerHTML = scoreboard.team2)
    getA('.var-homeColor').forEach(el => {el.style.background = scoreboard.team1_color; el.style.color = scoreboard.team1_font_color})
    getA('.var-awayColor').forEach(el => {el.style.background = scoreboard.team2_color; el.style.color = scoreboard.team2_font_color})
    getA('.var-homeTextColor').forEach(el => el.style.color = scoreboard.team1_font_color)
    getA('.var-awayTextColor').forEach(el => el.style.color = scoreboard.team2_font_color)
    getA('.var-home-fouls').forEach(el => el.innerHTML = scoreboard.team1_foll)
    getA('.var-away-fouls').forEach(el => el.innerHTML = scoreboard.team2_foll)
    getA('.bgleft').forEach(el => el.style.borderBottomColor = scoreboard.team1_color)
    getA('.bgright').forEach(el => el.style.borderBottomColor = scoreboard.team2_color)
    if(scoreboard.penalty && scoreboard.penalty.length > 0) {
        setPenalty(scoreboard.penalty)
    }
    

}
let penaltyHTML = `<div class="penaltie" style="background-color: var(--pen-{{penalty.type}});"></div>`
function setPenalty(penalty) {

    let team1 = getA('.penalties-home')
    let team2 = getA('.penalties-away')
    let scorePen1 = getA('.var-penalties-home')
    let scorePen2 = getA('.var-penalties-away')
    team1.forEach(div => div.innerHTML = '')
    team2.forEach(div => div.innerHTML = '')
    penalty.forEach((el, i) => {
        team1.forEach(div => { div.innerHTML += penaltyHTML.replace('{{penalty.type}}', el.team1 ? el.team1 : 'clear')})
        team2.forEach(div => { div.innerHTML += penaltyHTML.replace('{{penalty.type}}', el.team2 ? el.team2 : 'clear')})
    })
    scorePen1.forEach(div => div.innerHTML = penalty.filter(el => el.team1 == 'goal').length || 0)
    scorePen2.forEach(div => div.innerHTML = penalty.filter(el => el.team2 == 'goal').length || 0)

    let penDif = 5-penalty.length 
    if(penDif > 0) {
        for(let i = 0; i < penDif; i++) {
            team1.innerHTML += penaltyHTML.replace('{{penalty.type}}', 'clear')
            team2.innerHTML += penaltyHTML.replace('{{penalty.type}}', 'clear')
        }
    }
}

function setNames(data) {
        getA('.var-home, .home-team, .var-home-short').forEach(el => el.innerHTML = data.team1_name);
        getA('.var-away, .away-team, .var-away-short').forEach(el => el.innerHTML = data.team2_name);
    
}