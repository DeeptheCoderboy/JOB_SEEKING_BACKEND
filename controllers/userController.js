import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const Register=catchAsyncError(async(req,res,next)=>{
const {name,email,phone,role,password}=req.body;
if(!name||!email||!phone||!role||!password){
    return next(new ErrorHandler("Please Provide full registration form"));
}
const isEmail=await User.findOne({email});
if(isEmail){
    return next(new ErrorHandler("Email already Exist"));
}
const user=await User.create({
    name,
    email,
    phone,
    role,
    password
})
sendToken(user,200,res,"User registered successfully");

})

export const login=catchAsyncError(async(req,res,next)=>{
    const {password,email,role}=req.body;
    if(!password||!email||!role){
        return next( new ErrorHandler("Please Provide Email,Password And Role",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email,password or role",400));
    }
    const isPasswordMatched= await user.comparePassword(password);
    if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid password ",400));

    }
    if(user.role!=role){
        return next(new ErrorHandler("Invalid  role",400));

    }
    sendToken(user,200,res,"User Logged in successfully");
})

export const logout=catchAsyncError(async(req,res,next)=>{
  res.status(201).cookie("token","",{
    httpOnly:true,
    expires:new Date(Date.now()),
    secure:true,sameSite:"None",
  }).json({
    success:true,
    message:"User Logout Successfully"
  })
})

export const getUser=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    
    res.status(200).json({
        success:true,
        user,
    })

})





