const Progress=require('../models/Progress');
const Course=require('../models/Course');
const User=require('../models/User');
const PDFDocument = require('pdfkit');


const getCertificate = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    try {
        const progress = await Progress.findOne({ user: userId, course: courseId });
        if(!progress || !progress.isCompleted){
            return res.status(404).json({ message: 'Certificate not available. Course not completed.' });
        }

        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        const certificate = {
            certificateId: `${userId.toString().slice(-4)}-${courseId.toString().slice(-4)}`,
            userName: user.name,
            courseTitle: course.title,
            completedAt: progress.completedAt,
        };

        return res.status(200).json(certificate);

    }catch(error){
        return res.status(500).json({ message: 'Failed to fetch certificate', error: error.message });
    }
};

const downloadCertificate = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    try {
        const progress = await Progress.findOne({ user: userId, course: courseId });
        if(!progress || !progress.isCompleted){
            return res.status(404).json({ message: 'Certificate not available. Course not completed.' });
        }

        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        const doc=new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('COntent-Disposition','attachment; filename=certificate.pdf');

        doc.pipe(res);

        doc.fontSize(26).text('Certificate of Completion', { align: 'center' }).moveDown();

        doc.fontSize(18).text(`This is to certify that`, { align: 'center' }).moveDown(0.5);

        doc.fontSize(22).text(user.name, { align: 'center' }).moveDown(0.5);

        doc.fontSize(18).text(`has successfully completed the course`, { align: 'center' }).moveDown(0.5);

        doc.fontSize(20).text(`"${course.title}"`, { align: 'center',italic:true }).moveDown(0.5);

        doc.fontSize(14).text(`Completion Date: ${new Date(progress.completedAt).toDateString()}`, { align: 'center' });

        doc.end();

    }catch(error){
        return res.status(500).json({ message: 'Failed to fetch certificate', error: error.message });
    }
}

module.exports = {
    getCertificate,
    downloadCertificate,
};