import express from "express";

import passport from "passport";
import { userService } from "../../services";
import { userController } from "../../controllers";

const mediaInput = require("../../middlewares/mediaInput.js");

const router = express.Router();

router.post(
  "/upload/:id",
  [
    passport.authenticate("jwt", { session: false }),
    mediaInput.upload.fields([{ name: "images", maxCount: 10 }]),
  ],
  userController.uploadImages
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),

  userController.updateUser
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),

  userController.getUserById
);

router.post(
  "/delete-image/:id",
  passport.authenticate("jwt", { session: false }),

  userController.deleteImage
);

export default router;
