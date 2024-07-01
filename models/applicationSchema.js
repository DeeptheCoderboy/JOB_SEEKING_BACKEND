import mongoose from "mongoose";
import validator from "validator";

const applicationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Provide your Name!"],
        minLength:[3,"Name Must Contain Atleast Three Characters!"],
        maxLength:[30,"Name Cannot Exceed 30 Characters!"]
    },
    email:{
        type:String,
        validator:[validator.isEmail,"Please Provide a valid email"],
        required:[true,"Please Provide Your Email"],
    },
    coverLetter:{
        type:String,
        required:[true,"Please Provide your cover Letter"]
    },
    phone:{
        type:Number,
        required:[true,"Please Provide your Phone No"]
    },
    address:{
        type:String,
        required:[true,"Please Provide Your Address"]
    }
    ,
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    },
    applicantID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true,
        }
    },
    employerID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        role:{
            type:String,
            enum:["Employer"],
            required:true,
        }
    }
})
export const Application=mongoose.model("Application",applicationSchema);