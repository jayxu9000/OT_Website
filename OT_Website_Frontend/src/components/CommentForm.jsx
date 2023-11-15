// src/components/CommentForm.js
import React, { useState } from 'react';
import { addComment } from '../services/api';
import { useAuth } from './AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [commentContent, setCommentContent] = useState('');
    const { authData } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        try {
            // Assuming 'authorId' is obtained from your user authentication context
            const commentData = { 
                content: commentContent, 
                authorId: authData._id, // Replace with actual logged-in user's ID
                postId 
            };

            const response = await addComment(commentData);
            onCommentAdded(response.data);
            setCommentContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
            // Handle the error (e.g., show a notification to the user)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
            />
            <button type="submit">Comment</button>
        </form>
    );
};

export default CommentForm;
