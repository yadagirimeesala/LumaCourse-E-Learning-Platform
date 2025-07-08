const bcrypt = require('bcryptjs'); // Importing the bcryptjs library for hashing passwords
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken library for creating and verifying JSON Web Tokens
const User = require('../models/User');

//@desc Register a new user
//@route POST /api/users/register
//@access Public

const registerUser = async (req, res) => {
    let { name, email, password,role } = req.body; // Destructuring the request body to get name, email, and password

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email }); // Searching for a user with the same email in the database
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' }); // If the user exists, send a 400 response
        }

        const allowedRoles = ['student', 'instructor'];
        if(!allowedRoles.includes(role)){
            role='student';
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generating a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hashing the password with the generated salt

        // Create a new user
        const newUser = new User(
            {
                name,
                email,
                password: hashedPassword, // Storing the hashed password instead of the plain text password
                role: role 
            }
        );

        await newUser.save(); // Saving the new user to the database

        // Create a token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        }); // Creating a JWT token with the user's ID and a secret key

        res.status(201).json({
            _id: newUser._id, // Sending the user's ID in the response
            name: newUser.name, // Sending the user's n6ame in the response
            email: newUser.email, // Sending the user's email in the response
            token, // Sending the token in the response
        }); // Sending a 201 response indicating that the user was created successfully
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error', // Sending a 500 response if there was a server error
            error: error.message, // Sending the error message in the response
        }); // Sending a 500 response indicating that there was a server error

    }
};

//@desc Authenticate a user
//@route POST /api/users/login
//@access Public

const loginUser = async (req, res) => {
    const { email, password } = req.body; // Destructuring the request body to get email and password

    try {
        const user = await User.findOne({ email }); // Searching for a user with the same email in the database

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // If the user does not exist, send a 400 response
        }

        const isMatch = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password in the database
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // If the passwords do not match, send a 400 response
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        }); // Creating a JWT token with the user's ID and a secret key

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message,
        });
    } // Sending a 500 response if there was a server error

};


module.exports={
    registerUser,
    loginUser,
}

