import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryAgent {
  name: string;
  email: string;
  phoneNumber: string;
  serviceLocations: string[]; // Array of city names
  deliveredOrders: string[]; // Array of order IDs
  isAvailable: boolean;
}

const DeliveryAgentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    serviceLocations: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 5,
        "Maximum 5 service locations allowed",
      ],
    },
    deliveredOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDeliveryAgent>(
  "DeliveryAgent",
  DeliveryAgentSchema
);
