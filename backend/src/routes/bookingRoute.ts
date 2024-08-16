import express from 'express';
import verifyToken from '../middlewares/VerifyToken';
import { bookHotelController } from '../controllers/bookingController';

const router = express.Router();

router.get('/', verifyToken, bookHotelController);

export default router;