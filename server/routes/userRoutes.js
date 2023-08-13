const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Get logged-in user details
router.get('/me', authMiddleware, async (req, res) => {
    console.log('GET /me route hit');  // Add this line
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            throw new Error('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Register a user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // Create JWT
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); // Updated here

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Unable to login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Unable to login');
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); // Updated here
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// User Logout
router.post('/logout', async (req, res) => {
    try {
        // Implement logic to invalidate or delete the token from database
        
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get user details by ID
router.get('/:id', authMiddleware, async (req, res) => {
    console.log('GET /:id route hit');  // Logging for debugging
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


module.exports = router;
