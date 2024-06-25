let test = true
let html = {
    table: `<tbody>
                <tr>
                    <th>имя</th>
                    <th>мал</th>
                    <th>бол</th>
                    <th>мал</th>
                    <th>бол</th>
                    <th>мал</th>
                    <th>бол</th>
                </tr>`,
    player: `<tr data-id="{{id}}" data-name="{{name}}">
                <td>{{name}}</td>
                <td><input type="button" value="1" class="square30" data-type="goal_s" name="pers1_1"></td>
                <td><input type="button" value="1" class="square30" data-type="goal_b" name="pers1_2"></td>
                <td><input type="button" value="1" class="square30 yellow" data-type="yellow_s" name="pers1_3"></td>
                <td><input type="button" value="1" class="square30 yellow" data-type="yellow_b" name="pers1_4"></td>
                <td><input type="button" value="1" class="square30 red" data-type="red_s" name="pers1_5"></td>
                <td><input type="button" value="1" class="square30 red" data-type="red_b" name="pers1_6"></td>
            </tr>`,
    playeOption: `<option value="{{id}}">{{name}}</option>`,
    
    penalty:    `<div class="h-group penalty_box" data-team="{{team}}">
                    <input type="button" value="ГОЛ" class="square40 flex-form  {{selected_goal}}" data-type="goal" name="gol-pen1">
                    <input type="button" value="" class="square40 redo-icon  {{selected_clear}}" data-type="clear" name="pass-pen1">
                    <input type="button" value="CЭЙВ" class="square40 flex-form {{selected_defeat}}" data-type="defeat" name="save-pen1" >
                </div>`
}
let testConnect = setInterval(() => {
    if (socket.connected) {
        clearInterval(testConnect)
        socket.emit('join_panel');
    }
}, 200)
let playerTables ={
    table_1: get('#table_team_1'),
    table_2: get('#table_team_2'),
    select_1: getA('#team1-replace ,#team1-replace-by'),
    select_2: getA('#team2-replace ,#team2-replace-by'),
}
let variations_tablo = getA('.tablo_variation > input');

let play = get('#play');
play.addEventListener('click', (e) => {
    console.log(socket.id)
    socket.emit('play_timer');
})
let match = get('#match');
match.addEventListener('change', (e) => {
    socket.emit('match', e.target.value);
})
let style = get('#panel-style');
style.addEventListener('change', (e) => {
    let data = {
        style: e.target.value
    }
    socket.emit('style', data);
})
socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('join_panel');
});
socket.on('reconnect', () => {
    console.log(socket.id)
    socket.emit('join_panel');
});
socket.on('timer', (data) => {
    get('.time').innerHTML = data.value
    console.log(data.value)
})

socket.on('update_data', (data) => {
    style.value = data.style
    console.log(data)
    if(data.tablo) {
        variations_tablo.forEach(variation => {
            if(variation.getAttribute('data-type') == data.tablo.type) {
                variation.classList.add('selected')
            }
            else
                variation.classList.remove('selected')
        })
    }
    if(data.match) {
        setMatch(data, 1)
        setMatch(data, 2)
    }
    if(data.scoreboard) {
        setScoreboard(data.scoreboard)
    }
})
function setScoreboard(scoreboard) {
    get('#score_team1').value = scoreboard.team1
    get('#score_team2').value = scoreboard.team2
    setPenalty(scoreboard.penalty)
}

