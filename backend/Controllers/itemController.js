import Item from "../Models/Item.js";
import Room from "../Models/Room.js";

// GET all items for a specific room
export const getRoomItems = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify the room belongs to the logged-in user
        const room = await Room.findOne({ _id: id, user: req.user.id });
        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        const items = await Item.find({ room: id }).populate("addedBy", "name");

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

        // Verify the room belongs to the logged-in user
        const room = await Room.findOne({ _id: id, user: req.user.id });
        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        const newItem = await Item.create({
            name,
            amount: parsedAmount,
            room: id,
            addedBy: req.user.id,
        });

        return res.status(201).json({
            msg: "Item added successfully",
            item: newItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while adding item" });
    }
};
