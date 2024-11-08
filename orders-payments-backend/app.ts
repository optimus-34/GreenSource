import express from "express";
import mongoose from "mongoose";
import orderRoutes from "./routes/order.route";
// import paymentRoutes from "./routes/payment.route";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
