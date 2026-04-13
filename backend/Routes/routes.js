import express from "express";
import { checkHealth, userLogIn, userSignUp, userLogout } from "../Controllers/authRouter.js";
import authMiddleware from "../middleware/authMiddleware.js";


import User from "../Models/User.js";

const router=express.Router();

router.post("/sign-up",userSignUp);
router.post("/login",userLogIn);
router.post("/logout",userLogout);
router.get("/health",checkHealth);

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        return res.json({ msg: "Welcome to dashboard", user });
    } catch (error) {
        return res.status(500).json({ error: "Server error in dashboard" });
    }
});

export default router;