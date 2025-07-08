

const express = require('express');
const { createComment, getCommentsByCourse } = require('../controllers/commentController');
const { authorizeRoles, protect}=require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:courseId', protect, createComment);
router.get('/:courseId', protect, getCommentsByCourse);

module.exports = router;
