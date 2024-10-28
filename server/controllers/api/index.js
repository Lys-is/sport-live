import authController from "./auth-controller.js";
import lkController from "./lk-controller.js";
import fansController from "./fans-controller.js";
import team from "./team/index.js";

export default {
   auth: authController,
   lk: lkController,
   "fans/:address": fansController,
};
