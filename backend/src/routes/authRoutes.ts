import express from 'express';
import { loginController, logOutController, validateTokenController } from '../controllers/authControllers';
import { check } from 'express-validator';
import verifyToken from '../middlewares/VerifyToken';

const router = express.Router();

router.post('/login', [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({min:6}),
] ,loginController);

router.get('/validate-token', verifyToken, validateTokenController);

router.post('/logout', logOutController);

export default router;