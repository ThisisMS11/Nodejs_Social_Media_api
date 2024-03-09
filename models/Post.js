import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    postString: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: 5000
    },
    user: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export default model('Posts', PostSchema);