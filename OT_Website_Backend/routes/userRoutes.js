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
    const { firstName, lastName, lineNumber, email, password, image, linkedIn, verified, admin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already associated with an account." });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            lineNumber: lineNumber,
            email: email,
            password: hashedPassword, // Store the hashed password
            image: image,
            linkedIn: linkedIn,
            verified: verified,
            admin: admin
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
        const { email, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ email });

        // If user doesn't exist, send a 401 Unauthorized response
        if (!user) {
            return res.status(401).json({ message: "User doesn't exist or incorrect email" });
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

router.get('/Profile', async (req, res) => {
    try {
        const users = await User.find({}).select('firstName lastName image linkedIn _id verified');
        const usersWithImages = users.map(user => {
            const userObj = user.toObject(); // Convert to plain JavaScript object
            if (userObj.image) {
                // Convert the Buffer directly to a Base64 string
                const imageBase64 = userObj.image.toString('base64');
                userObj.image = `data:image/png;base64,${imageBase64}`; // Adjust MIME type if necessary
            } else {
                userObj.image = null;
            }
            return userObj;
        });
        res.json(usersWithImages);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/linkedIn/:email', async (req, res) => {
    const { email } = req.params;
    const { linkedIn } = req.body;

    try {
        const updateResult = await User.updateOne(
            { email },
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

router.put('/image/:email', upload.single('image'), async (req, res) => {
    const { email } = req.params;
    const image = req.file; // The uploaded file is available in req.file

    if (!image) {
        return res.status(400).json({ message: "No image uploaded." });
    }

    try {
        // Convert the uploaded image to a buffer and store it in MongoDB
        const updateResult = await User.updateOne(
            { email },
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

// GET route to get a list of non-admin users with specific fields
router.get('/nonAdminUsers', async (req, res) => {
    try {
        // Fetch users where 'admin' is false and select only the specified fields
        const nonAdminUsers = await User.find({ admin: false }).select('firstName lastName lineNumber _id');
        // Send back the list of non-admin users
        res.json(nonAdminUsers);
    } catch (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error" });
    }
});

// PUT route to promote a user to admin
router.put('/promoteToAdmin/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const updateResult = await User.findByIdAndUpdate(
            userId,
            { $set: { admin: true } },
            { new: true } // This option returns the document after update
        );

        if (!updateResult) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User promoted to admin successfully", user: updateResult });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// PUT route for a user to demote themselves from admin
router.put('/demoteFromAdmin/:userId', async (req, res) => {
    const { userId } = req.params;
    // Assuming you store the logged-in user's ID in the session
    // You need to ensure that your session middleware is set up correctly
    try {
        const updateResult = await User.findByIdAndUpdate(
            userId,
            { $set: { admin: false } },
            { new: true } // This option returns the document after update
        );

        if (!updateResult) {
            return res.status(404).json({ message: "User not found." });
        }

        // Optionally, update the user information in the session
        // req.session.user = updateResult;

        res.status(200).json({ message: "You are no longer an admin.", user: updateResult });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET route to check current user's admin status
router.get('/checkAdminStatus/:userId', async (req, res) => {

    const { userId } = req.params;
    
    try {
        const user = await User.findById(userId).select('admin');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ isAdmin: user.admin });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/nonVerifiedUsers', async (req, res) => {
    try {
        // Fetch users where 'admin' is false and select only the specified fields
        const nonVerifiedUsers = await User.find({ verified: false }).select('firstName lastName lineNumber _id');
        // Send back the list of non-admin users
        res.json(nonVerifiedUsers);
    } catch (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/promoteToVerified/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const updateResult = await User.findByIdAndUpdate(
            userId,
            { $set: { verified: true } },
            { new: true } // This option returns the document after update
        );

        if (!updateResult) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User verified successfully", user: updateResult });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
// More routes can be added below

module.exports = router;
