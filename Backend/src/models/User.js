import mongoose, { Schema } from 'mongoose'

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImage:{
        type:String,
        default:""
    },
    clerkId:{
        type:String,
        require:true,
        unique:true
    },
    

},{timestamps:true}) //createdAt updatedAt

const User=mongoose.model("User",userSchema);
export default User;