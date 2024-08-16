import express from 'express';
import { check } from 'express-validator';
import { getUserController, registerController } from '../controllers/userControllers';
import verifyToken from '../middlewares/VerifyToken';

const router = express.Router();

router.post('/register',
    [
       check("firstName", "First Name is required.").isString(), 
       check("lastName", "Last Name is required.").isString(), 
       check("email", "Email is required.").isEmail(), 
       check("password", "Password with 6 or more characters is required.").isLength({min:6}), 
    ] , 
    registerController);

router.get('/me', verifyToken, getUserController);

export default router;