const Application = require('../models/application');
const { ObjectId } = require('mongodb');

// Log a new application
exports.logApplication = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is required and cannot be empty.' });
    }

    const { jobTitle, applicationDate, status, notes, filePath } = req.body;

    if (!jobTitle || !applicationDate || !status) {
        return res.status(400).json({ error: 'Fields jobTitle, applicationDate, and status are required.' });
    }

    try {
        const application = new Application(jobTitle, applicationDate, status, notes, filePath, req.user.userId);
        await application.save();

        res.status(201).json({ message: 'Application logged successfully' });
    } catch (err) {
        console.error('Error saving application:', err.message);
        res.status(500).json({ error: 'Failed to log application' });
    }
};

// Get all applications for a user
exports.getApplications = async (req, res) => {
    try {
        const applications = await Application.findAllByUser(req.user.userId);
        res.status(200).json(applications || []);
    } catch (err) {
        console.error('Error fetching applications:', err.message);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// Get a specific application by ID
exports.getApplication = async (req, res) => {
    const id = req.params.id;

    try {
        const application = await Application.findById(new ObjectId(id));

        if (!application || application.userId !== req.user.userId) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        res.status(200).json(application);
    } catch (err) {
        console.error('Error fetching application:', err.message);
        res.status(500).json({ error: 'Failed to fetch application' });
    }
};

// Update an application
exports.updateApplication = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const existingApp = await Application.findById(new ObjectId(id));
        if (!existingApp || existingApp.userId !== req.user.userId) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        await Application.updateById(new ObjectId(id), updatedData);
        res.status(200).json({ message: 'Application updated successfully' });
    } catch (err) {
        console.error('Error updating application:', err.message);
        res.status(500).json({ error: 'Failed to update application' });
    }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
    const id = req.params.id;

    try {
        const existingApp = await Application.findById(new ObjectId(id));
        if (!existingApp || existingApp.userId !== req.user.userId) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        await Application.deleteById(new ObjectId(id));
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error('Error deleting application:', err.message);
        res.status(500).json({ error: 'Failed to delete application' });
    }
};

// Upload a file attachment to an application
exports.uploadAttachment = async (req, res) => {
    const applicationId = req.params.id;

    try {
        const application = await Application.findById(new ObjectId(applicationId));

        if (!application || application.userId !== req.user.userId) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        await Application.updateById(new ObjectId(applicationId), {
            filePath: req.file.path,
        });

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

// Optional: Search applications by keyword, status, or date range
exports.searchApplications = async (req, res) => {
    const { keyword, status, dateRange } = req.query;
    const userId = req.user.userId;

    const db = require('../config/db').getdb();
    const filter = { userId };

    if (keyword) {
        filter.jobTitle = { $regex: keyword, $options: 'i' };
    }
    if (status) {
        filter.status = status;
    }
    if (dateRange) {
        const [start, end] = dateRange.split(',');
        filter.applicationDate = {
            $gte: new Date(start),
            $lte: new Date(end),
        };
    }

    try {
        const applications = await db.collection('applications').find(filter).toArray();
        res.status(200).json(applications);
    } catch (err) {
        console.error('Error searching applications:', err.message);
        res.status(500).json({ error: 'Failed to search applications' });
    }
};


// const Application = require('../models/application');
// const Company = require('../models/company');
// const { Op } = require('sequelize'); // Import Sequelize operators

// exports.logApplication = async (req, res) => {
//     console.log('Request body:', req.body); // Debugging log

//     if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).json({ error: 'Request body is required and cannot be empty.' });
//     }

//     const { jobTitle, applicationDate, status, notes } = req.body;

//     if (!jobTitle || !applicationDate || !status) {
//         return res.status(400).json({ error: 'All fields are required: jobTitle, applicationDate, status.' });
//     }

//     try {
//         const application = await Application.create({
//             jobTitle,
//             applicationDate,
//             status,
//             notes,
//             userId: req.user.userId, // Ensure the application is associated with the logged-in user
//         });

//         res.status(201).json({ message: 'Application logged successfully', application });
//     } catch (err) {
//         console.error('Error logging application:', err.message);
//         res.status(500).json({ error: 'Failed to log application' });
//     }
// };

// exports.getApplications = async (req, res) => {
//     try {
//         const applications = await Application.findAll({
//             where: { userId: req.user.userId }, // Fetch only the logged-in user's applications
//         });

//         if (!applications || applications.length === 0) {
//             return res.status(404).json({ error: 'No applications found.' });
//         }

//         res.status(200).json(applications);
//     } catch (err) {
//         console.error('Error fetching applications:', err.message); // Log the error
//         res.status(500).json({ error: 'Failed to fetch applications' });
//     }
// };

// exports.getApplication = async (req, res) => {
//     try {
//         const application = await Application.findOne({
//             where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
//         });

//         if (!application) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         res.status(200).json(application);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to fetch application' });
//     }
// };

// exports.updateApplication = async (req, res) => {
//     const { jobTitle, applicationDate, status, notes } = req.body; // Removed companyName

//     try {
//         const application = await Application.findOne({
//             where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
//         });

//         if (!application) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         // Update application details
//         application.jobTitle = jobTitle || application.jobTitle;
//         application.applicationDate = applicationDate || application.applicationDate;
//         application.status = status || application.status;
//         application.notes = notes || application.notes;

//         await application.save();
//         res.status(200).json({ message: 'Application updated successfully', application });
//     } catch (err) {
//         console.error('Error updating application:', err.message);
//         res.status(500).json({ error: 'Failed to update application' });
//     }
// };

// exports.deleteApplication = async (req, res) => {
//     try {
//         const application = await Application.findOne({
//             where: { id: req.params.id, userId: req.user.userId }, // Ensure the application belongs to the user
//         });

//         if (!application) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         await application.destroy();
//         res.status(200).json({ message: 'Application deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to delete application' });
//     }
// };

// exports.searchApplications = async (req, res) => {
//     const { keyword, status, dateRange } = req.query;

//     try {
//         const where = { userId: req.user.userId };
//         if (keyword) {
//             where.jobTitle = { [Op.like]: `%{keyword}%` };
//         }
//         if (status) {
//             where.status = status;
//         }
//         if (dateRange) {
//             const [startDate, endDate] = dateRange.split(',');
//             where.applicationDate = { [Op.between]: [startDate, endDate] };
//         }

//         const applications = await Application.findAll({ where });
//         res.send(applications);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to search applications' });
//     }
// };

// exports.uploadAttachment = async (req, res) => {
//     const applicationId = req.params.id;

//     try {
//         const application = await Application.findOne({
//             where: { id: applicationId, userId: req.user.userId }, // Ensure the application belongs to the user
//         });

//         if (!application) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded.' });
//         }

//         application.filePath = req.file.path; // Save the file path
//         await application.save();

//         res.status(200).json({ message: 'File uploaded successfully', application });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to upload file' });
//     }
// };
