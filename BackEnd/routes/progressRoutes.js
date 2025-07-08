const express = require('express');
const { updateProgress, getProgress,getCompletionStatus } = require('../controllers/progressController');

const { protect,authorizeRoles }=require('../middleware/authMiddleware');

const router = express.Router();

router.put('/update', protect, authorizeRoles('student'),updateProgress); 
router.get('/:courseId', protect,  authorizeRoles('student'),getProgress); 
router.get('/:courseId/status',protect,authorizeRoles('student'),getCompletionStatus);


module.exports = router;

