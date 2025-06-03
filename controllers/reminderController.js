const Reminder = require('../models/reminder');
const Application = require('../models/application');
const nodemailer = require('nodemailer');

async function sendReminderEmail(email, reminderDate) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Job Application Reminder',
        text: `You have a reminder set for ${reminderDate}.`,
    });
}

exports.setReminder = async (req, res) => {
    const { reminderDate, applicationId } = req.body;
    if (!reminderDate || !applicationId) {
        return res.status(400).json({ error: 'reminderDate and applicationId are required.' });
    }

    try {
        // Validate application ownership using Application model
        const application = await Application.findByIdAndUser(applicationId, req.user.userId);
        if (!application) {
            return res.status(400).json({ error: 'Invalid applicationId.' });
        }

        const reminder = await Reminder.createReminder({
            reminderDate,
            applicationId,
            userId: req.user.userId
        });
        res.status(201).json(reminder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.findByUser(req.user.userId);
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByReminderId(req.params.id);
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found.' });
        }
        await Reminder.deleteById(req.params.id);
        res.json({ message: 'Reminder deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};