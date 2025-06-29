import mongoose from "mongoose"

export const connectDB=async ()=>{
    try {
        

      const conn=  await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB connected ",conn.connection.host);

    } catch (error) {
        console.log("Error in connecting Database ",error);
        process.exit(1);
    }
}