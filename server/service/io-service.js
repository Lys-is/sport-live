const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
const Player = require('../models/player-model');
const Couch = require('../models/couch-model');
const Commentator = require('../models/commentator-model');
const Judge = require('../models/judge-model');
const Tournament = require('../models/tournament-model');
const League = require('../models/league-model');
const controlService = require('./control-service');
let io = null
let controls = {}
class IoService {
    constructor() {
    }
    sendToRoom(room, emit, data){
        io.to(room).emit(emit, data)
    }
    start(serv){
        console.log('11111')
        io = socketIO(serv);
        io.on('connection', async (socket)=>{
            try {
              function parseCookies () {
                var list = {},
                    rc = socket.request.headers.cookie;
                rc && rc.split(';').forEach(function( cookie ) {
                    var parts = cookie.split('=');
                    list[parts.shift().trim()] = unescape(parts.join('='));
                });
                return list;
              }
              var cookies = parseCookies();
              const userToken = await tokenService.validateRefreshToken(cookies['refreshToken'])
              let user
              //console.log(socket.request)
              // if(userToken)
              //   user = await User.findOne({_id: userToken.id})

              // if (!user) {
              //   console.log('no user')
              //   socket.user = false
              //   startPanel(controls, socket)
              // }
              // else{
              //   socket.user = user
              //   console.log(socket.user._id.toString())
              //   socket.join(socket.user._id.toString())
              //   startPanel(controls, socket)

              // }
              startPanel(controls, socket)
            }
            catch(e){
              socket.user = false
              console.log(e)
            }
            if(socket.user){
            }
            
            socket.on('message', async (txt)=>{
              try{
                if(!socket.user)
                  throw "reg_err"
                

              }
              catch(e){
                console.log(e)
              }
            })
          })
    }
    
}


function startPanel(controls, socket) {
  let userId
  let control
  if(socket.user){
    userId = socket.user._id.toString()
    control = controls[userId] || new controlService(userId, socket.user.tablo_style, io);
    controls[userId] = control;
  }
  
  

  socket.join(userId);

  socket.on('join_panel', async (tableId) => {
    try {
      
      userId = tableId
      if(!socket.user)
        socket.user = await User.findOne({ _id: tableId.split('_')[0] });
      control = controls[userId] || new controlService(userId, socket.user.tablo_style, io);
      controls[userId] = control;
      socket.join(userId);
      let dd = control.getDataAll
      dd.cached = true
      socket.emit('update_data', dd);
    } catch (e) {
      console.log(e)
    }
  });

  socket.on('join_table', async (tableId) => {
    try {

      userId = tableId
      if(!socket.user)
        socket.user = await User.findOne({ _id: tableId.split('_')[0] });
      control = controls[userId] || new controlService(userId, socket.user.tablo_style, io);
      controls[userId] = control;
      const user = await User.findOne({ _id: tableId.split('_')[0] });
      socket.join(tableId);
      let dd = control.getDataAll
      dd.cached = true
      socket.emit('start', dd);
    } catch (e) {
      console.log(e)
    }
  });

  socket.on('play_timer', () => {
    try {

      control.timer.playTimer(io, userId);
      io.to(userId).emit('timer', control.timer.timeData);
    // io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }

  });

  socket.on('clear_timer', () => {
    try {

      control.timer.clearTimer();
      io.to(userId).emit('timer', control.timer.timeData);
    } catch (e) {
      console.log(e)
    }
  });

  socket.on('change_timer', (val) => {
    try {

      control.timer.changeTimer(val);
      io.to(userId).emit('timer', control.timer.timeData);
    } catch (e) {
      console.log(e)
    }
  });

  socket.on('match', async (data) => {
    try {
      await control.setMatch(data);
      console.log('ddddd22222')
      let dd = control.getDataAll
      dd.cached = true
      io.to(userId).emit('update_data', dd);
      getTourImgs()
    } catch (e) {
      console.log(e)
    }
  });
  socket.on('get_tour_img', async () => {
    try {
      getTourImgs()
    } catch (e) {
      console.log(e)
    }
  });
  socket.on('get_comm_judge_img', async () => {
    try {
      let data = {}
      data.commentators = await Commentator.find({creator: userId}) || [];
      data.judges = await Judge.find({creator: userId}) || [];
      
      io.to(userId).emit('comm_judge_img', data);
    } catch (e) {
      console.log(e)
    }
  })
  async function getTourImgs(){
    console.log(control)
    if(!control) return
    let tourImgs = {}
    let league = await League.findOne({creator: userId.split('_')[0]});
      if(league && league.img){
        tourImgs.league_img = league.img
      }
      if(control.match?.tournament && control.match?.tournament.basic.img){
        tourImgs.tour_img = control.match.tournament.basic.img
      }
      io.to(userId).emit('tour_img', tourImgs);
  }
  socket.on('reset_score', async (data) => {
    try {
      await control.resetScore();
      io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }
  })
  socket.on('reload_all', async (data) => {
    try {

      io.to(userId).emit('reload');
    } catch (e) {
      console.log(e)
    }
  })
  socket.on('reset_all', async (data) => {
    try {

      await control.resetAll();
      delete controls[userId]
      io.to(userId).emit('reload');
    } catch (e) {
      console.log(e)
    }
  })
  socket.on('set_timer', async (data) => {
    try {

      await control.timer.setTime(data);
      io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }
  });
  socket.on('style', async (data) => {
      try{
    
      control.style = data.style;
      if(socket.user){
        socket.user.tablo_style = data.style;
       await socket.user.save();
      }
      
      io.to(userId).emit('update_style');
      io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }
  });

  socket.on('notify', async (data) => {
    try {

    //await replaceImg(data);
    console.log(data)
    await io.to(userId).emit('new_notify', data);
  } catch (e) {
    console.log(e)
  }
  });

  socket.on('new_data', (data) => {
    try {
      control.setData(data);
      console.log(control.getData)
      io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }
  });
  socket.on('get_data', () => {
    try {
      io.to(userId).emit('update_data', control.getData);
    } catch (e) {
      console.log(e)
    }
  });
  socket.on('get_time', () => {
    try {
      io.to(userId).emit('timer', control.timer.timeData);
    } catch (e) {
      console.log(e)
    }
  });
}

async function replaceImg(data) {
  try {
    data.imgArr = [];
    await Promise.all(data.ids.map(async (id, i) => {
      const model = { Player, Couch, Commentator, Judge }[data.model];
      const type = data.model.toLowerCase();
      const dta = await model.findOne({ _id: id }).select('img');
      if (dta.img) {
        console.log('dta.img')
        data.imgArr.push(dta.img);
      } else {
        console.log('!dta.img', i)
      }
    }));
    console.log(data)
    return data;
  } catch (error) {
    console.log(error)
  }
  
}
 module.exports = new IoService();