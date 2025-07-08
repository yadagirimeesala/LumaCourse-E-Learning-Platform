const Comment = require('../models/Comment');

const createComment = async (req, res) => {
    try{
        const { content }= req.body;
        const { courseId }=req.params;

        const comment=new Comment({
            content,
            course: courseId,
            user: req.user._id,
        });
        await comment.save();
        res.status(201).json({ message: 'Comment added', comment });
    }catch (error) {
        return res.status(500).json({ message:'Failed to add comment',error: error.message });
    }
};

const getCommentsByCourse=async (req, res) => {
    try{
        const { courseId}=req.params;

        const comments=await Comment.find({ course: courseId }).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(comments);
    }catch(error){
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }

};

module.exports={
    createComment,
    getCommentsByCourse,
};