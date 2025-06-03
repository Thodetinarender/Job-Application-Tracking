const Application = require('../models/application');
const { Types } = require('mongoose');

// Log a new application
exports.logApplication = async (req, res) => {
  const { jobTitle, applicationDate, status, notes, filePath } = req.body;
  if (!jobTitle || !applicationDate || !status) {
    return res.status(400).json({ error: 'Fields jobTitle, applicationDate, and status are required.' });
  }
  try {
    await Application.createApplication({
      jobTitle,
      applicationDate,
      status,
      notes,
      filePath,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Application logged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log application' });
  }
};

// Get all applications for a user
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.findAllByUser(req.user.userId);
    res.status(200).json(applications || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Get a specific application by ID
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUser(req.params.id, req.user.userId);
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// Update an application
exports.updateApplication = async (req, res) => {
  try {
    const updated = await Application.updateById(req.params.id, req.user.userId, req.body);
    if (!updated) return res.status(404).json({ error: 'Application not found.' });
    res.status(200).json({ message: 'Application updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.deleteById(req.params.id, req.user.userId);
    if (!deleted) return res.status(404).json({ error: 'Application not found.' });
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

// Upload a file attachment to an application
exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const updated = await Application.updateById(req.params.id, req.user.userId, { filePath: req.file.path });
    if (!updated) return res.status(404).json({ error: 'Application not found.' });
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Search applications
exports.searchApplications = async (req, res) => {
  const { keyword, status, dateRange } = req.query;
  const filter = {};
  if (keyword) filter.jobTitle = { $regex: keyword, $options: 'i' };
  if (status) filter.status = status;
  if (dateRange) {
    const [start, end] = dateRange.split(',');
    filter.applicationDate = { $gte: new Date(start), $lte: new Date(end) };
  }
  try {
    const applications = await Application.search(req.user.userId, filter);
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search applications' });
  }
};













// const Application = require('../models/application');
// const { ObjectId } = require('mongodb');

// // Log a new application
// exports.logApplication = async (req, res) => {
//     if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).json({ error: 'Request body is required and cannot be empty.' });
//     }

//     const { jobTitle, applicationDate, status, notes, filePath } = req.body;

//     if (!jobTitle || !applicationDate || !status) {
//         return res.status(400).json({ error: 'Fields jobTitle, applicationDate, and status are required.' });
//     }

//     try {
//         const application = new Application(jobTitle, applicationDate, status, notes, filePath, req.user.userId);
//         await application.save();

//         res.status(201).json({ message: 'Application logged successfully' });
//     } catch (err) {
//         console.error('Error saving application:', err.message);
//         res.status(500).json({ error: 'Failed to log application' });
//     }
// };

// // Get all applications for a user
// exports.getApplications = async (req, res) => {
//     try {
//         const applications = await Application.findAllByUser(req.user.userId);
//         res.status(200).json(applications || []);
//     } catch (err) {
//         console.error('Error fetching applications:', err.message);
//         res.status(500).json({ error: 'Failed to fetch applications' });
//     }
// };

// // Get a specific application by ID
// exports.getApplication = async (req, res) => {
//     const id = req.params.id;

//     try {
//         const application = await Application.findById(new ObjectId(id));

//         if (!application || application.userId !== req.user.userId) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         res.status(200).json(application);
//     } catch (err) {
//         console.error('Error fetching application:', err.message);
//         res.status(500).json({ error: 'Failed to fetch application' });
//     }
// };

// // Update an application
// exports.updateApplication = async (req, res) => {
//     const id = req.params.id;
//     const updatedData = req.body;

//     try {
//         const existingApp = await Application.findById(new ObjectId(id));
//         if (!existingApp || existingApp.userId !== req.user.userId) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         await Application.updateById(new ObjectId(id), updatedData);
//         res.status(200).json({ message: 'Application updated successfully' });
//     } catch (err) {
//         console.error('Error updating application:', err.message);
//         res.status(500).json({ error: 'Failed to update application' });
//     }
// };

// // Delete an application
// exports.deleteApplication = async (req, res) => {
//     const id = req.params.id;

//     try {
//         const existingApp = await Application.findById(new ObjectId(id));
//         if (!existingApp || existingApp.userId !== req.user.userId) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         await Application.deleteById(new ObjectId(id));
//         res.status(200).json({ message: 'Application deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting application:', err.message);
//         res.status(500).json({ error: 'Failed to delete application' });
//     }
// };

// // Upload a file attachment to an application
// exports.uploadAttachment = async (req, res) => {
//     const applicationId = req.params.id;

//     try {
//         const application = await Application.findById(new ObjectId(applicationId));

//         if (!application || application.userId !== req.user.userId) {
//             return res.status(404).json({ error: 'Application not found.' });
//         }

//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded.' });
//         }

//         await Application.updateById(new ObjectId(applicationId), {
//             filePath: req.file.path,
//         });

//         res.status(200).json({ message: 'File uploaded successfully' });
//     } catch (err) {
//         console.error('Error uploading file:', err.message);
//         res.status(500).json({ error: 'Failed to upload file' });
//     }
// };

// // Optional: Search applications by keyword, status, or date range
// exports.searchApplications = async (req, res) => {
//     const { keyword, status, dateRange } = req.query;
//     const userId = req.user.userId;

//     const db = require('../config/db').getdb();
//     const filter = { userId };

//     if (keyword) {
//         filter.jobTitle = { $regex: keyword, $options: 'i' };
//     }
//     if (status) {
//         filter.status = status;
//     }
//     if (dateRange) {
//         const [start, end] = dateRange.split(',');
//         filter.applicationDate = {
//             $gte: new Date(start),
//             $lte: new Date(end),
//         };
//     }

//     try {
//         const applications = await db.collection('applications').find(filter).toArray();
//         res.status(200).json(applications);
//     } catch (err) {
//         console.error('Error searching applications:', err.message);
//         res.status(500).json({ error: 'Failed to search applications' });
//     }
// };

