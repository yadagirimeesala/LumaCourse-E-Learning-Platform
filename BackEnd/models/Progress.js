const mongoose = require('mongoose'); 

const progressSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        completedLessons:[Number],
        isCompleted:{
            type:Boolean,
            default: false
        },
        completedAt:{
            type:Date,
            default: null
        },
        updatedAt:{
            type:Date,
            default: Date.now
        },
    },
    {
        timestamps: true 
    }
);


const Progress=mongoose.model('Progress',progressSchema); 
module.exports=Progress;