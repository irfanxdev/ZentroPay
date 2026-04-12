import express from "express";
import { checkHealth, userLogIn, userSignUp, userLogout } from "../Controllers/authRouter.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router=express.Router();

router.post("/sign-up",userSignUp);
router.post("/login",userLogIn);
router.post("/logout",userLogout);
router.get("/health",checkHealth);

router.get("/dashboard",authMiddleware,(req,res)=>{
    return res.json({msg:"welcome to dashboard",
        user:req.user,
    })
})

export default router;