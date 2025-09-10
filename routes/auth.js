const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// =================== SIGNUP ===================
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, age, weight } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      weight
    });

    await newUser.save();

    // Set session
    req.session.userId = newUser._id;

    // Return response without password
    res.json({
      message: 'Signup successful',
      user: {
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// =================== LOGIN ===================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user._id;

    // Return response without password
    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// =================== LOGOUT ===================
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

// =================== GET CURRENT USER ===================
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(200).json({ user: null });
    }

    const user = await User.findById(req.session.userId).select('-password'); // Exclude password
    res.json({ user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

module.exports = router;

