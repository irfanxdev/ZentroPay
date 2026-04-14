import Room from "../Models/Room.js";

export const roomCreated = async (req, res) => {
    try {
        const { purpose, numMembers, memberNames } = req.body;

        if (!purpose || !numMembers || !memberNames) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const count = Number(numMembers);

        if (isNaN(count)) {
            return res.status(400).json({ msg: "Members must be a number" });
        }

        const memberNameArray = Array.isArray(memberNames)
            ? memberNames
            : memberNames
                .split(",")
                .map(name => name.trim())
                .filter(name => name !== "");

        if (memberNameArray.length !== count) {
            return res.status(400).json({
                msg: "Number of members must match the number of names"
            });
        }

        const newRoom = await Room.create({
            purpose,
            member: count,
            memberNames: memberNameArray,
            user: req.user.id
        });

        console.log(newRoom);

        return res.status(200).json({
            msg: "Room created Successfully",
            room: newRoom
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while creating room" });
    }
};

export const roomJoined = (req, res) => {
    return res.status(200).json({ msg: "Room joined Successfully" });
}

export const getAllRoom= async (req,res)=>{
    try{
        const rooms=await Room.find({user:req.user.id});
        return res.status(200).json({
            msg:"Rooms data fetched successfully",
            rooms
        })
    }catch(error){
        return res.status(500).json({msg:"server error while geting the rooms data"})
    }
}