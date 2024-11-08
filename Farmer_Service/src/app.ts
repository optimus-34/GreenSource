import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import farmerRoutes from './routes/farmer.route';
import './config/db.config';  // Connect to MongoDB

const app = express();
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })  
); // Enable CORS

app.use(express.json());

app.use('/api', farmerRoutes);

export default app;