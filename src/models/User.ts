import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN'],
    },
}, {
    timestamps: true,
});

const User = models.User || model('User', UserSchema);

export default User;
