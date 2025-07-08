
const mongoose = require('mongoose'); 

const reviewSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;