const express = require('express');
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, reminderController.setReminder);
router.get('/', authMiddleware, reminderController.getReminders);
router.delete('/:id', authMiddleware, reminderController.deleteReminder);

module.exports = router;