import Item from "../Models/Item.js";
import Room from "../Models/Room.js";
import { io } from "../server.js";

// GET all items for a specific room
// Accessible by creator OR any member who joined
export const getRoomItems = async (req, res) => {
    try {
        const { id } = req.params;

        // Allow creators AND joined members to view the room
        const room = await Room.findOne({
            _id: id,
            $or: [
                { user: req.user.id },
                { members: req.user.id }
            ]
        });

        if (!room) {
            return res.status(404).json({ msg: "Room not found or access denied" });
        }

        const items = await Item.find({ room: id })
            .populate("addedBy", "name")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            msg: "Items fetched successfully",
            room,
            items,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while fetching items" });
    }
};

// POST add a new item to a room
// Accessible by creator OR any member who joined
export const addRoomItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount } = req.body;

        if (!name || amount === undefined || amount === "") {
            return res.status(400).json({ msg: "Item name and amount are required" });
        }

        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({ msg: "Amount must be a valid non-negative number" });
        }

        // Allow creators AND joined members to add items
        const room = await Room.findOne({
            _id: id,
            $or: [
                { user: req.user.id },
                { members: req.user.id }
            ]
        });

        if (!room) {
            return res.status(404).json({ msg: "Room not found or access denied" });
        }

        const newItem = await Item.create({
            name,
            amount: parsedAmount,
            room: id,
            addedBy: req.user.id,
        });

        // Populate addedBy so the frontend receives the user's name
        const populated = await newItem.populate("addedBy", "name");

        // Broadcast to ALL members of this socket room in real-time
        io.to(id).emit("new-item", populated);

        return res.status(201).json({
            msg: "Item added successfully",
            item: populated,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while adding item" });
    }
};
