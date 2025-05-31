const express = require('express');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads/' directory

// Log a new application
router.post('/', authMiddleware, applicationController.logApplication);

// Fetch all applications
router.get('/', authMiddleware, applicationController.getApplications); // Ensure this route is defined

// Fetch a specific application
router.get('/:id', authMiddleware, applicationController.getApplication);

// Update an application
router.put('/:id', authMiddleware, applicationController.updateApplication);

// Delete an application
router.delete('/:id', authMiddleware, applicationController.deleteApplication);

// Upload a file related to an application
router.post('/:id/upload', authMiddleware, upload.single('attachment'), applicationController.uploadAttachment);

module.exports = router;