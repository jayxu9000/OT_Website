require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Adjust as needed
const multer = require('multer');
const storage = multer.memoryStorage(); // Configure multer to store files in memory
const upload = multer({ storage: storage });

// POST route to add a new user
router.post('/', async (req, res) => {
    const { name, username, password, image, linkedIn } = req.body;

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
            name: name,
            username: username,
            password: hashedPassword, // Store the hashed password
            image: image,
            linkedIn: linkedIn
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
        res.status(201).json(user);
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

// GET route to get the list of user names and images
router.get('/Profile', async (req, res) => {
    try {
        // Fetch all users from the database and select only the 'name', 'image', and 'linkedIn' fields
        const users = await User.find({}).select('name image linkedIn _id');
        // Send back the list of users with only the selected fields
        res.json(users);
    } catch (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/Profile/image/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Assuming 'user.image' contains the BinData for the image
        if (user.image) {
            // Set the appropriate content type based on the image format (e.g., image/jpeg)
            res.contentType('image/jpeg'); // Modify this based on your image format

            // Send the image data as the response
            res.send(user.image);
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } catch (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/linkedIn/:username', async (req, res) => {
    const { username } = req.params;
    const { linkedIn } = req.body;

    try {
        const updateResult = await User.updateOne(
            { username },
            { $set: { linkedIn } }
        );

        if(updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "LinkedIn updated successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/image/:username', upload.single('image'), async (req, res) => {
    const { username } = req.params;
    const image = req.file; // The uploaded file is available in req.file

    if (!image) {
        return res.status(400).json({ message: "No image uploaded." });
    }

    try {
        // Convert the uploaded image to a buffer and store it in MongoDB
        const updateResult = await User.updateOne(
            { username },
            { $set: { image: image.buffer } } // Store the image buffer
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Image updated successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// More routes can be added below

module.exports = router;
