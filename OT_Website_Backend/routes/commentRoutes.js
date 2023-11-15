const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post'); // If you need to verify the post exists

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a comment to a post
router.post('/', async (req, res) => {
    const { content, authorId, postId } = req.body;
    const comment = new Comment({ content, author: authorId, post: postId });
    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Other routes for updating and deleting comments can be added similarly

module.exports = router;
