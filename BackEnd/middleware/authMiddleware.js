const jwt= require('jsonwebtoken');
const User = require('../models/User'); 

const protect = async (req, res, next) => {
    const authHeader=req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer')){
        try{
            const token=authHeader.split(' ')[1]; 
            const decoded=jwt.verify(token,process.env.JWT_SECRET); 

            const user=await User.findById(decoded.id).select('-password');
            if(!user){
                return res.status(401).json({message:'User not found'}); 
            }
            req.user=user; 
            next(); 
        }catch(error){
            return res.status(401).json({message:'Not authorized, token failed'}); 
        }
    }else{
        return res.status(401).json({message:'Not authorized, no token'}); 
    }
};

const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:`Access denied for Role ${req.user?.role}`});  
        }
        next(); 
    }

};

const isStudent=(req,res,next)=>{
    if(req.user && req.user.role === 'student'){
        return next(); 
    }   
    else{
        return res.status(403).json({message:`Access denied for Role ${req.user?.role},only students can perform this action`});  
    }
};

const authorizeSuperAdmin=(req,res,next)=>{
    if(!req.user || req.user.role !== 'superadmin'){
        return res.status(403).json({message:`Access denied for Role ${req.user?.role}`});  
    }
    next();
};

const protectInstructor=(req,res,next)=>{
    if(req.user && req.user.role === 'instructor'){
        return next(); 
    }
    else{
        return res.status(403).json({message:`Access denied for Role ${req.user?.role},only instructors can perform this action`});  
    }

};

module.exports={protect,
    authorizeRoles,
    authorizeSuperAdmin,
    protectInstructor,
    isStudent,
}; 