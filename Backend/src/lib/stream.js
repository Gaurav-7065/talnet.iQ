import { StreamChat } from "stream-chat";

import {StreamClient} from "@stream-io/node-sdk";
import { ENV } from "./env.js";


const apiKey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET;
if(!apiKey||!apiSecret){
    console.error("STREAM_API_KEY && STREAM_API_SECRET are invalid")
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret);//used for chat
export const sessionClient=new StreamClient(apiKey,apiSecret);//used for video calls

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

