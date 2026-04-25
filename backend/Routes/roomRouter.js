import express from "express";
import { getAllRoom, roomCreated, roomJoined, deleteRoom } from "../Controllers/roomRoute.js";
import { getRoomItems, addRoomItem, deleteRoomItem } from "../Controllers/itemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", authMiddleware, roomCreated);
router.post("/join", authMiddleware, roomJoined);
router.get("/all", authMiddleware, getAllRoom);
router.delete("/:id", authMiddleware, deleteRoom);

// Item routes
router.get("/:id/items", authMiddleware, getRoomItems);
router.post("/:id/items", authMiddleware, addRoomItem);
router.delete("/:id/items/:itemId", authMiddleware, deleteRoomItem);

export default router;