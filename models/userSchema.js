import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Provide Your name"],
        minLength:[3,"Name must Contain At least 3 characters!"],
        maxLength:[30,"Name must Contain maximum 30 characters!"],
    },
    email:{
        type:String,
        required:[true,"Please Provide your Email! "],
        validate:[validator.isEmail,"Please Provide a Valid Email"]
    },
    phone:{
        type:Number,
        required:[true,"Enter Your Phone Number"]
    },
    password:{
        type:String,
        required:[true,"Enter your Password"],
        minLength:[8,"Enter atleast 8 character"],
        maxLength:[32,"Enter maximum 32 character"],
        select:false
    },
    role:{
        type:String,
        required:[true,"Please Provide Your Role"],
        enum:["Job Seeker","Employer"],

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

//Hashing the Password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});

//compare pass
userSchema.methods.comparePassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
};
//jwt sign
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}
export const User=mongoose.model("user",userSchema);