function setPenalty(penalty) {
    let div = get('#penalty_div')
    div.innerHTML = ''
    penalty.forEach((el, i) => {
        let tempHTML = ''
        tempHTML = `<div class="h-group bigger-gap" data-index="${i}">`
        tempHTML += html.penalty.replace('{{team}}', '1').replace(`{{selected_${el.team1?el.team1:'clear'}}}`, 'selected')

        tempHTML += html.penalty.replace('{{team}}', '2').replace(`{{selected_${el.team2?el.team2:'clear'}}}`, 'selected')
        tempHTML = tempHTML.replaceAll('{{selected_clear}}','').replaceAll('{{selected_defeat}}','').replaceAll('{{selected_goal}}','')
        tempHTML += `</div>`
        div.innerHTML += tempHTML
        console.log(tempHTML)
    })
    let penDif = 5-penalty.length 
    console.log(penDif)
    if(penDif > 0) {
        for(let i = 0; i < penDif; i++) {
            let tempHTML = ''
            tempHTML += `<div class="h-group bigger-gap" data-index="${i+penalty.length}">`
            tempHTML += html.penalty.replace('{{selected_clear}}', 'selected').replace('{{team}}', '1')
            tempHTML += html.penalty.replace('{{selected_clear}}', 'selected').replace('{{team}}', '2')

            tempHTML += `</div>`
            div.innerHTML += tempHTML
        }
    }
    getA('.penalty_box > input').forEach(box => {
        box.addEventListener('click', (e) => {
            let index = e.target.closest('.h-group.bigger-gap').getAttribute('data-index')
            let team = e.target.closest('.penalty_box').getAttribute('data-team')
            let type = e.target.getAttribute('data-type')
            let nPenalty = penalty
            for(let i = 0; i <= index; i++) {
                if(!nPenalty[i]) {
                    nPenalty[i] = {
                        team1: 'clear',
                        team2: 'clear'
                    }
                }
            }

            nPenalty[index]['team' + team] = type
            let data ={
                score: {
                    penalty: nPenalty
                }
            }
            console.log(data)
            socket.emit('new_data', data)
        })
    })

}
function playerNotifyListener(e) {
    console.log(e.target)
    let player = e.target.closest('tr').getAttribute('data-name')
    let type = e.target.getAttribute('data-type').split('_')
    let txt = '', title = ''
    if(type[0] == 'goal') {
        txt = 'Игрок ' + player + ' забил гол'
        title = 'Гоооооол'
    }
    else if(type[0] == 'yellow') {
        txt = 'Игрок ' + player + ' получил жёлтую карту'
        title = 'Жёлтая карта'
        type[0] = 'yellow-card'
    }
    else if(type[0] == 'red') {
        txt = 'Игрок ' + player + ' получил красную карту'
        title = 'Красная карта'
        type[0] = 'red-card'
    }
    
    let data = {
        type: type[0],
        size : type[1],
        text: txt,
        title: title,
    }
    socket.emit('notify', data)
}
console.log(socket.id)
let textInpts = getA('input[type="text"], input[type="color"], input[type="number"]');
console.log(textInpts)

textInpts.forEach(input => {
        let fTimer;
        function f(e) {
            if(fTimer) {
                clearTimeout(fTimer);
            }
            fTimer = setTimeout(function() {
                fTimer = void 0;
                console.log('dfsdfsdf')
                standartListener(e);
            }.bind(this), 500);
        }
        input.addEventListener('input', f)

})
let scoreDivs = getA('.score_div');

scoreDivs.forEach(div => {
    let plus_minus = getA('input[type="button"]', div),
    score = get('input[type="number"]', div);
    console.log(plus_minus, score)
    plus_minus.forEach(btn => btn.addEventListener('click', listener))
    function listener(e) {
        let name = e.target.name;
        if(name == 'plus') {
            score.value = +score.value + 1
        }
        else if(name == 'minus') {
            score.value = +score.value - 1
        }
        let data = {
            score: {}
        }
        data.score[score.name] = score.value
        socket.emit('new_data', data)
    }
})
function standartListener(e) {
    let data = {}
    let name = e.target.name,
    value = e.target.value
    if(e.target.getAttribute('data-type') == 'score') {
        data.score = {}
        data.score[name] = value
    }
    else
        data[name] = value
    console.log(data)
    socket.emit('new_data', data)
}

function sendTime() {
    let time = `${minuts}:${seconds}`
    let data = {
        name: 'timer',
        value: time
    }
    socket.emit('new_data', data)
}

variations_tablo.forEach(variation => {
    variation.addEventListener('click', (e) => {
        let data = {
            'tablo' : e.target.getAttribute('data-type'),
        }
        socket.emit('new_data', data)
    })
})

function setMatch(data, team) {
    match.value = data.match._id
    console.log(data)
    let nowTable = playerTables['table_'+team]

    nowTable.innerHTML = html.table

    getA('.data_team_'+team).forEach(el => {
        console.log(el)
        if(el.localName == 'input'){
            el.value = data.match['team_'+team].name
            el.setAttribute('readonly', true)
        }
        else if(el.getAttribute('data-type') == 'replace')
            el.innerHTML = 'Замена ' + data.match['team_'+team].name
        else
            el.innerHTML = data.match['team_'+team].name
    })
   

    data['players_'+team].forEach(player => {
        nowTable.innerHTML += html.player.replace('{{id}}', player._id).replaceAll('{{name}}', player.fio)
    })
    nowTable.innerHTML += '</tbody>'

    getA('.square30', nowTable).forEach(el => {
        el.addEventListener('click', playerNotifyListener)
    })


}