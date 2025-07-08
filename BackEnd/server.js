
const express = require('express');
const cors = require('cors'); // Importing the cors module for Cross-Origin Resource Sharing and security and also to allow cross-origin requests
const dotenv=require('dotenv'); 
const connectDB=require('./config/db'); // Importing the database connection function from the config directory
const userRoutes= require('./routes/userRoutes');
const courseRoutes= require('./routes/courseRoutes'); 
const reviewRoutes= require('./routes/reviewRoutes'); 
const commentRoutes= require('./routes/commentRoutes'); 
const progressRoutes= require('./routes/progressRoutes');
const certificateRoutes= require('./routes/certificateRoutes'); 
const quizRoutes= require('./routes/quizRoutes');


dotenv.config(); // Loading environment variables from the .env file into process.env

const app = express(); // Creating an instance of the express application

app.use(cors()); // Using the cors middleware to enable CORS for all routes
app.use(express.json()); // Using the express.json middleware to parse JSON request bodies

app.use('/api/users',userRoutes);
app.use('/api/courses',courseRoutes); 
app.use('/api/reviews',reviewRoutes); 
app.use('/api/comments',commentRoutes);
app.use('/api/progress',progressRoutes); 
app.use('/api/certificate',certificateRoutes); 
app.use('/api/courses',quizRoutes); 

// Importing routes from the routes directory
app.get('/', (req, res) => {
    res.send('Welcome to LumaCourse Backend '); // Sending a simple response for the root route
}); // Defining a root route that responds with a welcome message

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

connectDB();

const PORT = process.env.PORT || 5000; // Setting the port to the value from the environment variable or defaulting to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`); // Logging a message to the console when the server starts
}); // Starting the server and listening on the specified port