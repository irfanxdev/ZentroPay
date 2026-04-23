import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import router from "./Routes/routes.js";
import cookieParser from "cookie-parser";
import roomRoute from "./Routes/roomRouter.js";

const app = express();
const server = http.createServer(app);

// Socket.IO setup
export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Each client joins a socket room named after the MongoDB room id
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// endpoints
app.use("/api/auth", router);
app.use("/api/room", roomRoute);
app.get("/", (req, res) => {
    return res.status(200).json({ msg: "This is Home Route" });
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("mongoose is connected"))
    .catch((e) => console.error("error to connect mongoose", e));

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`server is running on the port ${port}`);
});