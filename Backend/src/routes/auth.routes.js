// src/routes/auth.routes.js
import express from "express";
import multer from 'multer';
import { login, signup, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";


const router = express.Router();

// Define POST routes
const upload = multer({ 
     limits: { fileSize: 50 * 1024 * 1024 }
 });
router.post("/signup", signup);  
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profilepic", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
export default router;
