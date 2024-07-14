const {Schema, model, overwriteMiddlewareResult} = require('mongoose');
const Player = require('./player-model');
const PlayerResult = require('./playerResult-model');


const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    date: {type: String, required: true},
    time: {type: String, default: '00:00'},
    is_overtime: {type: Boolean, default: false},
    is_penalty: {type: Boolean, default: false},
    is_tech_win: {type: Boolean, default: false},
    team_1: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    team_2: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},

    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', autopopulate: true},
    team_1_score: {type: Number, default: 0},
    team_2_score: {type: Number, default: 0},
    status: {type: String, default: 'Не начат'},
    judges: [{type: Schema.Types.ObjectId, ref: 'Judge', autopopulate: true}],
    commentators: [{type: Schema.Types.ObjectId, ref: 'Commentator', autopopulate: true}],
    results_1: [{type: Schema.Types.ObjectId, ref: 'PlayerResult', autopopulate: true}],
    results_2: [{type: Schema.Types.ObjectId, ref: 'PlayerResult', autopopulate: true}],
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},
    circle: {type: Number, default: 1},

})
MatchSchema.methods.deleteResults = async function() {
    await PlayerResult.deleteMany({match: this._id})
    this.results_1 = []
    this.results_2 = []
    this.save()
}
MatchSchema.methods.setPlayerResults = async function(results) {

    if(results){
        this.results_1.forEach(async (el, i) => {
            console.log(el, results.team_1[i])
            for(let key in results.team_1[i]) {
                el[key] = results.team_1[i][key]
            }
            await el.save()
        })
        this.results_2.forEach(async(el, i) => {
            for(let key in results.team_2[i]) {
                el[key] = results.team_2[i][key]
            }
            await el.save()
        })
        console.log(this.results_1)
        console.log(this.results_2)

    }
    else {
        let players = await Player.find({team: this.team_1})
        
        for(let player of players) {
            
            this.results_1.push(await PlayerResult.create({
                creator: this.creator,
                match: this._id,
                player: player._id,
                player_fio: player.fio,
                team: this.team_1._id
            }))
        }

        players = await Player.find({team: this.team_2})
        for(let player of players) {
            this.results_2.push(await PlayerResult.create({
                creator: this.creator,
                match: this._id,
                player: player._id,
                player_fio: player.fio,
                team: this.team_2._id
            }))
        }   
    }
    this.save()
}
MatchSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Match', MatchSchema);
