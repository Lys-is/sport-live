const notif = `<div class="notification disabled notif_main " id={{id}}>
        {{img_place}}
        <div class="content">
            <div class="notif_team_logo {{team_logo}}"></div>
            <div class="name"><span class="notif_num">{{num}}</span>{{name}}</div>
            <div class="region notif_accent notif_text">{{description}} </div>
        </div>
        <div class="img {{main_class}} {{add_class}} notif_accent"></div>
    </div>`
const notifImg = `<img class="notif_border_main" src="{{img}}">`
const notifImgAdd = `<img class="notif_additional_img" src="{{img}}">`
let testConnect = setInterval(() => {
    if (socket.connected) {
        clearInterval(testConnect)
        socket.emit('join_table', tableId);
    }
}, 200)
socket.on('connect', async () => {
    console.log(socket.id)
    await socket.emit('join_table', tableId);
    await socket.emit('get_tour_img');
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
socket.on('tour_img', (data) => {
    console.log(data, 'fdfdfdfdfdfd')
    setTourImg(data)
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
        if(data.playerNum)
            newNotify = newNotify.replace('{{num}}', data.playerNum[i] != 'null' ? data.playerNum[i] : '')
        else
            newNotify = newNotify.replace('{{num}}', '')
        newNotify = newNotify.replace('{{team_logo}}', `bg_${data.teamD[i]}_logo`)
        newNotify = newNotify.replace('{{img}}', data?.imgArr[i] ? data?.imgArr[i] : '/static/styles/icons/empty.png')
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
            notf.style.opacity = '0'
            notf.style.transform = 'translateX(800px)'
            
            setTimeout(() => {
               console.log(notf.classList)
                
             notf.remove()

            }, 1000)
        }, 3000 + time)
    }

})

let timerDivs = {
    t: getA('.q_time'),
    r: getA('.q_round'),
    n: getA('.q_name'),
    tr: getA('.q_time_round'),
    nr: getA('.q_name_round'),
    trn: getA('.q_time_name_round'),
    rs: getA('.q_round_num'),
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
    'end': 'Конец матча',
    'out': 'Тайм-аут',
    'VAR': 'VAR',
    'pens': 'Пенальти'
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
let n_div = ''
console.log(base_divs)
let first_style_tag = (function(type) {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            console.log('sdfsdfsdfdsfsdfsdfsdfdsf')
           // let tag = get('#style_start')
           // tag.remove()
            document.body.style.display = 'block'
            // let ddiv = getA(`.${type}`)
            // ddiv.forEach(el => {
            //     el.style.display = 'block'
            // })
            //setTimeout(() => { setAnim(type) }, 100)
        }
    };
})();
function setData(data) {
    let foll_divs = getA('.fouls-container')
    console.log(data.is_fouls, foll_divs)
    foll_divs.forEach(el => {
        el.style.display = data.is_fouls ? '' : 'none'
    })
    notifyBlock.classList = 'notifications_div ' + data.notif_type
    first_style_tag(data.tablo.type)
    console.log(data)
    setNames(data)
    
    setTime(data.timer)
    if(data.tablo) {
        switchDiv(data.tablo.type)
    }
    if(data.scoreboard) {
        setScoreboard(data.scoreboard)
    }
    if(data.match && data.cached) {
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
        setCouch(data)
        setRepresentative(data)
        setStyleEl(data)
        let date = formatDatePretty(data.match.date || '2021-01-01')
        getA('.var-tour').forEach(el => el.innerHTML = data.match.circle || 0) 
        getA('.var-match-date, .var-match-date-text').forEach(el => {el.innerHTML = date})
        getA('.var-match-time, .var-match-time-text').forEach(el => {el.innerHTML = data.match.time || '00:00'})
        getA('.var-tournament').forEach(el => el.innerHTML = data.match.tournament?.basic.full_name || 'Вне турнира')
        getA('.var-stadium').forEach(el => el.innerHTML = data.match.stadium || 'Стадион не указан')
        socket.emit('get_tour_img');

    }
}

