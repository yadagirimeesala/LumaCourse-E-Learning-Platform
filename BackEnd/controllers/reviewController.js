
const Review = require('../models/Review');

const addReview=async (req, res) => {
    const { comment, rating } = req.body;
    const { courseId } = req.params;

    try{
        const newReview=new Review({
            course: courseId,
            user: req.user._id,
            comment,
            rating,
        });
        await newReview.save();
        res.status(201).json({ message: 'Review added', review: newReview });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCourseReviews=async (req, res) => {
    const {courseId} = req.params;

    try{
        const reviews=await Review.find({course:courseId}).populate('user','name email').sort({createdAt:-1});
        if(!reviews || reviews.length===0){
            return res.status(404).json({message:'No reviews found for this course'});
        }
        res.status(200).json(reviews);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

module.exports={
    addReview,
    getCourseReviews,
};