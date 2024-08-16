import mongoose from 'mongoose';

const connectDb = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URL as string)
                    .then(() => 
                        console.log(
                            "Connected to Database",
                            process.env.MONGO_URL
                        )
                    );
        
    } catch (error) {
        console.log("Error while connecting to DB ", error);
    }
}

export default connectDb;