import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";
export const employerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Job Seeker is Not Allowed Acess the Resources!",400));
        

    }
    const {_id}=req.user;
    const applications =await Application.find({"employerID.user":_id});
    res.status(200).json({
        success:true,
        applications,
    })
})
export const jobseekerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Employer"){
        return next(new ErrorHandler("Employee is Not Allowed Acess the Resources!",400));
        

    }
    const {_id}=req.user;
    const applications =await Application.find({"applicantID.user":_id});
    res.status(200).json({
        success:true,
        applications,
    })
})

export const jobseekerDeleteApplications=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Employer"){
        return next(new ErrorHandler("Employee is Not Allowed Acess the Resources!",400));
        

    }
    const {id}=req.params;
    const application =await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("OOPs Application Not Found!",404));

    }
    await Application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application Deleted Successfully"
        
    })
})
export const postApplication=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Employer"){
        return next(new ErrorHandler("Employee is Not Allowed Acess the Resources!",400));
        

    }
    if(!req.files||Object.keys(req.files).length===0){
        return next(new ErrorHandler("Resume file required"));

    }
    const {resume}=req.files;
    const allowedFormats=['image/png','image/jpeg','image/webp'];
    if(!allowedFormats.includes(resume.mimetype)){
      
        return next(new ErrorHandler("Invalid File type please upload your resume in a png,jpg or webp format",400))
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(
        resume.tempFilePath
    )
    if(!cloudinaryResponse||cloudinaryResponse.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error||"Unknown Cloudinary Error"
        );
        return next(new ErrorHandler("Failed to upload Resume",500))

    }
    const {name,email,coverLetter,phone,address,jobId}=req.body;
    const applicantID={
        user:req.user._id,
        role:"Job Seeker",
    };
    if(!jobId){
        return next(new ErrorHandler("Job not Found!",404));
    }
    const jobDetails=await Job.findById(jobId);
    if(!jobDetails){
        return next(new ErrorHandler("Job not Found!",404));
    }
    const employerID={
        user:jobDetails.postedBy,
        role:"Employer",
    }
   if(!name||!email||!coverLetter||!phone||!address||!applicantID||!employerID||!resume){
    return next(new ErrorHandler("Please fill all field",400));
   }
     const application =await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }

     })
     res.status(200).json({
        success:true,
        message:"Application Submitted Successfully",
        application,
    });

})
