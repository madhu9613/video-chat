import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey=process.env.STEAM_API_KEY
const apiSecret=process.env.STEAM_API_SEC

if(!apiKey || !apiSecret)
{
    console.error("apikey and apiSecret key are missing");
}
const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async(userdata)=>{
try{
    await streamClient.upsertUsers([userdata]);
    return userdata;
}
catch(error)
{
    console.error("error upserting Stream user",error);

}
};

export const generateStreamToken=(userId)=>{
   try {

    const userIdStr=userId.toString();
    return streamClient.createToken(userIdStr)
    
   } catch (error) {
    console.error("Error generating stream token",error)
   } 
}
