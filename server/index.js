require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
const path = require('path');
const socketio = require("socket.io");
const http = require("http");

const authMiddleware = require('./middlewares/auth-middleware');
const checkAuthMiddleware = require('./middlewares/checkAuth-middleware');
const { check } = require('express-validator');
const ioService = require('./service/io-service');
const PORT = process.env.PORT || 5000;
const app = express()
const bcrypt = require('bcrypt');
const User = require('./models/user-model');
const server = http.createServer(app);
const router = require('./navs/constant')
let ejs = require('ejs');
const { LRUCache } = require('lru-cache')

console.log(router._router.stack)
ioService.start(server);
//const io = socketio(server);
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
// console.log(app.get('views'));
// app.set('views', path.join(__dirname, '/views'));
// console.log(app.get('views'));
app.locals.rmWhitespace = true;
app.use('*', (req, res, next) => {
    const { url, path: routePath }  = req;
    next();
});
app.use("/static", express.static(path.dirname(__dirname) + "/static"));


router.set('views',path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.set('view cache', true);

console.log(app.get('views'));
console.log(app);


app.use(errorMiddleware, authMiddleware);
app.use(router);

app.get('/', authMiddleware, (req, res) => {
    res.redirect('/lk');
})



const start = async () => {
    try {
        
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        if(!await User.findOne({nickname: 'admin'})) {
            let user = new User({
                nickname: 'admin',
                email: 'admin@admin.com',
                password: await bcrypt.hash('aAdmin6d$fds)!', 3),
                roles: ['admin'],
                isAdmin: true
            });
            user.save();
        }
        server.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
        console.log(LRUCache)
        ejs.cache = new LRUCache({
            max: 100, //Maximum
            maxAge: 60 * 10 * 10
        });
    } catch (e) {
        console.log(e);
    }
} 


start()
