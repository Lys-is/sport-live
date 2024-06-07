require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
//const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
const path = require('path');
const socketio = require("socket.io");
const http = require("http");

const authMiddleware = require('./middlewares/auth-middleware');
const checkAuthMiddleware = require('./middlewares/checkAuth-middleware');
const { check } = require('express-validator');

const PORT = process.env.PORT || 5000;
const app = express()

const server = http.createServer(app);
const router = require('./navs/constant')
console.log(router)
const io = socketio(server);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use("/static", express.static(path.dirname(__dirname) + "/static"));
console.log(__dirname)
app.set('views', path.dirname(__dirname) + "../views")
app.set('view engine', 'ejs');
app.use(errorMiddleware, authMiddleware);
app.use(router);
// app.get('/',checkAuthMiddleware.isNotAuth , function (req, res) {
//     res.render('auth', {
//         title: 'Авторизация',
//         auth: req.user || false
//     });
// });
// app.get('/lk', checkAuthMiddleware.isAuth, function (req, res) {
//     console.log(req.user);
//     res.render('lk', {
//         title: 'ЛК',
//         auth: req.user || false
//     });
// });
// console.log(process.env)
// app.use('/api', router);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        server.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
} 


start()
