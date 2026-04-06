const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findById(req.userId);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Change password
router.put('/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;