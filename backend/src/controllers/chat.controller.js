import { generateStreamToken } from "../lib/steam.js";

const getStreamToken=async(req,res)=>{
    try {

        const token=generateStreamToken(req.user.id)
        
        res.status(200).json({token})
    } catch (error) {
        console.log("error in chat controller",error);
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

export {
    getStreamToken
}