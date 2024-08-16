import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import connectDb from '../config/db';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import hotelRoutes from './routes/hotelsRoutes'; 
import searchRoutes from './routes/hotelSearchRoutes'
import bookingRoutes from './routes/bookingRoute';
import path from 'path';

dotenv.config();
connectDb();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();

app.use(CookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));


const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "../../../frontend/dist")));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/my-hotels', hotelRoutes);
app.use('/api/hotels', searchRoutes);
app.use('/api/my-bookings', bookingRoutes);

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is Running on port: ${PORT}`); 
});