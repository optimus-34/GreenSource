import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.route';
import connectDB from './utils/db';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', productRoutes);

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/farm-products')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;