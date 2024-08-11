let test = true
let global_data = {}
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
    player: `<tr data-id="{{id}}" data-name="{{name}}" data-team="{{team}}" data-num="{{num}}" data-teamD="{{teamD}}">
                <td>{{name}}</td>
                <td><input type="button" value="{{num}}" class="square30" data-type="goal_s" name="pers1_1"></td>
                <td><input type="button" value="{{num}}" class="square30" data-type="goal_b" name="pers1_2"></td>
                <td><input type="button" value="{{num}}" class="square30 yellow" data-type="yellow_s" name="pers1_3"></td>
                <td><input type="button" value="{{num}}" class="square30 yellow" data-type="yellow_b" name="pers1_4"></td>
                <td><input type="button" value="{{num}}" class="square30 red" data-type="red_s" name="pers1_5"></td>
                <td><input type="button" value="{{num}}" class="square30 red" data-type="red_b" name="pers1_6"></td>
            </tr>`,
    playeOption: `<option data-team="{{team}}" data-num="{{num}}" value="{{id}}">{{name}}</option>`,
    
    penalty:    `<div class="h-group penalty_box" data-team="{{team}}">
                    <input type="button" value="ГОЛ" class="square40 flex-form  {{selected_goal}}" data-type="goal" name="gol-pen1">
                    <input type="button" value="" class="square40 redo-icon  {{selected_clear}}" data-type="clear" name="pass-pen1">
                    <input type="button" value="CЭЙВ" class="square40 flex-form {{selected_defeat}}" data-type="defeat" name="save-pen1" >
                </div>`
}
let testConnect = setInterval(() => {
    if (socket.connected) {
        clearInterval(testConnect)
        socket.emit('join_panel', tableId);
    }
}, 200)
let playerTables ={
    table_1: get('#table_team_1'),
    table_2: get('#table_team_2'),
    select_1: getA('#team1-replace ,#team1-replace-by'),
    select_2: getA('#team2-replace ,#team2-replace-by'),
}

let couchDiv = get('#couches')
let replaceBtns = getA('.replace_btn');
let showJudges = get('#show_judges'),
showCommentators = get('#show_commentators');

replaceBtns?.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let type = e.target.getAttribute('data-type').split('__')
        let player1 = get(`#${type[0]}-replace`),
        player2 = get(`#${type[0]}-replace-by`)
        let txtArr = [player1.options[player1.selectedIndex].innerHTML, player2.options[player2.selectedIndex].innerHTML]
        let numArr = [player1.options[player1.selectedIndex].getAttribute('data-num'), player2.options[player2.selectedIndex].getAttribute('data-num')]
        let teamDArr = [player1.options[player1.selectedIndex].getAttribute('data-teamD'), player2.options[player2.selectedIndex].getAttribute('data-teamD')]
        let add_class = ['shadow_red', 'shadow_green']
        let ids = [player1.options[player1.selectedIndex].value, player2.options[player2.selectedIndex].value]
        let data = {
            type: 'change',
            size : type[1],
            text: txtArr,
            playerNum: numArr,
            teamD: teamDArr,
            title: 'Замена игрока',
            ids: ids,
            model: 'Player',
            add_class: add_class
        }
        socket.emit('notify', data)
    })
})

socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('join_panel', tableId);
});
socket.on('reconnect', () => {
    console.log(socket.id)
    socket.emit('join_panel', tableId);
});

socket.on('update_data', (data) => {
    global_data = data
    console.log(data)
    if(data.match) {
        couchDiv.innerHTML = ''
        setMatch(data, 1)
        setMatch(data, 2)
    }

})





