import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotelModel';
import { hotelType } from '../shared/types';

export const addHotelController = async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: hotelType = req.body;

        const imageUrls = await uploadImages(imageFiles);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        // 3. Save the new Hotel to DB
        const hotel = new Hotel(newHotel);
        await hotel.save();

        // 4. return a 201 status
        res.status(201).send(hotel);
        
    } catch (error) {
        res.status(500).send({
            message: "Something went wrong!",
        });
    }
}

export const getAllHotelsController = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).send({
            message: "Error Fetching Hotels",
        });
    }
}

export const getHotelByIdController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id.toString();
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });

        res.json(hotel);

    } catch (error) {
        res.status(500).send({
            message: "Error fetching Hotel"
        })
    }
}

export const updateHotelController = async (req: Request, res: Response) => {
    try {
        const updatedHotel: hotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId
        }, updatedHotel, {new: true, runValidators: true});

        if(!hotel) {
            return res.status(404).send({
                message: "Hotel Not found"
            });
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

        await hotel.save();

        res.status(201).json(hotel);

    } catch (error) {
        res.status(500).send({
            message: "Error Updating Details"
        })
    }
}

async function uploadImages(imageFiles: Express.Multer.File[]) {

    // 1. Upload images to Cloudinary
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    // 2. if upload is success, add the Urls to the new Hotel
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
