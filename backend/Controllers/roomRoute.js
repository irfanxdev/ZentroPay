import Room from "../Models/Room.js";
import Item from "../Models/Item.js";

async function genrateUniqueCode(){
    const code=Math.floor(1000+Math.random()*9000);
   const exist=await Room.findOne({code});
   if(exist){
    return genrateUniqueCode();
   }
   return code;
}
export const roomCreated = async (req, res) => {
    try {
        const { purpose } = req.body;

        if (!purpose) {
            return res.status(400).json({ msg: "Purpose is required" });
        }

        const uniqueCode = await genrateUniqueCode();
        const newRoom = await Room.create({
            purpose,
            member: 1,                  // creator is the first member
            memberNames: [req.user.name], // creator's name seeds the list
            code: uniqueCode,
            user: req.user.id,
            members: [req.user.id],      // creator's ID in the members array
        });

        return res.status(200).json({
            msg: "Room created Successfully",
            room: newRoom
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while creating room" });
    }
};

export const roomJoined = async (req, res) => {
    try{
        const {code}=req.body;
        if(!code) return res.status(400).json({msg:"please enter a code"});
        const room=await Room.findOne({code});
        if(!room) return res.status(404).json({msg:"Room not found"});

        // Prevent duplicate: check if user already joined
        const alreadyJoined = room.members.some(
            (memberId) => memberId.toString() === req.user.id.toString()
        );
        if(alreadyJoined){
            return res.status(400).json({message:"You have already joined this room"});
        }

        room.member+=1;
        room.memberNames.push(req.user.name);
        room.members.push(req.user.id);
        await room.save();
        return res.status(200).json({
            msg:"Room joined successfully",
            room
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({msg:"server error while joining the room"})
    }
}

export const getAllRoom= async (req,res)=>{
    try{
        // Return rooms where this user is the creator OR has joined as a member
        const rooms=await Room.find({
            $or: [
                { user: req.user.id },
                { members: req.user.id }
            ]
        }).sort({ updatedAt: -1 });
        return res.status(200).json({
            msg:"Rooms data fetched successfully",
            rooms
        })
    }catch(error){
        return res.status(500).json({msg:"server error while geting the rooms data"})
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ msg: "Room not found" });

        // Only the creator can delete the room
        if (room.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "Only the room creator can delete this room" });
        }

        // Delete all items belonging to this room first
        await Item.deleteMany({ room: room._id });
        await Room.findByIdAndDelete(req.params.id);

        return res.status(200).json({ msg: "Room deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while deleting the room" });
    }
}