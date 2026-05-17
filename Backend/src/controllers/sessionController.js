import { StreamClient } from '@stream-io/node-sdk';
import {chatClient} from '../lib/stream.js'
import  Session  from '../models/Session.js'


export async function createSession(req,res) {

    const {problem,difficulty}=req.body;
    const clerkId=req.user.clerkId;
    const userId=req.user._id;

    if(!problem||!difficulty) {
        return res.status(400).json({message:"Problem and difficulty are required"})
    }
    const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    //create session in db
    const session=await Session.create({problem,difficulty,host:userId,callId});

    //create stream video call
    await StreamClient.video.call("default",callId).getOrCreate ({
        data:{
            created_by_id:clerkId,
            custom:{problem,difficulty,session_Id:session._id.toString()}
        }
    })

    //chat messaging
    const channel=chatClient.channel("messaging",callId,{
        name:`${problem} session`,
        created_by:clerkId,
        members:[clerkId]
    });
    await channel.create();
    res.status(201).json({session})
}

export async function getActiveSessions(req,res) {
    try {
        const session=await Session.find({status:"active"})
        .populate("host","name email profileImage clerkId")
        .sort({createdAt: -1})
        .limit(20);

        res.status(200).json({session});
        
    } catch (error) {
        console.log("Error in getActiveSessions",error.message);
        res.status(500).json({message:"Internal server error"})
        
    }
    
}

 export async function getMyRecentSessions(req,res){
    try{
        const userId=req.user._id;

        //get session where user is host or participent
        const session=Session.find({
            status:"completed",
            $or:[{host:userId},{participant:userId}],
        })
        .sort({createdAt:-1})
        .limit(20)
        res.status(200).json({session});
    }
    catch(error){
        console.log("Error in getMyRecentSession",error.message);
        res.status(500).json({message:"Internal Server Error"})

    }

 }

export async function getSessionById(req,res){
    try {
        const {id}=req.params;

        const session=await Session.findById(id)
        .populate("host","name profileImage email clerkId")
        .populate("participant","name profileImage email clerkId")
        
        if(!session) return  res.status(404).json({message:"Session not found"});

        res.status(200).json({session});

        
    } catch (error) {
        console.log("Error in getSessionById",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

// export async function getActiveSessions(req,res){

// }

export async function joinSession(req,res){
    try {
        const {id}=req.params;
        const userId=req.user._id;
        const clerkId=req.user.clerkId;

        const session=await Session.findById(id);

        if(!session) return res.status(404).json({message:"Session not found"});
        if(session.status!=="active"){
           return res.status(400).json("Cannot join a completed Session");
        }
        //host cannot join there own session as a participent
        if(session.host.toString()===userId.toString()){
           return res.status(400).json({message:"host cannot join there own session as a participant"});
        }

        if(session.participant)return res.status(409).json({message:"Session is full"})
         
        session.participant=userId;
        await session.save();

        const channel=chatClient.channel("messaging",session.callId);
        await channel.addMembers([clerkId])

        res.status(200).json({session});

        
    } catch (error) {
        console.log("Error in joinSession",error.message);
        res.status(500).json({message:"Internal server error"})
        
    }

}

export async function endSession(req, res){
     try {
        const {id}=req.params;
        const userId=req.user._id;

        const session=await Session.findById(id);

        //check if user is host or not
        if(session.host.toString()!=userId.toString()){
            return res.status(403).json({message:"Only the host can end the Session"});
        }
        //check is session is completed
        if(session.status=="completed"){
            return res.status(400).json({message:"Session is already completed"});
        }

        //delete stream video call
        const  call=StreamClient.video.call("default",session.callId);
        await call.delete({hard:true});

        //delete stream chat channel
        const channel=chatClient.channel("messaging",session.callId);
        await channel.delete();

        session.status="completed";
        await session.save();

        res.status(200).json({message:"Session ended successfully"})
     } catch (error) {
        console.log("Error in endSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
     }
}
