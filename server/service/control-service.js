const Match = require('../models/match-model');
class Timer {
    constructor() {
        this.timerId = null
        this.minuts = 30
        this.seconds = 0
        this.is_reverse = false
        this.now_time = 0
        this.now_penalty = 0
        this.max_time = 20
        this.is_not_display = false
        this.is_null_start = false
    }
    clearTimer() {
        clearInterval(this.timerId)
    }
    reverse(type) {
        this.is_reverse = type
    }
    set changeTimer(time) {
        this.minuts = time.minuts
        this.seconds = time.seconds
    }
    set changeStage(stages) {
        this.now_time = stages.now_time ? stages.now_time : this.now_time
        this.now_penalty = stages.now_penalty ? stages.now_penalty : this.now_penalty
    }
    get getTime() {
        let time = `${this.minuts}:${this.seconds}`
        let data = {
            name: 'timer',
            value: time
        }
        socket.emit('new_data', data)
    }
    startTimer() {
        console.log('asasas')
        this.timerId = setInterval(() => {
            if(this.is_reverse){
                this.seconds--
                if(this.seconds == -1){
                    this.minuts--
                    this.seconds = 59
                }
                if(this.minuts <= 0) {
                    this.clearTimer()
                }
            }
            else{
                this.seconds++
                if(this.seconds == 60){
                    this.minuts++
                    this.seconds = 0
                }
                if(this.minuts >= this.max_time) {
                    this.clearTimer()
                }
            }

            this.sendTime()
        }, 1000)
        
    }
}
class Scoreboard {

    constructor() {
        this.team1 = 0
        this.team2 = 0
        this.team1_foll = 0
        this.team2_foll = 0
        this.team1_color = 'red'
        this.team2_color = 'blue'
        this.team1_penalty = ''
        this.team2_penalty = ''
    }

    set changeScore(score) {
        this.team1 = score.team1 ? score.team1 : this.team1
        this.team2 = score.team2 ? score.team2 : this.team2
        this.team1_foll = score.team1_foll ? score.team1_foll : this.team1_foll
        this.team2_foll = score.team2_foll ? score.team2_foll : this.team2_foll
        this.team1_color = score.team1_color ? score.team1_color : this.team1_color
        this.team2_color = score.team2_color ? score.team2_color : this.team2_color
        this.team1_penalty = score.team1_penalty ? score.team1_penalty : this.team1_penalty
        this.team2_penalty = score.team2_penalty ? score.team2_penalty : this.team2_penalty
    }
}
class Tablo {
    // type = mid | bif | match | wheater | penalty | off
    constructor() {
        this.type = 'mid'
    }
}
class Control {

    constructor(userId) {
        this.team1_name = 'Команда 1'
        this.team2_name = 'Команда 2'
        this.userId = userId
        this.match = null
        this.timer = new Timer()
        this.scoreBoard = new Scoreboard()
        this.tablo = new Tablo()
    }
    set setMatch(match) {
        this.match = match
        this.team1_name = match.team_1.name
        this.team2_name = match.team_2.name
    }
    setData(data) {
        console.log(data)
        for(let key in data) {
            console.log(key)
            switch(key) {
                case 'time':
                    this.timer.changeTimer(data[key])
                    break
                case 'stage':
                    this.timer.changeStage(data[key])
                    break
                case 'match':
                    this.setMatch = data[key]
                    break
                case 'tablo':
                    this.tablo.type = data[key]
                    break
                case 'score':
                    this.scoreBoard.changeScore(data[key])
                    break
                case 'team1_name':
                    this.team1_name = data[key]
                    break
                case 'team2_name':
                    this.team2_name = data[key]
                    break   
            }
        }
        return this
    }

    get getData() {
        return this
    }
}

module.exports = Control;
