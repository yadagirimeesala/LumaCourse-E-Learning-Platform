
const express=require('express');
const { addReview,getCourseReviews } = require('../controllers/reviewController');
const { protect,isStudent } = require('../middleware/authMiddleware');

const router=express.Router();

router.post('/:courseId',protect,isStudent,addReview);

router.get('/:courseId',getCourseReviews);

module.exports=router;