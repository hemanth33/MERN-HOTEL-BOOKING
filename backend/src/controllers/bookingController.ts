import { Request, Response } from 'express';
import Hotel from '../models/hotelModel';
import { hotelType } from '../shared/types';

export const bookHotelController = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {
                $elemMatch: {userId: req.userId}
            }
        });

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId);

            const hotelWithUserBookings: hotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };
            
            return hotelWithUserBookings;
        });

        res.status(200).send(results);

    } catch (error) {
        res.status(500).send({
            message: "Unable to fetch Bookings",
        });
    }
}   