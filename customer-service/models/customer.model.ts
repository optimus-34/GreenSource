import mongoose, { Schema, Document } from "mongoose";
import { Customer, Address } from "../types/customer";

const AddressSchema = new Schema<Address>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CustomerSchema = new Schema<Customer>(
  {
    email: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<Customer>(
  "Customer",
  CustomerSchema
);
