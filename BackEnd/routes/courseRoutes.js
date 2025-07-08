const express = require('express');
const {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse} = require('../controllers/courseController');
const {protect, protectInstructor, authorizeRoles} = require('../middleware/authMiddleware');
const { addLessonToCourse, getLessonsFromCourse,getStudentsInCourse,getEnrolledCourses,enrollInCourse,editLessonInCourse,deleteLessonInCourse} = require('../controllers/courseController');

const router=express.Router();

router.post('/',protect,protectInstructor,createCourse);
router.put('/:id',protect,protectInstructor,updateCourse);
router.delete('/:id',protect,protectInstructor,deleteCourse);
router.post('/:courseId/lessons', protect, protectInstructor, addLessonToCourse);
router.get('/:courseId/lessons', protect, getLessonsFromCourse);
router.put('/:courseId/lessons/:lessonId',protect, protectInstructor, editLessonInCourse);  
router.post('/:courseId/enroll', protect, authorizeRoles('student'), enrollInCourse);
router.get('/my-courses', protect, authorizeRoles('student'), getEnrolledCourses);
router.get('/',getAllCourses);
router.get('/:courseId/students', protect, protectInstructor, getStudentsInCourse);
router.get('/:id',getCourseById);
router.delete('/:courseId/lessons/:lessonId', protect, protectInstructor, deleteLessonInCourse);





module.exports=router;