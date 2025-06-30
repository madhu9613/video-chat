import express from "express";
import {signup,login,logout,onboard} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter=express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);

authRouter.post("/onboarding",protectRoute,onboard)
authRouter.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
})
export default authRouter;
    