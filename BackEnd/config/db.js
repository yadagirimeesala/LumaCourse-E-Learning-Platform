const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    }catch(error){
        console.error('MongoDB connection error:',error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports=connectDB;
// This code defines a function to connect to a MongoDB database using Mongoose.
//  It handles connection errors and logs success or failure messages. 
// The function is exported for use in other parts of the application.