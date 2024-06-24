// class Timer {
//     constructor() {
//         this.timer = null
//         this.minuts = 30
//         this.seconds = 0
//         this.is_reverse = true
//     }

//     reverse() {
//         this.is_reverse = !this.is_reverse
//     }
//     sendTime() {
//         let time = `${this.minuts}:${this.seconds}`
//         let data = {
//             name: 'timer',
//             value: time
//         }
//         socket.emit('new_data', data)
//     }
//     startTimer() {
//         console.log('asasas')
//         this.timer = setInterval(() => {
//             if(this.is_reverse){
//                 this.seconds--
//                 if(this.seconds == -1){
//                     this.minuts--
//                     this.seconds = 59
//                 }

//             }
//             else{
//                 this.seconds++
//                 if(this.seconds == 60){
//                     this.minuts++
//                     this.seconds = 0
//                 }
//             }

//             this.sendTime()
//         }, 1000)
        
//     }
// }




// let inputs = getA('.standart_input');

// inputs.forEach(input => {
//     input.addEventListener('input', (e) => {
//         let data = {
//             name: e.target.name,
//             value: e.target.value
//         }
//         socket.emit('new_data', data)
//     })
// })
// let inputsChange = getA('.change_input');
// inputsChange.forEach(input => {
//     input.addEventListener('change', (e) => {
//         let data = {
//             name: e.target.name,
//             value: e.target.value
//         }
//         socket.emit('new_data', data)
//     })
// })


// let startTimerBtn = get('#start_timer');
// let timerInput = get('#timer');
// let timer = new Timer();
// let minuts = 0, seconds = 0
// startTimerBtn.addEventListener('click', (e) => {
//     timer.startTimer()
// })
let table_1 = get('#table_team_1'),
    table_2 = get('#table_team_2');
let play = get('#play');
play.addEventListener('click', (e) => {
    socket.emit('play_timer');
})
let match = get('#match');
match.addEventListener('change', (e) => {
    socket.emit('match', e.target.value);
})
socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('join_panel');
});
socket.on('update_data', (data) => {
    console.log(data)
    let tableHTML = `<tbody>
                    <tr>
                        <th>имя</th>
                        <th>мал</th>
                        <th>бол</th>
                        <th>мал</th>
                        <th>бол</th>
                        <th>мал</th>
                        <th>бол</th>
                    </tr>`;
    let playerHTML = `<tr data-id="{{id}}" data-name="{{name}}">
                        <td>{{name}}</td>
                        <td><input type="button" value="1" class="square30" data-type="goal_s" name="pers1_1"></td>
                        <td><input type="button" value="1" class="square30" data-type="goal_b" name="pers1_2"></td>
                        <td><input type="button" value="1" class="square30 yellow" data-type="yellow_s" name="pers1_3"></td>
                        <td><input type="button" value="1" class="square30 yellow" data-type="yellow_b" name="pers1_4"></td>
                        <td><input type="button" value="1" class="square30 red" data-type="red_s" name="pers1_5"></td>
                        <td><input type="button" value="1" class="square30 red" data-type="red_b" name="pers1_6"></td>
                    </tr>`;
    if(data.match) {
        table_1.innerHTML = tableHTML
        table_2.innerHTML = tableHTML
        console.log(getA('.data_team_1'))
        getA('.data_team_1').forEach(el => {
            console.log(el)
            if(el.localName == 'input')
                el.setAttribute('readonly', true)
            else
                el.innerHTML = data.match.team_1.name
        })
        getA('.data_team_2').forEach(el => {
            if(el.localName == 'input')
                el.setAttribute('readonly', true)
            else
                el.innerHTML = data.match.team_2.name
        })

        data.players_1.forEach(player => {
            table_1.innerHTML += playerHTML.replace('{{id}}', player._id).replaceAll('{{name}}', player.fio)
        })
        table_1.innerHTML += '</tbody>'

        data.players_2.forEach(player => {
            table_2.innerHTML += playerHTML.replace('{{id}}', player._id).replaceAll('{{name}}', player.fio)
        })
        table_2.innerHTML += '</tbody>'

        getA('.square30').forEach(el => {
            el.addEventListener('click', playerNotifyListener)
        })

    }
})
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