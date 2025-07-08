const Course = require('../models/Course');

const addQuizToLesson = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { question, options, correctAnswerIndex } = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to add quiz to this course' });
        }

        if (!course.lessons.id(lessonId)) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const quizItem = {
            question,
            options,
            correctAnswerIndex
        };
        course.lessons.id(lessonId).quiz = course.lessons.id(lessonId).quiz || [];
        course.lessons.id(lessonId).quiz.push(quizItem);

        await course.save();
        return res.status(200).json({ message: 'Quiz added successfully', course });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add quiz', error: error.message });
    }
};

const getQuizFromLesson = async (req, res) => {
    const { courseId, lessonId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json(lesson.quiz || []);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get quiz', error: error.message });
    }
};

const submitQuiz = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body;

    try {

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        let score = 0;
        lesson.quiz.forEach((quizItem, index) => {
            if (quizItem.correctAnswerIndex === answers[index]) {
                score++;
            }
        });

        res.json({score,total: lesson.quiz.length});
        
    } catch (error) {
        return res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
    }

};

// Edit a quiz question
const editQuizQuestion = async (req, res) => {
    const { courseId, lessonId, questionIndex } = req.params;
    const { question, options, correctAnswerIndex } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const lesson = course.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        if (!lesson.quiz[questionIndex]) return res.status(404).json({ message: 'Quiz question not found' });

        lesson.quiz[questionIndex] = { question, options, correctAnswerIndex };
        await course.save();
        res.json({ message: 'Quiz question updated', quiz: lesson.quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a quiz question
const deleteQuizQuestion = async (req, res) => {
    const { courseId, lessonId, questionIndex } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const lesson = course.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        if (!lesson.quiz[questionIndex]) return res.status(404).json({ message: 'Quiz question not found' });

        lesson.quiz.splice(questionIndex, 1);
        await course.save();
        res.json({ message: 'Quiz question deleted', quiz: lesson.quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addQuizToLesson,
    getQuizFromLesson,
    submitQuiz,
    editQuizQuestion,
    deleteQuizQuestion
}