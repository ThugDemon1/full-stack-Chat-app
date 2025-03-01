import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ 
     limits: { fileSize: 50 * 1024 * 1024 }
 });

router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, sendMessage);

export default router;