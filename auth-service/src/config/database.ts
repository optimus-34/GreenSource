// src/config/database.ts
import mongoose from 'mongoose';

const dbURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/auth-userdb';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
