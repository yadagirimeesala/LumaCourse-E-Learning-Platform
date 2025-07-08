const Progress = require('../models/Progress.js');
const Course = require('../models/Course.js');

const updateProgress = async (req, res) => {
    const userId = req.user._id;
    const { courseId, lessonNumber } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if(lessonNumber < 0 || lessonNumber >= course.lessons.length){
            return res.status(400).json({ message: 'Invalid lesson number' });
        }

        let progress = await Progress.findOne({ user: userId, course: courseId });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: courseId,
                completedLessons: [lessonNumber],
            });
        } else {
            if (!progress.completedLessons.includes(lessonNumber)) {
                progress.completedLessons.push(lessonNumber);
            }
        }

        progress.completedLessons=progress.completedLessons.filter((num)=> num>=0 && num<course.lessons.length);

        const totalLessons = course.lessons.length;
        if (progress.completedLessons.length === totalLessons) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
        }
        else{
            progress.isCompleted = false;
            progress.completedAt = null;
        }

        await progress.save();
        res.status(200).json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update progress', error: error.message });
    }
};


const getProgress = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    try {
        const progress = await Progress.findOne({ user: userId, course: courseId });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.json(progress);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
    }
};

const getCompletionStatus = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const progress = await Progress.findOne({ user: userId, course: courseId });
        if (!progress) {
            return res.status(404).json({ isCompleted: false, lessonsCompleted: 0, totalLessons: course.lessons.length,completedAt:null });
        }

        const isCompleted = progress.isCompleted || false;
        const completedAt=progress.completedAt || null;

        res.status(200).json({
            isCompleted,
            lessonsCompleted: progress.completedLessons.length,
            totalLessons: course.lessons.length,
            completedAt,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch completion status', error: error.message });
    }


};

module.exports = {
    updateProgress,
    getProgress,
    getCompletionStatus,
};