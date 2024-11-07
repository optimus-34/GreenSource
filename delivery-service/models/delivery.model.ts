import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery {
  orderId: string;
  farmerId: string;
  consumerId: string;
  farmerPhoneNumber: string;
  consumerPhoneNumber: string;
  deliveryAgentId?: string;
  orderPrice: number;
  deliveryAddress: string;
  pickupAddress: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    farmerId: {
      type: String,
      required: true,
    },
    consumerId: {
      type: String,
      required: true,
    },
    farmerPhoneNumber: {
      type: String,
      required: true,
    },
    consumerPhoneNumber: {
      type: String,
      required: true,
    },
    deliveryAgentId: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryAgent',
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "PICKED_UP", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDelivery>("Delivery", DeliverySchema);
