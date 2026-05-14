import mongoose from 'mongoose'
import { ENV } from './env.js'

export const connectDB=async()=>{
    if(!ENV.DB_URL){
        throw new Error("DB url is not correct");
    }

    try {
        const conn=await mongoose.connect(ENV.DB_URL);
        console.log("mongoDb conneceted"+conn.connection.host);
        
    } catch (error) {
        console.error("Db not connected"+error);
        process.exit(1)
        
    }

}