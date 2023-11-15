// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this to your server's URL

export const fetchPosts = () => axios.get(`${API_URL}/posts`);
export const createPost = (postData) => axios.post(`${API_URL}/posts`, postData);
export const updatePost = (id, updatedData) => axios.put(`${API_URL}/posts/${id}`, updatedData);
export const deletePost = (id) => axios.delete(`${API_URL}/posts/${id}`);
export const upvotePost = (id) => axios.patch(`${API_URL}/posts/upvote/${id}`);

export const fetchComments = (postId) => axios.get(`${API_URL}/comments/post/${postId}`);
export const addComment = (commentData) => axios.post(`${API_URL}/comments`, commentData);
