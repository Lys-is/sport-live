import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { createServer } from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import errorMiddleware from "./middlewares/error-middleware.js";
import authMiddleware from "./middlewares/auth-middleware.js";
import ioService from "./service/io-service.js";
import User from "./models/user-model.js";
import bcrypt from "bcrypt";
import router from "./navs/constant.js";
import tournamentRouter from "./router/tournament-router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);

app.use(cors({ origin: "https://sporlive.ru", optionsSuccessStatus: 200 }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
   bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
   })
);
app.use(cookieParser());
app.locals.rmWhitespace = true;

router.set("views", path.join(__dirname, "/views"));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.set("view cache", true);

app.use("/static", express.static(path.join(__dirname, "../static")));
ioService.start(server);

// Logging requests
app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next();
});

app.use(errorMiddleware);
app.use(authMiddleware);
app.use(router);

app.use(tournamentRouter);

// Redirect to lk page
app.get("/", authMiddleware, (req, res) => {
   res.redirect("/lk");
});

const startServer = async () => {
   try {
      console.log(
         `Connecting to MongoDB at ${process.env.DB_URL || "localhost"}`
      );
      const connection = await mongoose.connect(
         process.env.DB_URL ||
            "mongodb://admin:HuO%40yFk%3F@31.128.37.12:27018/test"
      );

      if (connection) {
         console.log("MongoDB connected:", connection.connection.host);
      } else {
         console.log("MongoDB connection failed");
      }

      // Check for admin user and create if not exists
      const adminEmail = "admin@admin.com";
      if (!(await User.findOne({ email: adminEmail }))) {
         const hashedPassword = await bcrypt.hash("aAdmin6d$fds)!", 10); // Use a higher salt rounds value
         const user = new User({
            nickname: "admin",
            email: adminEmail,
            password: hashedPassword,
            roles: ["admin"],
            isAdmin: true,
         });
         await user.save();
      }

      server.listen(PORT, () =>
         console.log(`Server started on PORT = ${PORT}`)
      );
   } catch (error) {
      console.error("Error starting server:", error);
   }
};

startServer();
