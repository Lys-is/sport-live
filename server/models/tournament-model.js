const { application } = require('express');
const {Schema, model} = require('mongoose');

const Tournament = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    admins: [{type: Schema.Types.ObjectId, ref: 'User', autopopulate: true}],
    full_name: {type: String, unique: true},
    name: {type: String, unique: true},
    description: {type: String},
    date_start: {type: Date},
    date_end: {type: Date},
    type: {type: String},
    is_site: {type: Boolean, default: false},
    is_calendar: {type: Boolean, default: false},
    reglament: {
        tie_enable: {type: Boolean, default: true},
        for_win: {type: Number, default: 3},
        for_lose: {type: Number, default: 0},
        for_overtime_win: {type: Number, default: 3},
        for_overtime_lose: {type: Number, default: 0},
        for_penalty_win: {type: Number, default: 3},
        for_penalty_lose: {type: Number, default: 0},
        for_tie: {type: Number, default: 1},
        period_count: {type: Number, default: 2},
        period_count_overtime: {type: Number, default: 2},
        overtime_duration: {type: Number, default: 10},
        match_duration: {type: Number, default: 90},
        goal_technical_lose_enable: {type: Boolean, default: true},
        deadline_for_application: {type: Number, default: 5},
        max_players: {type: Number, default: 16},
        max_players_reserve: {type: Number, default: 10},
        reserve_match_to_count_enable: {type: Boolean, default: true},
        dq_enable: {type: Boolean, default: false},
    },
    application_campaign : {
        date_start: {type: Date, default: () => Date.now()},
        date_end: {type: Date,default: () => Date.now()+ 1000*60*60*24*30},
        min_players: {type: Number, default: 0},
        max_players: {type: Number, default: 50},
        contribution_type: {type: String, enum: ['none', 'team', 'personal', 'application'], default: 'none'},
        transfers_enable: {type: Boolean, default: true},
        application_multiple_enable: {type: Boolean, default: false},
    }
})
for(var p in Tournament.paths){
    Tournament.path(p).required(true);
  }
Tournament.plugin(require('mongoose-autopopulate'));

module.exports = model('Tournament', Tournament);
