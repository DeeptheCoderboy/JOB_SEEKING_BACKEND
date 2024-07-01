import express from 'express';
import {Register, getUser, login, logout} from '../controllers/userController.js';

import { isAuthorized } from '../middlewares/auth.js';


const router=express.Router();
router.post("/register",Register);
router.post("/login",login);
router.get("/logout",isAuthorized,logout);
router.get("/getuser",isAuthorized,getUser);

export default router;

