const { application } = require('express');
const {Schema, model} = require('mongoose');
const Stage = require('./stage-model');
const { configDotenv } = require('dotenv');
const judge = require('../controllers/api/judge');
const commentator = require('../controllers/api/commentator');
const seasonModel = require('./season-model');
const Tournament = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    admins: [{type: Schema.Types.ObjectId, ref: 'User', autopopulate: true}],
    teams: [{type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true}],
    judges: [{type: Schema.Types.ObjectId, ref: 'Judge', autopopulate: true}],
    commentators: [{type: Schema.Types.ObjectId, ref: 'Commentator', autopopulate: true}],
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},
    basic: {
        season: {type: Schema.Types.ObjectId, ref: 'Season', autopopulate: true},
        img: {type: String, default: ''},
        full_name: {type: String},
        name: {type: String},
        tables_grids: {type: String},
        rank: {type: String},
        description: {type: String},
        date_start: {type: String},
        date_end: {type: String},
        type: {type: String},
        is_site: {type: Boolean, default: false},
        is_calendar: {type: Boolean, default: false},
        is_menu: {type: Boolean, default: false},
        is_slider_main: {type: Boolean, default: false},
        is_display_table_main: {type: Boolean, default: false},
        is_league_info: {type: Boolean, default: false},
    },

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
        start_date: {type: String},
        end_date: {type: String},
        min_players: {type: Number, default: 0},
        max_players: {type: Number, default: 50},
        fee_type: {type: String, enum: ['none', 'team', 'personal', 'application'], default: 'none'},
        transfers_enable: {type: Boolean, default: true},
        application_multiple_enable: {type: Boolean, default: false},
    },
    visual : {
        starting_page: {type: String, default: 'about'},
        calendar: {type: String, default: 'dates'},
        color: {type: String, default: '#000000'},
        is_info_preview: {type: Boolean, default: false},
        is_white_header: {type: Boolean, default: false},
        is_black_font: {type: Boolean, default: false},
        is_shadow_header: {type: Boolean, default: false},
        is_manual_cover: {type: Boolean, default: false},
        img: {type: String, default: ''},
        img_mobile: {type: String, default: ''},
        is_global_stats: {type: Boolean, default: false},
        stats_type: {type: String, default: 'all'},
        is_display_all_stages: {type: Boolean, default: false},
        before_start_type: {type: String, default: 'none'},
        after_start_type: {type: String, default: 'none'},
        application_type: {type: String, default: 'none'},
    },
    tags: {
        tag_name: {type: String},
        full_tag_name: {type: String},
    }
})

// for(var p in Tournament.paths){
//     Tournament.path(p).required(true);
//   }
Tournament.statics.createGroup = async function (data) {
    let tournament = this.findOne({_id: data.tournament});
    console.log(tournament, data);
    let group = new Stage(data);
    return group.save();
}
Tournament.statics.deleteTeam = async function (teamId) {
    await this.updateMany({teams: teamId}, {$pull: {teams: teamId}});
}
Tournament.methods.getGroups = async function () {
    let groups = await Stage.find({tournament: this._id});
    return groups;
}
Tournament.statics.updateGroup = async function (data) {
    
}
Tournament.plugin(require('mongoose-autopopulate'));

module.exports = model('Tournament', Tournament);
