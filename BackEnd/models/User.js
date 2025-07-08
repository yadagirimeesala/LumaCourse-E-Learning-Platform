
//This file defines the schema for a user (like name, email, password, etc.) using Mongoose,
//  which helps structure and validate your MongoDB data.

const mongoose = require('mongoose'); // Importing mongoose to interact with MongoDB

const userSchema = new mongoose.Schema({
    name: {
        type: String, // Defining the name field as a string
        required: true, // Making it a required field
        trim: true // Trimming whitespace from the string
    },
    email: {
        type: String, // Defining the email field as a string
        required: true, // Making it a required field
        unique: true, // Ensuring the email is unique
        trim: true, // Trimming whitespace from the string
        lowercase: true // Converting the email to lowercase
    },
    password: {
        type: String, // Defining the password field as a string
        required: true, // Making it a required field
        minlength: 6 // Setting a minimum length for the password
    },
    role:{
        type:String,
        enum: ['student','instructor','admin','superadmin'], // Defining the role field with specific allowed values
        default: 'student',
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course' 
        }
    ],
    // progress:[
    //     {
    //         course:{
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:'Course'
    //         },
    //         completedLessons:[
    //             Number
    //         ],
    //     }
    // ],
}, {
    timestamps: true // Adding timestamps for createdAt and updatedAt fields
});
// Defining the user schema with fields for name, email, and password

const User=mongoose.model('User',userSchema); // Creating a model from the schema
module.exports=User; // Exporting the User model for use in other parts of the application
// This code defines a Mongoose schema for a user in a MongoDB database.