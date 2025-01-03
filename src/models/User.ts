import { Schema, model, type Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

interface IUser extends Document {
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[], 
    friends: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) => isEmail(value),  
                message: props => `${props.value} is not a valid email address!`,
            },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        timestamps: true
    },
);

// Create a virtual property `friendCount` that gets the amount of friends per user
userSchema.virtual('friendCount').get(function () {
    return this.friends?.length;
  });

// Create a virtual property `thoughtCount` that gets the amount of friends per user
userSchema.virtual('thoughtCount').get(function () {
    return this.thoughts?.length;
  });

//Initialize our User model
const User = model<IUser>('User', userSchema);

export default User;
