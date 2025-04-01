const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, companyController.addCompany);
router.get('/', authMiddleware, companyController.getCompanies); // Fetch companies for the company table
router.get('/:id', authMiddleware, companyController.getCompany);
router.put('/:id', authMiddleware, companyController.updateCompany);
router.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = router;