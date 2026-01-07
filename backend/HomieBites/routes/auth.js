// Auth routes for HomieBites
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login - Login user
router.post("/login", authController.login);

// POST /api/auth/register - Register new user
router.post("/register", authController.register);

export default router;
