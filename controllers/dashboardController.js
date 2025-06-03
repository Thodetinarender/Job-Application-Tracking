const Application = require('../models/application');

exports.getDashboard = async (req, res) => {
    try {
        const applications = await Application.findAllByUser(req.user.userId);

        const filteredApps = applications.map(app => ({
            id: app._id,
            jobTitle: app.jobTitle,
            applicationDate: app.applicationDate,
            status: app.status,
            filePath: app.filePath,
        }));

        const stats = {
            totalApplications: filteredApps.length,
            applied: filteredApps.filter(app => app.status === 'applied').length,
            interviewed: filteredApps.filter(app => app.status === 'interviewed').length,
            offered: filteredApps.filter(app => app.status === 'offered').length,
            rejected: filteredApps.filter(app => app.status === 'rejected').length,
        };

        res.status(200).json({ applications: filteredApps, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};
