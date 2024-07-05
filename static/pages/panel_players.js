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
        
        let txt = `Замена ${player1.options[player1.selectedIndex].innerHTML}<br> на ${player2.options[player2.selectedIndex].innerHTML}`
        if(type[1] == 'b') {
            txt = `<div>{{player_img__${0}}} ${player1.options[player1.selectedIndex].innerHTML} на </div> <div>{{player_img__${1}}} ${player2.options[player2.selectedIndex].innerHTML}</div>`
        }


        let ids = [player1.options[player1.selectedIndex].value, player2.options[player2.selectedIndex].value]
        let data = {
            type: 'change',
            size : type[1],
            text: txt,
            title: 'Замена игрока',
            ids: ids,
            model: 'Player',
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
    let ids = [playerTr.getAttribute('data-id')]
    let txt = '', title = '', img = ''
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
    if(type[1] == 'b') {
        img = `<div>{{player_img__${0}}}`
    }
    let data = {
        type: type[0],
        size : type[1],
        text: img+txt,
        title: title,
        ids,
        model: 'Player',
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
        nowTable.innerHTML += html.player.replace('{{id}}', player._id).replaceAll('{{name}}', player.fio)
    })
    nowTable.innerHTML += '</tbody>'

    getA('.square30', nowTable).forEach(el => {
        el.addEventListener('click', playerNotifyListener)
    })

    playerTables['select_'+team].forEach(el => {
        el.innerHTML = ''

        data['players_'+team].forEach(player => {
            el.innerHTML += `<option value="${player._id}">${player.fio}</option>`
        })
    })

    if(data['couch_'+team]) {
        console.log(data['couch_'+team])
        couchDiv.innerHTML += '<h3>Тренеры команды '+data['team'+team+'_name']+'</h3>'
        data['couch_'+team].forEach((couch, i) => {
            console.log(couch)
            couchDiv.innerHTML += `<input type="button" data-number="${i}"  data-type="s_${team}" value="${couch.fio} (маленький)"</input>`
            couchDiv.innerHTML += `<input type="button"  data-number="${i}"   data-type="b_${team}" value="${couch.fio} (большой)" </input>`
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

    let title = 'Тренер команды '+data['team'+team+'_name'] + '</div>'
    let txt = data['couch_'+team][num].fio
    let img = ''
    let ids = [data['couch_'+team][num]._id]

    if(type == 'b') {
        img = `<div>{{couch_img__${0}}}`
    }
    let dta = {
        type: 'couch',
        size : type,
        text: img+txt,
        title: title,
        couchId: data['couch_'+team][num]._id,
        ids: ids,
        model: 'Couch',
    }
    socket.emit('notify', dta)
}




showJudges.addEventListener('click', (e) => {
    let title = 'Судьи матча'
    let txt = ""
    let ids = []
    if(global_data.match){
        let arrJudges = global_data.match.judges

        arrJudges.forEach((commentator, i) => {
            txt += `<div>{{judge_img__${i}}}Судья ${commentator.fio} </div>`
        })
        ids = arrJudges.map(el => el._id)
        console.log(ids)
    }

    let dta = {
        type: 'judge',
        size : 'b',
        text: txt,
        title: title,
        ids: ids,
        model: 'Judge',
    }
    socket.emit('notify', dta)
})

showCommentators.addEventListener('click', (e) => {
    let title = 'Комментаторы матча'
    let txt = ""
    let ids = []
    if(global_data.match){
        let arrCommentators = global_data.match.commentators

        arrCommentators.forEach((commentator, i) => {
            txt += `<div>{{commentator_img__${i}}}Комментатор ${commentator.fio} </div>`
        })
        ids = arrCommentators.map(el => el._id)
        console.log(ids)
    }

    let dta = {
        type: 'commentator',
        size : 'b',
        text: txt,
        title: title,
        ids: ids,
        model: 'Commentator',
    }
    socket.emit('notify', dta)
    // let title = ''
    // let txt = ""
    // let commentators = [get('#comm1').value, get('#comm2').value].filter(el => el)
    // if(!commentators.length) return
    
    // if(commentators.length == 1) {
    //     title = 'Комментатор матча'
    //     txt += `${commentators[0]}`
    // }
    // else {
    //     title = 'Комментаторы матча'
    //     txt += `${commentators[0]} и ${commentators[1]}`
    // }

    // let dta = {
    //     type: 'couch',
    //     size : 'b',
    //     text: txt,
    //     title: title,
    // }
    // socket.emit('notify', dta)
    
})