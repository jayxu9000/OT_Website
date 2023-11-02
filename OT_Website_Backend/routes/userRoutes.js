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

// More routes can be added below

module.exports = router;
