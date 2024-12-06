import { Schema, Types, model, type Document } from 'mongoose';
import moment from 'moment';

interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId,
    reactionBody: string,
    createdAt: Schema.Types.Date, 
    username: string
}

interface IThought extends Document {
    createdAt: Schema.Types.Date,
    thoughtText: string,
    username: string,
    reactions: [typeof reactionSchema]
}


const reactionSchema = new Schema<IReaction>({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
    reactionBody: {
        type: String,
        required: true,
        max_length: 200,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        get: (timestamp: Date): string => moment(timestamp).format('YYYY-MM-DD'), 
    },
},
    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);

const thoughtSchema = new Schema<IThought>(
    {
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (timestamp: Date): string => moment(timestamp).format('YYYY-MM-DD'), 
        },
        thoughtText: {
            type: String,
            required: true,
            maxlength: 200,
            minlength: 1,
            default: 'Blank Thought',
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        timestamps: true
    }
);




// Create a virtual property `friendCount` that gets the amount of friends per user
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions?.length;
  });


const Thought = model('thought', thoughtSchema);

export default Thought;
