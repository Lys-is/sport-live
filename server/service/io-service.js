const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
const controlService = require('./control-service');
let io = null
let controls = {}
class IoService {
    constructor() {
    }
    toRoom(room, emit, data){
        console.log(room, emit, data)

      //  io.to(room).emit(emit, data)

        let emitData = {
            room: room,
            emit: emit,
            data: data
        }
        let env_servers = process.env.ENV_SERVERS.split(',');

        env_servers.forEach(server => {
          if(!server.includes(process.env.NOW_HOST)) {
            console.log(server)
            request.post(
              `${server}/api/socket`,
              { json: { emitData: emitData } },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      console.log(body);
                  }
              }
          );
          }

        })
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
              if (!user) 
                socket.user = false
              else{
                socket.user = user
                console.log(socket.user._id.toString())
                socket.join(socket.user._id.toString())
              }
            }
            catch(e){
              socket.user = false
              console.log(e)
            }
            finally {
              socket.join('OnlineChat');
              
            }
            if(socket.user){
              startPanel(controls, socket)
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

  function newControlService() {
    return new controlService(userId)
  }
  let control = controls[socket.user._id.toString()]
            socket.on('join_panel', ()=>{
              console.log('_panel')
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              socket.join(userId);
            })


            socket.on('join_table', ()=>{
              console.log('_table')
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              console.log(control)
              socket.join(userId);
              console.log('control')
              let data = "control.getData()"
              socket.emit('start', control)
              console.log(data)
            })
            
            socket.on('play_timer', ()=>{
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
              control.timer.playTimer(socket)

            })
            socket.on('new_data', (data) => {
              if(!control){
                control = newControlService()
                controls[userId] = control
              }
                control.setData(data)
                console.log(data, control)
                
              socket.to(userId).emit('update_data', control)
              //io.to(userId).emit('update_data', control)
            })
}
 module.exports = new IoService();