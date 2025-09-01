import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-purple-600">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10 text-red-600">Post not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">by {post.username}</p>

      {post.imageUrl && (
        <img
          src={`http://localhost:5000${post.imageUrl}`}
          alt={post.title}
          className="w-full h-80 object-cover rounded mb-6"
        />
      )}

      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</div>
    </div>
  );
};

export default PostDetails;
