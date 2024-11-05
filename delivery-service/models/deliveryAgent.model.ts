import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryAgent extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAvailable: boolean;
  currentLocation: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  serviceLocations: Array<{
    name: string;
    coordinates: [number, number];
    radius: number; // radius in kilometers
  }>;
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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
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
    serviceLocations: [{
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      radius: {
        type: Number,
        required: true,
        default: 5, // 5km radius
      }
    }]
  },
  { timestamps: true }
);

// Create geospatial index for current location
DeliveryAgentSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model<IDeliveryAgent>("DeliveryAgent", DeliveryAgentSchema); 