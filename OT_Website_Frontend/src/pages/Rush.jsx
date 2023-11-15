import React, { useState, useEffect } from 'react';
import { fetchPosts, createPost, fetchComments } from '../services/api';
import PostList from '../components/PostList';
import { useAuth } from '../components/AuthContext';

const Rush = () => {
    const { authData } = useAuth();
    const [originalPosts, setOriginalPosts] = useState([]); // Added for original order
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        const loadPostsAndComments = async () => {
            try {
                const postsResponse = await fetchPosts();
                const postsWithComments = await Promise.all(
                    postsResponse.data.map(async (post) => {
                        const commentsResponse = await fetchComments(post._id);
                        return { ...post, comments: commentsResponse.data };
                    })
                );
                setOriginalPosts(postsWithComments); // Set original posts
                setPosts(postsWithComments); // Set posts that can be sorted
            } catch (error) {
                console.error('Error loading posts and comments:', error);
            }
        };

        loadPostsAndComments();
    }, []);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        if (!newPostContent) return;

        const newPost = { content: newPostContent, authorId: authData._id };
        const response = await createPost(newPost);

        // Update both originalPosts and posts to maintain synchronization
        const newPostArray = [response.data, ...posts];
        setOriginalPosts(newPostArray);
        setPosts(newPostArray);
        setNewPostContent(''); // Reset the input field after submission
    };

    const sortByUsername = () => {
        const sortedPosts = [...posts].sort((a, b) => a.author.username.localeCompare(b.author.username));
        setPosts(sortedPosts);
    };

    const revertToOriginalOrder = () => {
        setPosts([...originalPosts]);
    };

    return (
        <div>
            <button onClick={sortByUsername}>Sort by Username</button>
            <button onClick={revertToOriginalOrder}>Original Order</button>
            <form onSubmit={handlePostSubmit}>
                <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                />
                <button type="submit">Post</button>
            </form>
            <PostList posts={posts} setPosts={setPosts} />
        </div>
    );
};

export default Rush;
