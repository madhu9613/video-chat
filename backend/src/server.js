import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";

const app=express()
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);



app.use("/api/auth",authRoutes)
app.use("/api/user",userRouter)
app.use("/api/chat",chatRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
 
});