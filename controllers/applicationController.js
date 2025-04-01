const Application = require('../models/application');
const Company = require('../models/company');
const { Op } = require('sequelize'); // Import Sequelize operators

exports.logApplication = async (req, res) => {
    console.log('Request body:', req.body); // Debugging log

    if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Request body is empty or undefined.');
        return res.status(400).json({ error: 'Request body is required and cannot be empty.' });
    }

    const { jobTitle, applicationDate, status, notes, companyId } = req.body;

    if (!jobTitle || !applicationDate || !status || !companyId) {
        console.error('Missing required fields:', { jobTitle, applicationDate, status, companyId }); // Log missing fields
        return res.status(400).json({ error: 'All fields are required: jobTitle, applicationDate, status, companyId.' });
    }

    try {
        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(400).json({ error: `Invalid companyId: Company with ID ${companyId} does not exist.` });
        }

        const application = await Application.create({
            jobTitle,
            applicationDate,
            status,
            notes,
            companyId,
            userId: req.user.userId,
        });

        res.status(201).json({ message: 'Application logged successfully', application });
    } catch (err) {
        console.error('Error logging application:', err.message);
        res.status(500).json({ error: 'Failed to log application' });
    }
};

exports.getApplications = async (req, res) => {
    try {
        console.log('Fetching applications for user:', req.user.userId); // Debugging log

        const applications = await Application.findAll({
            where: { userId: req.user.userId }, // Fetch only the logged-in user's applications
            include: [{ model: Company, attributes: ['name'] }], // Include company details
        });

        if (!applications) {
            console.log('No applications found for user:', req.user.userId); // Debugging log
            return res.status(404).json({ error: 'No applications found.' });
        }

        console.log('Applications fetched successfully:', applications); // Debugging log
        res.status(200).json(applications);
    } catch (err) {
        console.error('Error fetching applications:', err.message); // Log the error
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
            include: [{ model: Company, attributes: ['name'] }], // Include company details
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        res.status(200).json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch application' });
    }
};

exports.updateApplication = async (req, res) => {
    const { jobTitle, applicationDate, status, notes, companyId } = req.body;

    try {
        const application = await Application.findOne({
            where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        // Validate companyId
        if (companyId) {
            const company = await Company.findByPk(companyId);
            if (!company) {
                return res.status(400).json({ error: `Invalid companyId: Company with ID ${companyId} does not exist.` });
            }
        }

        // Update application details
        application.jobTitle = jobTitle || application.jobTitle;
        application.applicationDate = applicationDate || application.applicationDate;
        application.status = status || application.status;
        application.notes = notes || application.notes;
        application.companyId = companyId || application.companyId;

        await application.save();
        res.status(200).json({ message: 'Application updated successfully', application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update application' });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        await application.destroy();
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete application' });
    }
};

exports.searchApplications = async (req, res) => {
    const { keyword, status, dateRange } = req.query;

    try {
        const where = { userId: req.user.userId };
        if (keyword) {
            where.jobTitle = { [Op.like]: `%{keyword}%` };
        }
        if (status) {
            where.status = status;
        }
        if (dateRange) {
            const [startDate, endDate] = dateRange.split(',');
            where.applicationDate = { [Op.between]: [startDate, endDate] };
        }

        const applications = await Application.findAll({ where });
        res.send(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to search applications' });
    }
};

exports.uploadAttachment = async (req, res) => {
    const applicationId = req.params.id;

    try {
        const application = await Application.findOne({
            where: { id: applicationId, userId: req.user.userId }, // Ensure the application belongs to the user
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        application.filePath = req.file.path; // Save the file path
        await application.save();

        res.status(200).json({ message: 'File uploaded successfully', application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};