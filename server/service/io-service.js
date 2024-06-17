const socketIO = require('socket.io');
const tokenService = require('./token-service');
const User = require('../models/user-model');
let io = null
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
            socket.on('join_panel', ()=>{
              console.log('_panel')
              socket.join(socket.user._id.toString()+'_panel');
            })
            socket.on('join_table', ()=>{
              console.log('_table')
              socket.join(socket.user._id.toString()+'_table');
            })
            socket.on('new_data', (data) => {
                console.log(data)
              socket.to(socket.user._id.toString()+'_table').emit('update_data', data)
            })
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

 module.exports = new IoService();