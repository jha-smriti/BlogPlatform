// src/pages/MyPosts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/my-posts', {
          withCredentials: true,
        });
        setPosts(res.data);

        const likedMap = {};
        const commentMap = {};
        res.data.forEach(post => {
          likedMap[post._id] = post.likes.includes(localStorage.getItem('userId'));
          commentMap[post._id] = post.comments || [];
        });
        setLikedPosts(likedMap);
        setComments(commentMap);
      } catch (err) {
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, { withCredentials: true });
      setLikedPosts(prev => ({ ...prev, [postId]: res.data.liked }));

      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, { text }, { withCredentials: true });
      setComments(prev => ({ ...prev, [postId]: res.data }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">📝 My Blog Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow">
              {post.imageUrl && (
                <img
                  src={`http://localhost:5000${post.imageUrl}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-purple-700">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">You</p>
              <p className="text-gray-700 mb-2">
                {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
              </p>
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => handleLike(post._id)} className="text-red-500">
                  {likedPosts[post._id] ? <FaHeart /> : <FaRegHeart />} {post.likes.length}
                </button>
                <span>💬 {comments[post._id]?.length || 0}</span>
                <button className="text-blue-500"><FaShareAlt /></button>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-grow px-3 py-1 border rounded"
                />
                <button onClick={() => handleCommentSubmit(post._id)} className="text-sm bg-purple-500 text-white px-3 py-1 rounded">
                  Post
                </button>
              </div>

              {comments[post._id]?.map((c, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-1">
                  <strong>{c.username}:</strong> {c.text}
                </p>
              ))}

              <div className="flex gap-4 text-purple-600 text-sm font-medium mt-2">
                <Link to={`/posts/${post._id}`} className="hover:underline">Read More</Link>
                <Link to={`/edit/${post._id}`} className="hover:underline">Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="hover:underline text-red-500">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
