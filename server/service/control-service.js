const Match = require('../models/match-model');
const Player = require('../models/player-model');
const getBrightness = require('getbrightness')
const timestore = require('timestore')
let timers = new timestore.Timestore()
function startTimer(io, timer, userId) {
    
    let timerId = timers.setInterval(userId, timerCallback, 1000)
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
        timer.send(io, userId)
        //timer.toRoom('new_data', {name: 'timer', value: `${this.minuts}:${this.seconds}`})
    }
    return userId.toString()
}

function pauseTimer(timer) {
    timers.toggleInterval(timer.timerId)
}
function deleteTimer(timer) {
    timers.clearInterval(timer.timerId)
    timer.timerId = null
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
        deleteTimer(this)
        this.minuts = 0
        this.seconds = 0
    }
    changeTimer(sec) {
        sec = +sec
        this.seconds += sec
    }
    reverse(type) {
        this.is_reverse = type
    }
    set changeStage(stages) {
        this.now_time = stages.now_time ? stages.now_time : this.now_time
        this.now_penalty = stages.now_penalty ? stages.now_penalty : this.now_penalty
    }

    playTimer(io, userId) {
        console.log(this)
        if(!this.timerId)
            this.timerId = startTimer(io, this, userId)
        else 
            pauseTimer(this)

        
    }
    // startTimer(socket) {
    //     this.is_null_start = false
    //     this.playTimer(socket)
    // }
    get timeData() {
        console.log(this.seconds)
        this.seconds = +this.seconds
        this.minuts = +this.minuts
        if(this.seconds < 0) {
            console.log(Math.floor(this.seconds / 60))
            this.minuts += Math.floor(this.seconds / 60)
            this.seconds = Math.abs(60*(Math.floor(this.seconds / 60)) - this.seconds)
        }
        if(this.seconds > 59) {
            this.minuts += Math.floor(this.seconds / 60)
            this.seconds = this.seconds % 60
        }
        if(this.minuts < 0) {
            this.minuts = 0
            this.seconds = 0
        }
        if(this.minuts >= this.max_time) {
            this.minuts = this.max_time
            this.seconds = 0
        }
        let min = this.minuts < 10 ? `0${this.minuts}` : this.minuts
        let sec = this.seconds < 10 ? `0${this.seconds}` : this.seconds
        return {name: 'timer', value: `${min}:${sec}`}
    }
    send(io, userId) {
        io.to(userId).emit('timer', this.timeData)
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
        this.penalty = [{
            team1: '',
            team2: '',
        }]
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
        this.penalty = score.penalty ? score.penalty : this.penalty
        this.team1_font_color = getBrightness(this.team1_color) > 0.5 ? 'black' : 'white'
        this.team2_font_color = getBrightness(this.team2_color) > 0.5 ? 'black' : 'white'
    }
    
}
class Tablo {
    // type = little | mid | big  | wheater | penalty | off
    constructor() {
        this.type = 'little'
    }
}
class Control {

    constructor(userId, style) {
        this.team1_name = 'Команда 1'
        this.team2_name = 'Команда 2'
        this.userId = userId
        this.match = null
        this.timer = new Timer()
        this.scoreboard = new Scoreboard()
        this.tablo = new Tablo()
        this.style = style
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
