require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const noteRoutes = require('./routes/noteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const mongoConnect = require('./config/db').mongoConnect; // Import MongoDB connection

const app = express();

// Ensure body-parser middleware is applied
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

// Public routes (no authentication required)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", 'signup.html'));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

app.use('/api/v1/users', authRoutes);
//Protected routes (authentication required)
app.use('/api/v1/companies', authMiddleware, companyRoutes); // For company-related routes
app.use('/api/v1/applications', authMiddleware, applicationRoutes); // Ensure this route is registered
app.use('/api/v1/reminders', authMiddleware, reminderRoutes);
app.use('/api/v1/notes', authMiddleware, noteRoutes);
app.use('/api/v1/dashboard', authMiddleware, dashboardRoutes);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


mongoConnect(client => {
  console.log(client);
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
