import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery extends Document {
  orderId: String;
  farmerId: String;
  customerId: String;
  agentId: String;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED";
  deliveryLocation: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      ref: "Order",
    },
    farmerId: {
      type: String,
      required: true,
      ref: "Farmer",
    },
    customerId: {
      type: String,
      required: true,
      ref: "Customer",
    },
    agentId: {
      type: String,
      ref: "DeliveryAgent",
    },
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "PICKED_UP", "DELIVERED"],
      default: "PENDING",
    },
    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
DeliverySchema.index({ deliveryLocation: "2dsphere" });

export default mongoose.model<IDelivery>("Delivery", DeliverySchema);
