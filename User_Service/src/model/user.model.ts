import { Schema, Types, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new Schema({
    id: { type: String, default: uuidv4, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['producer', 'consumer', 'admin'], required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    addresses: [{ type: Types.ObjectId, ref: 'Address' }],
    is_verified: { type: Boolean, default: false },
}, { timestamps: true }); 

export default model('User', UserSchema);
