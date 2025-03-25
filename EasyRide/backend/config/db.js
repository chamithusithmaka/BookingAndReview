import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);

    } catch (error) {
        process.exit(1);//process code 1 code means exit with error, 0 means success
    }
}
