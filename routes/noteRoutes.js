const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, noteController.addNote);
router.get('/', authMiddleware, noteController.getNotes);
router.delete('/:id', authMiddleware, noteController.deleteNote);

module.exports = router;