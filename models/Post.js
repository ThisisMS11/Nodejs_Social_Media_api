const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postString: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: 5000
    },
    user: {
        type: mongoose.Schema.ObjectId,
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

module.exports = mongoose.model('Posts', PostSchema);