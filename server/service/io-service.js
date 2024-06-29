const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
const Player = require('../models/player-model');
const Couch = require('../models/couch-model');
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
  let userId = '',
  user = socket.user
  if(user)
    userId = socket.user._id.toString()

  console.log(userId)
  function sendData() {
    io.to(userId).emit('update_data', control.getData)

  }
  function newControlService() {
    return new controlService(userId, user.tablo_style, io)
  }
    let control = controls[userId]
            socket.on('join_panel', async (tableId)=>{
              console.log('_panel', control)
              if(!control){
                userId = tableId
                user = await User.findOne({_id: userId})
                control = controls[userId] ? controls[userId] : newControlService()
                controls[userId] = control
              }
              socket.join(userId);
              socket.emit('update_data', control.getData)
            })


            socket.on('join_table', async (tableId)=>{
              console.log('_table')
              if(!control){
                userId = tableId
                user = await User.findOne({_id: userId})

                console.log('new_control')
                control = controls[userId] ? controls[userId] : newControlService()
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
              control.timer.playTimer(io, userId)

            })
            socket.on('clear_timer', ()=>{
              control.timer.clearTimer()
              io.to(userId).emit('timer', control.timer.timeData)
            })
            socket.on('change_timer', (val)=>{
              console.log(val, control.timer)
              control.timer.changeTimer(val)
              io.to(userId).emit('timer', control.timer.timeData)

            })
            socket.on('match', async (data)=>{
              if(!control){
                control = controls[userId] ? controls[userId] : newControlService()
                controls[userId] = control
              }
              await control.setMatch(data)
              sendData()
            })
            socket.on('style', async (data)=>{
                control.style = data.style
                socket.user.tablo_style = data.style
                await socket.user.save()
                io.to(userId).emit('update_style')
                sendData()
              })
            socket.on('notify', async (data)=>{
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              if(data.text.includes('{{img_player}}')){
                let player = await Player.findOne({_id: data.playerId})
                console.log(player)
                if(player.img)
                 data.text = data.text.replace('{{img_player}}', `<img src="${player.img}" class="notify_img">`)
                else {
                  data.text = data.text.replace('{{img_player}}', '')
                }
              }
              if(data.text.includes('{{img_couch}}')){
                let couch = await Couch.findOne({_id: data.couchId})
                console.log(couch)
                if(couch.img)
                 data.text = data.text.replace('{{img_couch}}', `<img src="${couch.img}" class="notify_img">`)
                else {
                  data.text = data.text.replace('{{img_couch}}', '')
                }
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
                  sendData()
                }
                catch(e){
                  console.log(e)
                }
              //io.to(userId).emit('update_data', control)
              //io.to(userId).emit('update_data', control)
            })
}
 module.exports = new IoService();