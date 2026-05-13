import express from 'express';
import {ENV} from './lib/env.js'


const app=express();

console.log(ENV.PORT);


app.get("/",(req,res)=>{
    res.status(200).json({
        msg:"success from api2e2"
    })
});

app.listen(3000,()=>{
    console.log("server is running on:"+ENV.PORT);
})