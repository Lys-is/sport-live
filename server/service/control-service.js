const Match = require('../models/match-model');
const Player = require('../models/player-model');
const getBrightness = require('getbrightness')
const timestore = require('timestore')

let timers = new timestore.Timestore()

function startTimer(socket, timer, userId) {
    let time = `${timer.minuts}:${timer.seconds}`
    let timerId = timers.setInterval(userId.toString(), timerCallback, 1000)
    console.log(timerId)
    function timerCallback() {
        if(timer.is_reverse){
            timer.seconds--
            if(timer.seconds == -1){
                timer.minuts--
                timer.seconds = 59
            }
            if(timer.minuts <= 0) {
                timer.clearTimer()
            }
        }
        else{
            timer.seconds++
            if(timer.seconds == 60){
                timer.minuts++
                timer.seconds = 0
            }
            if(timer.minuts >= timer.max_time) {
                timer.clearTimer()
            }
        }
        timer.send(socket)
        //timer.toRoom('new_data', {name: 'timer', value: `${this.minuts}:${this.seconds}`})
    }
    return userId.toString()
}

function pauseTimer(timer) {
    timers.clearInterval(timer.timerId)
}

class Timer {
    constructor() {
        this.timerId = null
        this.minuts = 0
        this.seconds = 0
        this.is_reverse = false
        this.now_time = 0
        this.now_penalty = 0
        this.max_time = 20
        this.is_not_display = false
        this.is_null_start = false
    }
    clearTimer() {
        pauseTimer(this)
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
    playTimer(socket, userId) {
        console.log(this)
        this.timerId = startTimer(socket, this, userId)
        
    }
    // startTimer(socket) {
    //     this.is_null_start = false
    //     this.playTimer(socket)
    // }
    send(socket){
        socket.to(socket.user._id.toString()).emit('timer', {name: 'timer', value: `${this.minuts}:${this.seconds}`})
    }
}
class Scoreboard {

    constructor() {
        this.team1 = 0
        this.team2 = 0
        this.team1_foll = 0
        this.team2_foll = 0
        this.team1_color = '#fb7528'
        this.team2_color = '#2525cb'
        this.team1_penalty = ''
        this.team2_penalty = ''
        this.team1_font_color = 'white'
        this.team2_font_color = 'white'
    }

    changeScore(score) {
        console.log(score)
        console.log(this.team2_color)
        console.log(getBrightness(this.team2_color))
        this.team1 = score.team1 ? score.team1 : this.team1
        this.team2 = score.team2 ? score.team2 : this.team2
        this.team1_foll = score.team1_foll ? score.team1_foll : this.team1_foll
        this.team2_foll = score.team2_foll ? score.team2_foll : this.team2_foll
        this.team1_color = score.team1_color ? score.team1_color : this.team1_color
        this.team2_color = score.team2_color ? score.team2_color : this.team2_color
        this.team1_penalty = score.team1_penalty ? score.team1_penalty : this.team1_penalty
        this.team2_penalty = score.team2_penalty ? score.team2_penalty : this.team2_penalty
        this.team1_font_color = getBrightness(this.team1_color) > 0.5 ? 'black' : 'white'
        this.team2_font_color = getBrightness(this.team2_color) > 0.5 ? 'black' : 'white'
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
        this.scoreboard = new Scoreboard()
        //this.tablo = new Tablo()
    }
    async setMatch(matchId) {
        console.log(matchId)
        let match = await Match.findOne({_id: matchId})
        let players_1 = await Player.find({team: match.team_1._id}),
            players_2 = await Player.find({team: match.team_2._id})
        this.match = match
        this.team1_name = match.team_1.name
        this.team2_name = match.team_2.name
        this.players_1 = players_1
        this.players_2 = players_2
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
                case 'tablo':
                    this.tablo.type = data[key]
                    break
                case 'score':
                    this.scoreboard.changeScore(data[key])
                    break
                case 'team1':
                    this.team1_name = data[key]
                    break
                case 'team2':
                    this.team2_name = data[key]
                    break
                
            }
        }
        return this
    }

    get getData() {
        let data = {}
        function recurse(data, obj) {
            console.log(data)
            for(let key in obj) {
                console.log(key)
                if(typeof obj[key] !== 'function') {
                    data[key] = obj[key]
                }
                else if(typeof obj[key] === 'object') {
                    recurse(data[key], obj[key])
                }
            }
        }
        try {
            //recurse(data, this)
        } catch (error) {
            console.log(error)
        }
        //recurse(data, this)
        return JSON.parse(JSON.stringify(this))
    }
}

module.exports = Control;
