import express from "express";
import mongoose from "mongoose";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.route";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/orders-payments";

// Middleware
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
