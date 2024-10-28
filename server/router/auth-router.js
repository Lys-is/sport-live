const Router = require("express").Router;
import userController from "../controllers/api/auth-controller.js";
const router = new Router();
const { body } = require("express-validator");
import authMiddleware from "../middlewares/auth-middleware.js";

router.post(
   "/registration",
   body("email").isEmail(),
   body("password").isLength({ min: 3, max: 32 }),
   userController.post__registration
);
router.post("/login", userController.post__login);
router.post("/logout", userController.post__logout);
router.get("/activate/:link", userController.get__activate);
router.get("/refresh", userController.get__refresh);
router.get("/users", authMiddleware, userController.get__users);
export default router;
