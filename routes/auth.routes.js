import express from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
