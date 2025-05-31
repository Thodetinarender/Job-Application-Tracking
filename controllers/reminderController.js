const Reminder = require('../models/reminder');
const Application = require('../models/application');
const nodemailer = require('nodemailer');

const { ObjectId } = require('mongodb'); // Add at the top if not present


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
        // Validate if the applicationId exists and belongs to the logged-in user

        const application = await Application.findById(new ObjectId(applicationId));
        if (!application || application.userId !== req.user.userId) {
            return res.status(400).json({ error: `Invalid applicationId: Application with ID ${applicationId} does not exist or does not belong to you.` });
        }
        const reminder = new Reminder({ reminderDate, applicationId });
        await reminder.save();
        res.status(201).send(reminder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.send(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).send({ error: 'Reminder not found.' });
        }
        await reminder.deleteOne();
        res.send({ message: 'Reminder deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};







// const Reminder = require('../models/reminder');
// const Application = require('../models/application');
// const nodemailer = require('nodemailer');

// async function sendReminderEmail(email, reminderDate) {
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Job Application Reminder',
//         text: `You have a reminder set for ${reminderDate}.`,
//     });
// }

// exports.setReminder = async (req, res) => {
//     const { reminderDate, applicationId } = req.body;

//     // Validate input fields
//     if (!reminderDate || !applicationId) {
//         return res.status(400).json({ error: 'reminderDate and applicationId are required.' });
//     }

//     try {
//         // Validate if the applicationId exists and belongs to the logged-in user
//         const application = await Application.findOne({
//             where: { id: applicationId, userId: req.user.userId },
//         });
//         if (!application) {
//             return res.status(400).json({ error: `Invalid applicationId: Application with ID ${applicationId} does not exist or does not belong to you.` });
//         }

//         const reminder = await Reminder.create({ reminderDate, applicationId });
//         res.status(201).send(reminder);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to create reminder' });
//     }
// };

// exports.getReminders = async (req, res) => {
//   const reminders = await Reminder.findAll();
//   res.send(reminders);
// };

// exports.deleteReminder = async (req, res) => {
//   const reminder = await Reminder.findByPk(req.params.id);
//   if (!reminder) {
//     return res.status(404).send({ error: 'Reminder not found.' });
//   }
//   await reminder.destroy();
//   res.send({ message: 'Reminder deleted successfully.' });
// };