import express from "express";
import { getAllRoom, roomCreated, roomJoined } from "../Controllers/roomRoute.js";
import { getRoomItems, addRoomItem } from "../Controllers/itemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", authMiddleware, roomCreated);
router.get("/join", authMiddleware, roomJoined);
router.get("/all", authMiddleware, getAllRoom);

// Item routes
router.get("/:id/items", authMiddleware, getRoomItems);
router.post("/:id/items", authMiddleware, addRoomItem);

export default router;