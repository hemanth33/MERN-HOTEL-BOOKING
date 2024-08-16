import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { UserType } from '../shared/types';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
},
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if(this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model<UserType>('User', userSchema);
export default User;