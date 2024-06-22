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
// let play = get('#play');
// play.addEventListener('click', (e) => {
//     socket.emit('play_timer');
// })

socket.emit('join_panel');
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