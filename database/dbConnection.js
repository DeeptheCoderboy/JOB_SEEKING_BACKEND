import mongoose from "mongoose";
 export const dbConnetion=()=>{
    mongoose.connect(process.env.MONGO_URI,{dbName:"MERN_STACK_JOB_SEEKING"}
   
    ).then(()=>{
        console.log("Connected to database")
    }).catch((err)=>{
        console.log(`Some error while connecting to database: ${err}`);
    })
}