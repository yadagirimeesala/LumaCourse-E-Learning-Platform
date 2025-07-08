const express = require('express');
const router = express.Router();
const { protect, authorizeRoles, authorizeSuperAdmin } = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// @desc Register a new user
// @route POST /api/users/register
// @access Public
router.post('/register', registerUser);

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
router.post('/login', loginUser);

//protected user profile route
router.get("/profile", protect, (req, res) => {
  res.json({ message: `Hello user ${req.user.name}, this is a protected route!` });
});

//INstructor only route
router.get('/instructor', protect, authorizeRoles('instructor'), (req, res) => {
  res.json({ message: `Hello instructor ${req.user.name}` });
});

router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Hello admin ${req.user.name}` });
});



// @desc Create a new admin user
router.post('/create-admin', protect, authorizeRoles('superadmin'), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();

    res.status(201).json({
      message: 'Admin user created successfully', user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//promote or demote user
router.put('/update-role/:id',protect,authorizeSuperAdmin,async(req,res)=>{
  const { role } = req.body;

  if(!['student', 'instructor', 'admin','superadmin'].includes(role)){
    return res.status(400).json({message:'Invalid role'});
  }

  try{
    const user=await User.findById(req.params.id);
    if(!user) return res.status(404).json({message:'User not found'});

    if(user.role==='superadmin' && role!=='superadmin'){
      return res.status(403).json({message:'You cannot demote a super admin'});
    }

    if(role==='superadmin' && user.role!=='superadmin'){
      return res.status(403).json({message:'You cannot promote a user to super admin'});
    }

    user.role=role;
    await user.save();

    res.json({message:`${user.name} role updated to ${role}`});

  }catch(error){
    res.status(500).json({message:'Server error',error:error.message});
  }
});


router.get('/admin/dashboard', protect, authorizeSuperAdmin, (req, res) => {
    res.json({ message: "Welcome, Super Admin!" });
});


// Get all users (superadmin only)
router.get("/all", protect, authorizeRoles("superadmin"), async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// router.get('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

module.exports = router;

