socket.emit('join_table');

socket.on('update_data', (data) => {
    console.log(data)
    let el = get(`input[name="${data.name}"]`);
    el.value = data.value
    console.log('update_data')
})

socket.on('update_event', (data) => {
    
})
socket.on('start', (data) => {
  console.log(data)
  setData(data)
})
let base_divs = getA('.big, .mid, .little, .little-ploff, .home-roster, .away-roster, .pen, .refs, .weather')
let n_div = ''
console.log(base_divs)

function setData(data) {
    setNames(data)
    if(data.type) {
        switchDiv(data.type)
    }
    if(data.scoreboard) {
        setScoreboard(data.scoreboard)
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
    getA('.var-home-score').forEach(el => el.innerHTML = scoreboard.team1+1)
    getA('.var-away-score').forEach(el => el.innerHTML = scoreboard.team2-1)
}


function setNames(data) {
    if(data.team1_name) {
        getA('.var-home, .home-team, .var-home-short').forEach(el => el.innerHTML = data.team1_name);
    if(data.team2_name) {
        getA('.var-away, .away-team, .var-away-short').forEach(el => el.innerHTML = data.team2_name);
    }
    }
}