function setStyleEl(data) {
    let t = get('#style_start')
    if(t) t.remove()
    let el = document.createElement('style')
    el.innerHTML = `
    .bg_home_logo {
        background-image: url(${data.match.team_1.img});
    }
    .bg_away_logo {
        background-image: url(${data.match.team_2.img});
    }`
    el.id='style_start'
    document.body.append(el)
}
function setCouch(data) {
    if(data.couch_1 && data.couch_1.length > 0) {
        let div = get('.home-couch')
        setRosterEl(div, data.couch_1)
    }
    if(data.couch_2 && data.couch_2.length > 0) {
        let div = get('.away-couch')
        setRosterEl(div, data.couch_2)
    }
    function setNameCouch(div, name) {
        if(!div) return
        let nameEl = get('.couch-name', div)
        div.style.display = 'block'
        nameEl.innerHTML = name
    }
}
function setRepresentative(data) {
    console.log(!!data.representative_1 , data.representative_1.length)
    if(data.representative_1 && data.representative_1.length > 0) {
        let div = get('.home-representative')
        setRosterEl(div, data.representative_1)
    }
    if(data.representative_2 && data.representative_2.length > 0) {
        let div = get('.away-representative')
        setRosterEl(div, data.representative_2)
    }
    
}
function setRosterEl(div, arr) {
    if(!div) return
    let gridDiv = get('.grid', div)
    console.log(gridDiv, arr)
    if(!gridDiv) return
    gridDiv.innerHTML = ''
    div.style.display = 'block'
    arr.forEach((el, i) => {
        gridDiv.innerHTML += `<div class="roster-teamate">
                                <p class="roster-teamate-name">${el.fio}</p>
                                <img width="40" height="40" src="${el.img || '/static/styles/icons/empty.png'}">
                            </div>`
        })
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
                                    <img width="40" height="40" src="${el.img || '/static/styles/icons/empty.png'}">
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
            timerDivs[key]?.forEach(el => el.innerHTML = ( data.scenarios == '1' || data.scenarios == '2' ) ? `${data.scenarios}T` : '')
        }
        else if(key == 'tr'){
            timerDivs[key]?.forEach(el => el.innerHTML = data.value +  ( data.scenarios == '1' || data.scenarios == '2' ) ? `  ${data.scenarios}T` : '')
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
        else if(key == 'rs'){
            timerDivs[key]?.forEach(el => el.innerHTML = ( data.scenarios == '1' || data.scenarios == '2' ) ? `${data.scenarios}` : '')
        }
        else if(key == 'trn'){
            timerDivs[key]?.forEach(el => el.innerHTML = data.value +  "  " + (( data.scenarios == '1' || data.scenarios == '2' ) ? `  ${data.scenarios}T` : scenariosA[data.scenarios]))
        }
       // if(timerDivs[key]) timerDivs[key].innerHTML = data.value
    })
    let ord = get('.var-ordinal')
    if(ord) ord.style.display = 'none'

}
let is_pen_now = false
function switchDiv(type) {
    let mb = get('#match-info > .q_name_round')

    console.log(type, n_div, is_pen_now)
    if(type == n_div && type != 'pen') {
        is_pen_now = false
        getA('.pen').forEach(el => setAnim(el, 'reverse', 'pen'))
        if(mb) setAnim(mb, 'normal', 'mb')
            n_div = type
        return
    }
    else if(type != n_div && type != 'pen') {
            is_pen_now = false
            if(mb) setAnim(mb, 'normal', 'mb')
            base_divs.forEach(div => {
                setAnim(div, 'reverse', type)
        
            })
            getA('.pen').forEach(el => setAnim(el, 'reverse', 'pen'))


            getA(`.${type}`).forEach(div => {
                setAnim(div, 'normal')
            })
            n_div = type
        return
    }
    
    scrollTo(0, 0)
    //if(mb) mb.style.display = 'block'
    if(type == 'pen' && !is_pen_now) {
        is_pen_now = true
        console.log('fsdfsdfsdf', mb)   
        if(mb) setAnim(mb, 'reverse', 'mb')
        getA('.pen').forEach(el => setAnim(el, 'normal', 'pen'))
            return
    }
    else if(type == 'pen' && is_pen_now) {
        return
    }
    else {
        if(mb) setAnim(mb, 'normal', 'mb')
    }
    base_divs.forEach(div => {
        if(div.className.includes(type) || div.className == type) return
        setAnim(div, 'reverse', type)

    })

    getA(`.${type}`).forEach(div => {
        setAnim(div, 'normal', type)
    })
    if(type != 'pen') {
        n_div = type
    }
}
let animTimouts = {

}
let mb = get('#match-info > .q_name_round')

