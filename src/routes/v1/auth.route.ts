import express from "express";
import validate from "../../middlewares/validate";
import authValidation from "../../validations/auth.validation";
import { authController } from "../../controllers";
import passport from "passport";
import jwtStrategy from "../../config/passport";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post(
  "/login",
  validate(authValidation.loginUserWithEmailAndPassword),
  authController.loginUserWithEmailAndPassword
);
router.get(
  "/test/:anklit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Ok");
  }
);

export default router;
