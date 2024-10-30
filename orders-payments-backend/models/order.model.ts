import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "../types/order";

const orderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  consumerId: { type: String, required: true },
  farmerId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  items: [
    {
      id: String,
      orderId: String,
      productId: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = model<IOrder>("Order", orderSchema);
