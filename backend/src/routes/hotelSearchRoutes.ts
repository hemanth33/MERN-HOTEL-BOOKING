import express from 'express';
import { allHotelsController, bookingController, hotelDetailsController, paymentController, searchHotelController } from '../controllers/searchController';
import { param } from 'express-validator';
import verifyToken from '../middlewares/VerifyToken';

const router = express.Router();

router.get('/search', searchHotelController);

router.get('/:id', [
    param("id").notEmpty().withMessage("Hotel Id is required.")
],hotelDetailsController);

router.post('/:hotelId/bookings/payment-intent', verifyToken, paymentController);

router.post('/:hotelId/bookings', verifyToken, bookingController);

router.get('/', allHotelsController);

export default router;