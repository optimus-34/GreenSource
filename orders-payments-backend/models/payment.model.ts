import { Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "../types/payment";

const paymentSchema = new Schema<IPayment>({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = model<IPayment>("Payment", paymentSchema);
