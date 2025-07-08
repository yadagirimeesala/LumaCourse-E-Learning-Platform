
const Course=require('../models/Course');
const User=require('../models/User');

const createCourse = async (req, res) => {
    const { title, description, price,category, image } = req.body;

    try {
        const existingCourse = await Course.findOne({ title : {$regex : `^${title.trim()}$`,}});
        if(existingCourse){
            return res.status(400).json({ message: 'Course with this title already exists' });
        }
        const newCourse = new Course({
            title,
            description,
            instructor: req.user._id,
            price,
            category,
            imageUrl: image,
        });

        const saved = await newCourse.save();
        res.status(201).json(saved);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const course = await Course.find().populate('instructor', 'name email role');
        res.json(course);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try{
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
}
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

//Update a course
const updateCourse = async (req, res) => {
    const {title, description, category, image} = req.body;
    try{
        const course=await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({message:'Course not found'});
        }
        if(course.instructor.toString()!== req.user._id.toString()){
            return res.status(403).json({message:'You are not authorized to update this course'});
        }

        course.title=title || course.title;
        course.description=description || course.description;
        course.category=category || course.category;
        course.imageUrl=image || course.imageUrl;
        const updated =await course.save();
        res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Delete a course
const deleteCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user info' });
        }
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this course' });
        }
        await course.deleteOne();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: error.message });
    }
};

const addLessonToCourse= async (req, res) => {
    const { courseId }= req.params;
    const { title, videoUrl, description } = req.body;
    try{
        const course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:'Course not found'});
        }

        if(course.instructor.toString()!== req.user._id.toString()){
            return res.status(403).json({message:'You are not authorized to add lessons to this course'});
        }

        const duplicate=course.lessons.find(lesson=>lesson.title.trim().toLowerCase()===title.trim().toLowerCase());
        if(duplicate){
            return res.status(400).json({message:'Lesson with this title already exists'});
        }
        const newLesson={
            title,
            videoUrl,
            description
        };
        course.lessons.push(newLesson);
        await course.save();
        res.status(201).json({message:'Lesson added successfully', lesson:newLesson});
    }catch(error){
        return res.status(500).json({message:'server error', error:error.message});
    }
};

const deleteLessonInCourse= async (req, res) => {
    const { courseId, lessonId }= req.params;
    try{
        const course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:'Course not found'});
        }
        if(course.instructor.toString()!== req.user._id.toString()){
            return res.status(403).json({message:'You are not authorized to delete lessons from this course'});
        }
        const lesson=course.lessons.id(lessonId);
        if(!lesson){
            return res.status(404).json({message:'Lesson not found'});
        }
        // lesson.remove();
        course.lessons.pull({_id: lessonId});
        await course.save();
        res.json({message:'Lesson deleted successfully'});
    }
    catch(error){
        return res.status(500).json({message:'server error', error:error.message});
    }
};

const getLessonsFromCourse= async (req, res) => {
    const { courseId }= req.params;
    try{
        const course= await Course.findById(courseId);
        if (!course){
            return res.status(404).json({message:'Course not found'});
        }
        res.status(200).json(course.lessons);
    }catch(error){
        return res.status(500).json({message:'server error', error:error.message});
    }
};

const editLessonInCourse=async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { title, videoUrl, description } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to edit lessons in this course' });
        }
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        // Prevent duplicate lesson titles (except for this lesson)
        const duplicate = course.lessons.find(
            l => l._id.toString() !== lessonId && l.title.trim().toLowerCase() === title.trim().toLowerCase()
        );
        if (duplicate) {
            return res.status(400).json({ message: 'Lesson with this title already exists' });
        }
        lesson.title = title || lesson.title;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        lesson.description = description || lesson.description;
        await course.save();
        res.status(200).json({ message: 'Lesson updated successfully', lesson });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }

}

const enrollInCourse= async (req, res) => {
    const { courseId }= req.params;
    try{
        const course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:'Course not found'});
        }

        const student=await User.findById(req.user._id);

        if(student.enrolledCourses.includes(courseId)){
            return res.status(400).json({message:'You are already enrolled in this course'});
        }

        student.enrolledCourses.push(courseId);
        await student.save();
        res.status(200).json({message:'Enrolled successfully', course});
    }catch(error){
        return res.status(500).json({message:'server error', error:error.message});
    }
};


const getEnrolledCourses= async (req, res) => {
    try{
        const studentId=req.user._id;

        const student=await User.findById(studentId).populate('enrolledCourses');

        if(!student){
            return res.status(404).json({message:'Student not found'});
        }

        res.status(200).json({enrolledCourses:student.enrolledCourses});

    }catch(error){
        return res.status(500).json({message:'Failed to fetch enrolled courses', error:error.message});
    }

};

const getStudentsInCourse = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const courseId = req.params.courseId;
        const course = await Course.findOne({ _id: courseId, instructor: instructorId });
        if (!course) {
            return res.status(404).json({ message: 'you are not the instructor' });
        }

        const students = await User.find({ enrolledCourses: courseId }).select('name email');
        res.status(200).json({ courseTitle: course.title, students });

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch students', error: error.message });
    }
}




module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addLessonToCourse,
    getLessonsFromCourse,
    enrollInCourse,
    getEnrolledCourses,
    getStudentsInCourse,
    editLessonInCourse,
    deleteLessonInCourse,
};





