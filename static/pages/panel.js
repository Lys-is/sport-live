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


socket.emit('join_panel');
let inputs = getA('.standart_input');
console.log(inputs)

inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let data = {}
            let name = e.target.name,
            value = e.target.value
            data[name] = value
            socket.emit('new_data', data)
        })

})
function sendTime() {
    let time = `${minuts}:${seconds}`
    let data = {
        name: 'timer',
        value: time
    }
    socket.emit('new_data', data)
}