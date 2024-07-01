import express from 'express';
import { isAuthorized } from '../middlewares/auth.js';
import { employerGetAllApplications, jobseekerDeleteApplications, jobseekerGetAllApplications, postApplication } from '../controllers/applicationController.js';
const router=express.Router();
router.get("/jobseeker/getall",isAuthorized,jobseekerGetAllApplications);
router.get("/employer/getall",isAuthorized,employerGetAllApplications);
router.delete("/delete/:id",isAuthorized,jobseekerDeleteApplications);
router.post("/post",isAuthorized,postApplication);

export default router;
