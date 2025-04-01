const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', authController.signUp);

// Route for user login
router.post('/login', authController.logIn);

router.put('/profile', authMiddleware, authController.updateProfile);

router.get('/profile', authMiddleware, authController.getProfile); // Add this route

module.exports = router;
