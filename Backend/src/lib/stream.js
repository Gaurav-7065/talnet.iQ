import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey=ENV.STREAM_API_KEY;
const apiStream=ENV.STREAM_API_SECRET;
if(!apiKey||!apiStream){
    console.error("STREAM_API_KEY && STREAM_API_SECRET are invalid")
}

export const chatClient=StreamChat.getInstance(apiKey,apiStream);
export const upsertStreamUser=async (userData)=>{

    try{
        await chatClient.upsertUser(userData);
        console.log("user get upserted succesfully",userData);
    }
    catch(error){
        console.error("Error upserting Stream User"+error);
    }

}
export const deleteStreamUser=async(userID)=>{
    try{
        await chatClient.deleteUser(userID);
        console.log("user get deleted succesfully",userID)
    }
    catch(error){
        console.error("Error deleting the stream User",error)
    }
}
//todo add another to genr token
