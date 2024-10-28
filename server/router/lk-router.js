const Router = require("express").Router;
import controller from "../controllers/api/lk-controller.js";
const router = new Router();
const { body } = require("express-validator");
import authMiddleware from "../middlewares/auth-middleware.js";

router.get("/profile", controller.get__profile);
router.get("/team", controller.get__team);
router.get("/team/create", controller.get__create);
router.post("/team/create", controller.post__create);
router.put("/profile", controller.put__profile);

export default router;
