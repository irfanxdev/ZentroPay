import express from "express";
import { roomCreated, roomJoined } from "../Controllers/roomRoute.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();
router.post("/create",authMiddleware,roomCreated);
router.get("/join",authMiddleware,roomJoined);

export default router;