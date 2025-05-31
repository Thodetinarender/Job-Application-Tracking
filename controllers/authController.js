const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwtServices = require("../services/jwtService");

// Signup
exports.signUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(403).json({ message: "User already exists, Please login!" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User(name, email, hash, phone);
    await user.save();
    res.status(201).json({ success: true, message: "New user created." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
    const token = jwtServices.generateAccessTokenOnLogin(user._id, user.name);
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      userName: user.name,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { name, street, apartment, zip, city, country, careerGoals } = req.body;
  try {
    const updateFields = { name, street, apartment, zip, city, country };
    if (careerGoals !== undefined) updateFields.careerGoals = careerGoals;
    const result = await User.updateProfile(req.user.userId, updateFields);
    if (!result.value) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'Profile updated successfully', user: result.value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
