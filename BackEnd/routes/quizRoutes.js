const express = require('express');
const router =express.Router();
const {addQuizToLesson,getQuizFromLesson,submitQuiz,editQuizQuestion,deleteQuizQuestion} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:courseId/lessons/:lessonId/quiz', protect, addQuizToLesson);

router.get('/:courseId/lessons/:lessonId/quiz', protect, getQuizFromLesson);
router.post('/:courseId/lessons/:lessonId/quiz/submit', protect, submitQuiz);
router.put('/:courseId/lessons/:lessonId/quiz/:questionIndex', protect, editQuizQuestion);
router.delete('/:courseId/lessons/:lessonId/quiz/:questionIndex', protect, deleteQuizQuestion);

module.exports=router;