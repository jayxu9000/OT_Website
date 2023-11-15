// src/components/PostList.js
import React from 'react';
import Post from './Post';
import { deletePost, upvotePost } from '../services/api';

const PostList = ({ posts, setPosts }) => {
    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
            // Handle error (e.g., show a notification to the user)
        }
    };

    const handleUpvote = async (id) => {
        try {
            await upvotePost(id);
            setPosts(posts.map(post => post._id === id ? { ...post, upvotes: post.upvotes + 1 } : post));
        } catch (error) {
            console.error('Error upvoting post:', error);
            // Handle error (e.g., show a notification to the user)
        }
    };

    const handleCommentAdded = (newComment, postId) => {
        setPosts(posts.map(post => 
            post._id === postId ? 
            { ...post, comments: [...(post.comments || []), newComment] } : 
            post
        ));
    };

    return (
        <div>
            {posts.map(post => (
                <Post 
                    key={post._id} 
                    post={post} 
                    onDelete={handleDelete} 
                    onUpvote={handleUpvote}
                    onCommentAdded={(newComment) => handleCommentAdded(newComment, post._id)}
                />
            ))}
        </div>
    );
};

export default PostList;