function playerNotifyListener(e) {
    console.log(e.target)
    let playerTr = e.target.closest('tr')
    let player = playerTr.getAttribute('data-name')
    let type = e.target.getAttribute('data-type').split('_')
    let team = playerTr.getAttribute('data-team')
    let num = playerTr.getAttribute('data-num')
    let ids = [playerTr.getAttribute('data-id')]
    let txt = [], title = ''
    let teamD = playerTr.getAttribute('data-teamD')
    if(type[0] == 'goal') {
        txt[0] = player
    }
    else if(type[0] == 'yellow') {
        txt[0] = player
        type[0] = 'yellow-card'
    }
    else if(type[0] == 'red') {
        txt[0] = player
        type[0] = 'red-card'
    }
    title = team

    let data = {
        type: type[0],
        size : type[1],
        text: txt,
        title: title,
        playerNum: [num],
        teamD: [teamD],
        ids,
        model: 'Player',
    }
    socket.emit('notify', data)
}
console.log(socket.id)
let textInpts = getA('input[type="text"], input[type="color"], input[type="number"]');
console.log(textInpts)
let show_info = get('#show_info');
show_info.addEventListener('click', (e) => {
    let title = get('#useful_title').value,
        text = get('#useful').value
    
    let dta = {
        type: 'couch',
        size : 's',
        text: [text],
        title: [title],
        ids: [null],
    }
    socket.emit('notify', dta)
    console.log(dta)
})
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



function setMatch(data, team) {
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
        nowTable.innerHTML += html.player.replace('{{id}}', player._id).replaceAll('{{name}}', player.fio).replaceAll('{{team}}', data.match['team_'+team].name).replaceAll('{{num}}', player.num || 0)
        .replace('{{teamD}}', team == 1 ? 'home' : 'away')
    })
    nowTable.innerHTML += '</tbody>'

    getA('.square30', nowTable).forEach(el => {
        el.addEventListener('click', playerNotifyListener)
    })

    playerTables['select_'+team].forEach(el => {
        el.innerHTML = ''
        data['players_'+team].forEach(player => {
            el.innerHTML += `<option data-num="${player.num}" data-teamD="${team == 1 ? 'home' : 'away'}" value="${player._id}">${player.fio}</option>`
        })
    })

    if(data['couch_'+team]) {
        console.log(data['couch_'+team])
        couchDiv.innerHTML += '<h3>Тренеры команды '+data['team'+team+'_name']+'</h3>'
        data['couch_'+team].forEach((couch, i) => {
            console.log(couch)
            couchDiv.innerHTML += `<input type="button" data-number="${i}"  data-type="s_${team}" value="${couch.fio} (маленький)">`
            couchDiv.innerHTML += `<input type="button"  data-number="${i}"   data-type="b_${team}" value="${couch.fio} (большой)">`
        })
        couchDiv.innerHTML += '</br>'
    }
 
    
    getA('input', couchDiv).forEach(input => {
        input.addEventListener('click', (e) => {
            let type = e.target.getAttribute('data-type').split('_')[0]
            let team = e.target.getAttribute('data-type').split('_')[1]
            let number = e.target.getAttribute('data-number')
            couchNotify(number, team, type, data)
        })
    })

}      

function couchNotify(num, team, type, data) {

    let title = 'Тренер команды '+data['team'+team+'_name']
    let txt = [data['couch_'+team][num].fio]
    let img = ''
    let teamD = team == 1 ? 'home' : 'away'
    let ids = [data['couch_'+team][num]._id]

    if(type == 'b') {
        img = `<div>{{couch_img__${0}}}`
    }
    let dta = {
        type: 'couch',
        size : type,
        text: txt,
        title: title,
        teamD: [teamD],
        couchId: data['couch_'+team][num]._id,
        ids: ids,
        model: 'Couch',
    }
    socket.emit('notify', dta)
}

let showJudge = get('.show_judge');
let showCommentator = get('.show_commentator');
let judgeSelect = get('#select_judge');
let commentatorSelect = get('#select_commentator');
showJudge.addEventListener('click', (e) => {
        let option = judgeSelect[judgeSelect.selectedIndex]
        console.log(option)
        let txt = option.innerHTML
        let id = option.value
        let dta = {
            type: 'judge',
            size : 'b',
            text: [txt],
            title: 'Судья',
            ids: [id],
            model: 'Judge',
        }
        socket.emit('notify', dta)
})

showCommentator.addEventListener('click', (e) => {
        let option = commentatorSelect[commentatorSelect.selectedIndex]
        console.log(option)
        let txt = option.innerHTML
        let id = option.value
        
        let dta = {
            type: 'commentator',
            size : 'b',
            text: [txt],
            title: 'Комментатор',
            ids: [id],
            model: 'Commentator',
        }
        socket.emit('notify', dta)
    })

