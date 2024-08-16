import express from 'express';
import { addHotelController, getAllHotelsController, getHotelByIdController, updateHotelController } from '../controllers/hotelController';
import multer from 'multer';
import verifyToken from '../middlewares/VerifyToken';
import { body } from 'express-validator';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

router.post('/', 
    verifyToken, 
    [
        body("name").notEmpty().withMessage('Name is required.'),
        body("city").notEmpty().withMessage('City is required.'),
        body("country").notEmpty().withMessage('Country is required.'),
        body("description").notEmpty().withMessage('Description is required.'),
        body("type").notEmpty().withMessage('Hotel Type is required.'),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage('Price Per Night is required and must be a number.'),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage('Facilities are required.'),
    ],
    upload.array("imageFiles", 6), 
addHotelController);

router.get('/', verifyToken, getAllHotelsController);

router.get('/:id', verifyToken, getHotelByIdController);

router.put('/:hotelId', verifyToken, upload.array("imageFiles"), updateHotelController);


export default router;