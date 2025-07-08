const express = require('express');
const router = express.Router();
const {protect,authorizeRoles}=require('../middleware/authMiddleware');
const { getCertificate,downloadCertificate } = require('../controllers/certificateController');

router.get('/:courseId', protect, authorizeRoles('student'), getCertificate);
router.get('/:courseId/download', protect, authorizeRoles('student'), downloadCertificate);

module.exports = router;

