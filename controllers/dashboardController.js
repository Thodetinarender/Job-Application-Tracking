const Application = require('../models/application');

exports.getDashboard = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { userId: req.user.userId },
            attributes: ['id', 'jobTitle', 'applicationDate', 'status', 'filePath'], // Include filePath
        });

        const stats = {
            totalApplications: applications.length,
            applied: applications.filter(app => app.status === 'applied').length,
            interviewed: applications.filter(app => app.status === 'interviewed').length,
            offered: applications.filter(app => app.status === 'offered').length,
            rejected: applications.filter(app => app.status === 'rejected').length,
        };

        res.status(200).json({ applications, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};