function setAnim(div, direct, type) {
    if(type == 'pen' && !div.className.includes('pen')) return
    const compStyles = window.getComputedStyle(div);
    let mb = get('#match-info > .q_name_round')
    let visibleType = div.getAttribute('visible_type') || 'block'
    let [prevDisplay, nextDisplay] = (direct == 'normal' ? ['none', visibleType] : [visibleType, 'none'])
    
   // console.log(div, prevDisplay, nextDisplay)
    if(animTimouts[div.className]){
       //clearTimeout(animTimouts[div.className])
    }

    if(compStyles.getPropertyValue('display') == prevDisplay){
        let delay = 100
        
        let anim = compStyles.getPropertyValue('animation-name')
        if(anim == 'none') {
            div.style.animationName = ''
        }
        anim = compStyles.getPropertyValue('animation-name')
        div.style.animationName = 'none'
        console.log(anim, div, direct, prevDisplay, nextDisplay, type)
        div.style.animationDirection = direct;
        div.style.animationDuration = '0.5s';
        div.style.transitionDuration = '0.5s';
       // div.style.animationDelay = '0.5s';
       // div.style.maxHeight = '0px'
       if(prevDisplay == visibleType) {
        //  div.setAttribute('is_active','block') 
          //div.style.display = 'block'
          div.style.animationDelay = '0s';
         // console.log('block_delayyyyyyyyyy', div)

          delay = 1000
      }
        setTimeout(() => {
            div.style.animationName = anim

        },50)

  
        
        let tmout =  setTimeout(() => {
            //div.setAttribute('is_active',nextDisplay) 
            if(mb) mb.style.display = nextDisplay
            div.style.display = nextDisplay

            //console.log('timeout', div, nextDisplay, delay)
        }, delay)
        animTimouts[div.className] = tmout
   }
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
    let adv_fouls_home = getA('.var-home-fouls-advenced'),
        adv_fouls_away = getA('.var-away-fouls-advenced')

        if(adv_fouls_home.length > 0) {
            setAdvFouls(adv_fouls_home, scoreboard.team1_foll)

        }
        if(adv_fouls_away.length > 0) {
            setAdvFouls(adv_fouls_away, scoreboard.team2_foll)

        }

}
let penaltyHTML = `<div class="penaltie" style="background-color: var(--pen-{{penalty.type}});"></div>`

function setAdvFouls(divs, fouls) {

    divs.forEach(div => {
        div.innerHTML = ''
        for(let i = 1; i <= 5; i++) {
            if(i <= fouls) {
                div.innerHTML += `<div class="penaltie" style="background-color: var(--pen-defeat);"></div>`
            }
            else {
                div.innerHTML += `<div class="penaltie" style="background-color: var(--pen-dark);"></div>`
            }
        }
    })
}
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

        getA('.var-home-three').forEach(el => el.innerHTML = data.team1_name.slice(0, 3));
        getA('.var-away-three').forEach(el => el.innerHTML = data.team2_name.slice(0, 3));
}

function setTourImg(data) {
    getA('.league_logo').forEach(el => {
        el.src = data.league_img || ''
    })
    getA('.tour_logo').forEach(el => {
        el.src = data.tour_img || ''
    })
}

function formatDatePretty(date, sep = '.') {
    date = new Date(date);
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join(sep);
  }