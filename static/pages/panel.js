socket.emit('join_panel');

let inputs = getA('.standart_input');

inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let data = {
            name: e.target.name,
            value: e.target.value
        }
        socket.emit('new_data', data)
    })
})
let inputsChange = getA('.change_input');
inputsChange.forEach(input => {
    input.addEventListener('change', (e) => {
        let data = {
            name: e.target.name,
            value: e.target.value
        }
        socket.emit('new_data', data)
    })
})
let startTimerBtn = get('#start_timer');
let timerInput = get('#timer');
let timer
let minuts = 0, seconds = 0
startTimerBtn.addEventListener('click', (e) => {
    timer = setInterval(() => {
        seconds++
        if (seconds == 60) {
            minuts++
            seconds = 0
        }
        let time = `${minuts}:${seconds}`
        let data = {
            name: 'timer',
            value: time
        }
        timerInput.value = time
        socket.emit('new_data', data)
    }, 1000)
})