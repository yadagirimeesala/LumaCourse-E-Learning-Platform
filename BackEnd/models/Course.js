
const mongoose = require('mongoose'); 

const courseSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User', // Reference to the User model
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
    },
    image:{
        type:String,
    },
    lessons:[{
        title:{ type:String ,required:true},
        videoUrl:{ type:String ,required:true},
        description:{ type:String ,required:true},
        createdAt:{
            type:Date,
            default:Date.now,
        },
        quiz:[{
            question:{ type:String ,required:true},
            options:[{ type:String ,required:true}],
            correctAnswerIndex:{ type:Number ,required:true},
        }],
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Course=mongoose.model("Course",courseSchema);
module.exports=Course; 