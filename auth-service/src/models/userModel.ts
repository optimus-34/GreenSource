import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    org_id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

const userSchema: Schema = new Schema({
    org_id: { type: Number, required: true },
    username: { type: String, required: true, unique : true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,enum: ['admin', 'farmer', 'consumer'], required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;



