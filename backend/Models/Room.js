import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    purpose: {
        type: String,
        required: true,
        trim:true,
    },
    member: {
        type: Number,
        required: true,
        min:1,
    },
    memberNames: [
        {
            type: String,
        }
    ],
    code:{
        type:Number,
        required:true,
        unique:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
}, {
    timestamps: true
})

export default mongoose.model("Room", roomSchema);