const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
const Player = require('../models/player-model');
const Couch = require('../models/couch-model');
const Commentator = require('../models/commentator-model');
const Judge = require('../models/judge-model');
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
              console.log(socket.request)
              if(userToken)
                user = await User.findOne({_id: userToken.id})

              if (!user) {
                console.log('no user')
                socket.user = false
                startPanel(controls, socket)
              }
              else{
                socket.user = user
                console.log(socket.user._id.toString())
                socket.join(socket.user._id.toString())
                startPanel(controls, socket)

              }
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
    userId = tableId
    control = controls[userId] || new controlService(userId, socket.user.tablo_style, io);
    controls[userId] = control;
    socket.join(userId);
    socket.emit('update_data', control.getData);
  });

  socket.on('join_table', async (tableId) => {
    userId = tableId
    control = controls[userId] || new controlService(userId, socket.user.tablo_style, io);
    controls[userId] = control;
    const user = await User.findOne({ _id: tableId });
    socket.join(tableId);
    socket.emit('start', control.getData);
  });

  socket.on('play_timer', () => {
    control.timer.playTimer(io, userId);
    io.to(userId).emit('timer', control.timer.timeData);
   // io.to(userId).emit('update_data', control.getData);


  });

  socket.on('clear_timer', () => {
    control.timer.clearTimer();
    io.to(userId).emit('timer', control.timer.timeData);
  });

  socket.on('change_timer', (val) => {
    control.timer.changeTimer(val);
    io.to(userId).emit('timer', control.timer.timeData);
  });

  socket.on('match', async (data) => {
    await control.setMatch(data);
    io.to(userId).emit('update_data', control.getData);
  });

  socket.on('style', async (data) => {
    control.style = data.style;
    socket.user.tablo_style = data.style;
    await socket.user.save();
    io.to(userId).emit('update_style');
    io.to(userId).emit('update_data', control.getData);
  });

  socket.on('notify', async (data) => {
    await replaceImg(data);
    console.log(data)
    await io.to(userId).emit('new_notify', data);
  });

  socket.on('new_data', (data) => {
    control.setData(data);

    io.to(userId).emit('update_data', control.getData);
  });
  socket.on('get_data', () => {
    io.to(userId).emit('update_data', control.getData);
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