const Match = require('../models/match-model');
const Player = require('../models/player-model');
const PlayerResult = require('../models/playerResult-model');
const Couch = require('../models/couch-model');
const getBrightness = require('getbrightness')
const timestore = require('timestore')
let timers = new timestore.Timestore()
function startTimer(io, timer, userId) {
    // if(timer.scenarios == '2')
    //     timer.minuts = timer.max_time
    let timerId = timers.setInterval(userId, timerCallback, 1000)
    console.log(timerId)
    function timerCallback() {
        if(timer.is_reverse){
            timer.seconds--
            // if(timer.seconds == -1){
            //     timer.minuts--
            //     timer.seconds = 59
            // }
            // if(timer.minuts <= 0) {
            //     timer.clearTimer()
            // }
            // if(timer.scenarios == '1'){
            //     if(timer.minuts <  timer.max_time || timer.minuts == timer.max_time && timer.seconds <= 0) {
            //         timer.changeScenarios('pause')
            //     }
            // }
            // else if(timer.scenarios == '2'){
            //     if(timer.minuts <= 0 && timer.seconds <= 0) {
            //         timer.changeScenarios('end')
            //     }
            // }
        }
        else{
            timer.seconds++
            if(timer.seconds == 60){
                timer.minuts++
                timer.seconds = 0
            }
            // if(timer.scenarios == '1'){
            //     if(timer.minuts >= timer.max_time) {
            //         timer.changeScenarios('pause')
            //     }
            // }
            // else if(timer.scenarios == '2'){
            //     console.log(timer.minuts, timer.max_time * 2)
            //     if(timer.minuts >= timer.max_time * 2) {
            //         timer.changeScenarios('end')
            //     }
            // }
        }
        timer.send(io, userId)
        //timer.toRoom('new_data', {name: 'timer', value: `${this.minuts}:${this.seconds}`})
    }
    return userId.toString()
}
function pauseTimer(timerId) {
    if(timerId)
        timers.pauseInterval(timerId)
}
function resumeTimer(timerId) {
    if(timerId)
        timers.resumeInterval(timerId)
}
function toggleTimer(timer) {
    if(timer.status == 'pause') {
        timer.status = 'play'
        resumeTimer(timer.timerId)
    }
    else if(timer.status == 'play') {
        timer.status = 'pause'
        pauseTimer(timer.timerId)
    }
}
function deleteTimer(timer) {
    if(timer.timerId)
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
        this.status = 'stop'
        this.name = 'Начало матча'
        this.scenarios = 'begin'
        this.changed = false

    }
    clearTimer() {
        deleteTimer(this)

        this.minuts = 0
        this.seconds = 0
        this.status = 'stop'

    }
    changeTimer(sec) {
        sec = +sec
        this.seconds += sec
    }
    setTime(data) {
        let [min, sec] = data.split(':')
        this.minuts = +min
        this.seconds = +sec
    }
    reverse(type) {
        this.is_reverse = type
        // if(this.status == 'stop') {
        //     this.clearTimer()
        // }
        // if(this.scenarios != '1' && this.scenarios != '2') 
        //     this.changeScenarios(this.scenarios)
    }
    set changeStage(stages) {
        this.now_time = stages.now_time ? stages.now_time : this.now_time
        this.now_penalty = stages.now_penalty ? stages.now_penalty : this.now_penalty
    }
    changeScenarios(scenarios) {
        //this.clearTimer()
        this.changed = true
        this.scenarios = scenarios
        if(scenarios == 'begin') {
            this.name = 'Начало матча'
        }
        else if(scenarios == '1') {
            this.name = '1Т'
        }
        else if(scenarios == 'VAR') {
            this.name = 'VAR'
        }
        else if(scenarios == 'out') {
            this.name = 'out'
        }
        else if(scenarios == 'pause') {
            this.name = 'Перерыв'
            //this.minuts = this.max_time
        }
        else if(scenarios == '2') {
            this.name = '2Т'
            //this.minuts = this.max_time
        }
        else if(scenarios == 'end') {
            this.name = 'Конец матча'
            //this.status = 'stop'
            //this.minuts = this.is_reverse ? 0 : this.max_time * 2
        }
    }
    playTimer(io, userId) {
        //if(this.scenarios == 'begin' || this.scenarios == 'pause') {
            let nextScenarios = this.scenarios == 'begin' ? '1' : '2'
            //this.changeScenarios(nextScenarios)
            
            console.log(this)
            if(!this.timerId){
                this.timerId = startTimer(io, this, userId)
                this.status = 'play'
            }
            else 
                toggleTimer(this)

       // }
        // else if(this.scenarios != 'end') {
        //     if(!this.timerId){
        //         this.timerId = startTimer(io, this, userId)
        //         this.status = 'play'
        //     }
        //     else 
        //         toggleTimer(this)
        // }
    }
    // startTimer(socket) {
    //     this.is_null_start = false
    //     this.playTimer(socket)
    // }
    get timeData() {
        let changed = this.changed
        this.changed = false
        this.seconds = +this.seconds
        this.minuts = +this.minuts
        let maxTime = this.max_time
        if(this.seconds < 0) {
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
        if(this.scenarios == '2'){
            maxTime = this.max_time * 2
        }
        if(this.minuts >= this.maxTime) {
            this.minuts = this.maxTime
            this.seconds = 0
        }
        let min = this.minuts < 10 ? `0${this.minuts}` : this.minuts
        let sec = this.seconds < 10 ? `0${this.seconds}` : this.seconds
        return {name: 'timer', value: `${min}:${sec}`, status: this.status, changed: changed, scenarios: this.scenarios, is_reverse: this.is_reverse}
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
        this.penalty = Array(5).fill({
            team1: '',
            team2: '',
        })
        this.team1_font_color = 'white'
        this.team2_font_color = 'white'
    }

    changeScore(score) {

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

    constructor(userId, style, io) {
        this.team1_name = 'Хозяева'
        this.team2_name = 'Гости'
        this.userId = userId
        this.match = null
        this.timer = new Timer()
        this.scoreboard = new Scoreboard()
        this.tablo = new Tablo()
        this.style = style || 'style_1'
        this.is_fouls = false
        this.notif_type = 'circ'
    }
    async setMatch(matchId) {
        if(!matchId) return
        console.log(matchId)

        let match = await Match.findOne({_id: matchId})

        let activePlayers = await PlayerResult.find({match: matchId, is_active: true}).select('player team')
        console.log(activePlayers)
        let players_1 = activePlayers.filter(el => el.team._id.toString() == match.team_1._id.toString()).map(el => ({fio: el.player.fio, _id: el.player._id, img: el.player.img})), //await Player.find({team: match.team_1._id}).select('fio _id img'),
            players_2 = activePlayers.filter(el => el.team._id.toString() == match.team_2._id.toString()).map(el => ({fio: el.player.fio, _id: el.player._id, img: el.player.img})),//await Player.find({team: match.team_2._id}).select('fio _id img'),
            couch_1 = await Couch.find({team: match.team_1._id}).select('fio _id img'),
            couch_2 = await Couch.find({team: match.team_2._id}).select('fio _id img')
            console.log(players_1, players_2)
        this.match = match
        this.team1_name = match.team_1.name
        this.team2_name = match.team_2.name
        this.players_1 = players_1
        this.players_2 = players_2 
        this.scoreboard.changeScore({team1_color: match.team_1.color, team2_color: match.team_2.color})
        this.couch_1 = couch_1
        this.couch_2 = couch_2
    }
    resetScore() {
        this.scoreboard.changeScore({team1: 0, team2: 0, team1_foll: 0, team2_foll: 0})
    }

    setData(data) {
        console.log(data)
        for(let key in data) {
            console.log(key)
            switch(key) {
                case 'time':
                    this.timer.changeTimer(data[key])
                    break
                case 'max_time':
                    this.timer.max_time = data[key]
                    break
                case 'scenarios':
                    this.timer.changeScenarios(data[key])
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
                case 'team1_name':
                    this.team1_name = data[key]
                    console.log(this)
                    break
                case 'team2_name':
                    this.team2_name = data[key]
                    break
                case 'is_fouls':
                    this.is_fouls = data[key]
                    break
                case 'is_reverse':
                    this.timer.reverse(data[key])
                    break
                case 'notif_type':
                    this.notif_type = data[key]
                    break
            }
        }
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
