const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Adjust as needed

// POST route to add a new user
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const newUser = new User({
            username: username,
            password: hashedPassword // Store the hashed password
        });

        try {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
});

// POST route for user login
router.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // If user doesn't exist, send a 401 Unauthorized response
        if (!user) {
            return res.status(401).json({ message: "user doesn't exist" });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, send a 401 response
        if (!isMatch) {
            return res.status(401).json({ message: "password doesn't match" });
        }

        // If credentials are correct, set the user information in the session
        req.session.user = user;

        // Send a success response
        res.json({ message: "Logged in successfully" });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error" });
    }
});

// POST route for user logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send('Error logging out');
        } else {
            res.clearCookie('connect.sid'); // Match the cookie name to your configuration
            res.json({ message: 'Logged out successfully' });
        }
    });
});

// More routes can be added below

module.exports = router;
