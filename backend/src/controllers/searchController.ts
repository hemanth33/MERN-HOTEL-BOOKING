import Hotel from "../models/hotelModel"
import { Request, Response } from "express"
import { BookingType, HotelSearchResponse } from "../shared/types";
import { validationResult } from "express-validator";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const searchHotelController = async (req:Request, res:Response) => {
    try {

        const query = constructSearchQuery(req.query);
        let sortOptions = {};
        switch(req.query.sortOption) {
            case "starRating": 
                sortOptions = { starRating: -1 };
                break;
            case 'pricePerNightAsc': 
                sortOptions = { pricePerNight: 1 };
                break;
            case 'pricePerNightDesc':
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 3;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);
        
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);

    } catch (error) {
        res.status(500).send({
            message: "Error in Hotel Search"
        })
    }
};

export const hotelDetailsController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
    }

    try {

        const id = req.params.id.toString();
        const hotel = await Hotel.findById(id);

        res.json(hotel);
        
    } catch (error) {
        res.status(500).send({
            message: "Error fetching details",
        });
    }
}

export const paymentController = async (req: Request, res: Response) => {
    try {
        const {numberOfNights} = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);
        if(!hotel) {
            return res.status(400).send({ message: "Hotel not found."});
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "gbp",
            metadata: {
                hotelId,
                userId: req.userId,
            },
        });

        if(!paymentIntent.client_secret) {
            return res.status(500).send({ message: "Error creating payment intent"});
        }

        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        };

        res.send(response);

    } catch (error) {
        res.status(500).send({
            message: "Error in making payment",
            error
        });
    }
}

export const bookingController = async (req: Request, res: Response) => {
    try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);

        if(!paymentIntent) {
            return res.status(400).send({message: "Payment Intent not found"});
        }

        if(
            paymentIntent.metadata.hotelId !== req.params.hotelId || 
            paymentIntent.metadata.userId !== req.userId) {
                return res.status(400).send({ message: "Payment Intent Mismatch"});
        }

        if(paymentIntent.status !== 'succeeded') {
            return res.status(400).send({ message: `Payment intent failed. ${paymentIntent.status}`});
        }

        const newBooking: BookingType = {
            ...req.body, 
            userId: req.userId,
        }

        const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId}, {
            $push: { bookings: newBooking },
        });

        if(!hotel) {
            return res.status(400).send({ message: "Hotel not found"});
        }

        await hotel.save();

        res.status(200).send();
        
    } catch (error) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}

export const allHotelsController = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels);
    } catch (error) {
        res.status(500).send({
            message: "Some Error Has Occured."
        });
    }
}

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if(queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if(queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if(queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if(queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities],
        };
    }

    if(queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types],
        };
    }

    if(queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars) ? queryParams.stars.map((star: string) => parseInt(star)) : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if(queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
}
