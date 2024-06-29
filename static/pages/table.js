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

socket.on('update_data', (data) => {
    setData(data)
})
socket.on('update_style', () => {
    location.reload()
})
let notifyTimer
let notifyDivs = {
    s: get('.mini-notification'),
    b: get('.notification')
}
let notifyParams = {
    title: getA('.notification_title'),
    message: getA('.notification_message'),
    img: getA('.notification_img'),
}
socket.on('new_notify', (data) => {
    Object.keys(notifyDivs).forEach(key => notifyDivs[key].classList.add('disabled'))
    console.log('fdf')
    console.log(data)
    let div
    if(data.size == 's'){
        div = notifyDivs.s
    }
    else{
        div = notifyDivs.b
    }

    notifyParams.title.forEach(el => el.innerHTML = data.title)
    notifyParams.message.forEach(el => el.innerHTML = data.text)
    notifyParams.img.forEach(el => el.className = 'notification_img '+data.type)
    div.classList.remove('disabled')
    clearTimeout(notifyTimer)
    notifyTimer = setTimeout(() => {
        div.classList.add('disabled')
    }, 4000)
})
let timerDivs = {
    s: get('#top-timer'),
    b: get('#info')
}
socket.on('timer', (data) => {
    Object.keys(timerDivs).forEach(key => {
        if(timerDivs[key]) timerDivs[key].innerHTML = data.value
    })
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

function setData(data) {
    console.log(data)
    setNames(data)
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
    }
}

function switchDiv(type) {
    scrollTo(0, 0)
    console.log(type)
    base_divs.forEach(div => {
        div.style.display = 'none'
    })
    if(type == 'pen') {
        getA(`.${n_div}`).forEach(div => div.style.display = 'block')
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
    getA('.bgleft').forEach(el => el.style.borderBottomColor = scoreboard.team1_color)
    getA('.bgright').forEach(el => el.style.borderBottomColor = scoreboard.team2_color)
    if(scoreboard.penalty && scoreboard.penalty.length > 0) {
        setPenalty(scoreboard.penalty)
    }
    

}
let penaltyHTML = `<div class="penaltie" style="background-color: var(--pen-{{penalty.type}});"></div>`
function setPenalty(penalty) {

    let team1 = get('.penalties-home')
    let team2 = get('.penalties-away')
        team1.innerHTML = ''
    team2.innerHTML = ''
    penalty.forEach((el, i) => {
        team1.innerHTML += penaltyHTML.replace('{{penalty.type}}', el.team1 ? el.team1 : 'clear')
        team2.innerHTML += penaltyHTML.replace('{{penalty.type}}', el.team2 ? el.team2 : 'clear')
    })
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