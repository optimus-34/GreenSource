import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
<<<<<<< HEAD
    
=======
>>>>>>> d6e3f3e4ffe0b1439bda2b1c205e81cbc7419388
    username: string;
    email: string;
    password: string;
    role: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique : true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,enum: ['admin', 'farmer', 'consumer'], required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;



