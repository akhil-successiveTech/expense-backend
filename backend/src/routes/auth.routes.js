import { Router } from "express";
import passport from "passport";
import { login, signup } from "../controllers/auth.controller.js";
import "../config/passport.js"; // load google strategy
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Normal signup/login
router.post("/signup", signup);
router.post("/login", login);

// Google signup - start auth
router.get("/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google signup - callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signup" }),
  (req, res) => {
    const payload = { id: req.user._id, email: req.user.email, name: req.user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    const redirectUrl = `${process.env.CLIENT_URL}/google-success?token=${token}`;
    return res.redirect(redirectUrl);
  }
);

export default router;