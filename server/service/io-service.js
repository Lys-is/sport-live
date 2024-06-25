const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
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
              console.log(userToken)
              let user = await User.findOne({_id: userToken.id})
              if (!user) {
                console.log('no user')
                socket.user = false
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
  let userId = socket.user._id.toString()
  console.log(userId)
  function newControlService() {
    return new controlService(userId, socket.user.tablo_style)
  }
    let control = controls[userId]
            socket.on('join_panel', ()=>{
              console.log('_panel')
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              socket.join(userId);
              socket.emit('update_data', control.getData)
            })


            socket.on('join_table', ()=>{
              console.log('_table')
              if(!control){
                console.log('new_control')
                control = newControlService()
                controls[userId] = control
              }
              console.log(control)
              console.log(userId)
              socket.join(userId);
              console.log('control')
              let data = "control.getData()"
              try {
                socket.emit('start', control.getData)

              } catch (e) {
                console.log(e)
              }
              console.log(data)
            })
            
            socket.on('play_timer', ()=>{
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              control.timer.playTimer(io, userId)

            })
            socket.on('match', async (data)=>{
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              await control.setMatch(data)
              io.to(userId).emit('update_data', control.getData)

            })
            socket.on('style', async (data)=>{
                control.style = data.style
                socket.user.tablo_style = data.style
                await socket.user.save()
                io.to(userId).emit('update_style')
                io.to(userId).emit('update_data', control.getData)
              })
            socket.on('notify', (data)=>{
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              console.log(data)
              io.to(userId).emit('new_notify', data)
            })
            socket.on('new_data', (data) => {
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
                control.setData(data)
                console.log(data, control.getData)
                
                try{
                  io.to(userId).emit('update_data', control.getData)
                }
                catch(e){
                  console.log(e)
                }
              //io.to(userId).emit('update_data', control)
              //io.to(userId).emit('update_data', control)
            })
}
 module.exports = new IoService();