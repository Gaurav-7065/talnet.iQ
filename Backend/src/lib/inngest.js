import { Inngest } from "inngest";
import {connectDB} from './db.js'
import User from '../models/User.js'
import { upsertStreamUser,deleteUser } from "./stream.js";
export const inngest = new Inngest({ id: "talent-iq" });


const syncUser=inngest.createFunction(
    {id:'sync-user'},
    {event:'clerk/user.created'},
    async ({event})=>{
        await connectDB();
        
        const {id,email_addresses,first_name,last_name,image_url}=event.data;
        const newUser={
            clerkId:id,
            email:email_addresses[0]?.email_address,
            name:`${first_name||""} ${last_name||""}`,
            ProfileImage:image_url
        }
        await User.create(newUser);
        //to do something else
        await upsertStreamUser({
            id:newUser.clerkId.toString(),
            name:newUser.name,
            image:newUser.ProfileImage
        })
    }
)
const deleteUser=inngest.createFunction(
    {id:'delete-user'},
    {event:'clerk/user.deleted'},
    async ({event})=>{
        await connectDB();
        const {id}=event.data;
        await User.deleteOne({clerkId:id})
        //to do sthe
        await deleteUser(id.toString());

    }

)
export const functions = [syncUser,deleteUser];