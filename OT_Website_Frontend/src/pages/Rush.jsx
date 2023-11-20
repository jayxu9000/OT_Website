import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rush() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/posts/get')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/posts/put', { content })
      .then(res => {
        setPosts([...posts, res.data]);
        setContent('');
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post._id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default Rush;