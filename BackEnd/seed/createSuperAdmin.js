const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const seedSuperAdmin=async()=>{ 
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const email='yadagiri@lumacourse.com';
        const existingUser=await User.findOne({email});

        if(existingUser){
            if(existingUser.role!=='superadmin'){
                existingUser.role='superadmin';
                await existingUser.save();
                console.log('Super admin role assigned to existing user');
        }else{
            console.log('Super admin already exists');
        }
    }else{
        const hashedPassword=await bcrypt.hash('Yadagiri@54321',10);

        const newUser=new User({
            name: 'Yadagiri',
            email,
            password: hashedPassword,
            role: 'superadmin',
        });
        await newUser.save();
        comsole.log('Super admin created successfully');
    }
    await mongoose.disconnect();
}catch(err){
    console.error('Error creating super admin:', err.message);
    await mongoose.disconnect();
    }
};

seedSuperAdmin();