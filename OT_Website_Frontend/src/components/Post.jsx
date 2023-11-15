// src/components/Post.js
import React from 'react';
import CommentForm from './CommentForm';

const Post = ({ post, onDelete, onUpvote, onCommentAdded }) => {

    return (
        <div className="post">
            <h3>{post.author.username}</h3>
            <p>{post.content}</p>
            <button onClick={() => onUpvote(post._id)}>Upvote ({post.upvotes})</button>
            <button onClick={() => onDelete(post._id)}>Delete</button>
            {/* You can add an edit button and functionality as well */}

            {post.comments && post.comments.map((comment, index) => (
                <div key={index} className="comment">
                    <p>{comment.content}</p> {/* Adjust as needed based on your comment data structure */}
                </div>
            ))}

            {/* Include the CommentForm here */}
            <CommentForm postId={post._id} onCommentAdded={onCommentAdded} />
        </div>
    );
};

export default Post;
