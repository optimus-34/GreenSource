import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import farmerRoutes from './routes/farmer.route';
import './config/db.config';  // Connect to MongoDB

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // URL of your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS

app.use(express.json());

app.use('/api', farmerRoutes);

export default app;