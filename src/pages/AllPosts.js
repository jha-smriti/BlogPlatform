// src/pages/AllPosts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeSharePostId, setActiveSharePostId] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/public');
        setPosts(res.data);

        const likedMap = {};
        const commentMap = {};
        res.data.forEach(post => {
          likedMap[post._id] = post.likes.some(uid => uid === userId);
          commentMap[post._id] = post.comments || [];
        });

        setLikedPosts(likedMap);
        setComments(commentMap);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, { withCredentials: true });
      setLikedPosts(prev => ({ ...prev, [postId]: res.data.liked }));
      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, likes: Array(res.data.likes).fill('user') } : p
        )
      );
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
      const res = await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      setComments(prev => ({ ...prev, [postId]: res.data }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleShare = (platform, post) => {
    const url = `${window.location.origin}/posts/${post._id}`;
    const text = `Check out this blog post: ${post.title}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + ' ' + url)}`;
    }
  };

  const downloadPDF = async (post) => {
  const doc = new jsPDF();

  const margin = 15;
  const maxWidth = 180;
  let y = margin;

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Title:', margin, y);
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  const titleLines = doc.splitTextToSize(post.title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 5;

  // Author
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Author:', margin, y);
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(post.username || 'Unknown', margin, y);
  y += 12;

  // Image (if available)
  if (post.imageUrl) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Image:', margin, y);
    y += 5;

    try {
      const imageUrl = `http://localhost:5000${post.imageUrl}`;
      const imageData = await toDataURL(imageUrl);

      const imgWidth = maxWidth;
      const imgHeight = 90;
      doc.addImage(imageData, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch (err) {
      console.error('Error loading image:', err);
    }
  }

  // Content
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Content:', margin, y);
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  const contentLines = doc.splitTextToSize(post.content, maxWidth);
  doc.text(contentLines, margin, y);

  doc.save(`${post.title || 'blog'}.pdf`);
};

// Utility to fetch image as base64
const toDataURL = (url) =>
  fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));



  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">📰 All Blog Posts</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            id={`post-card-${post._id}`}
            className="bg-white p-4 rounded-lg shadow relative"
          >
            {post.imageUrl && (
              <img
                src={`http://localhost:5000${post.imageUrl}`}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold text-purple-700">{post.title}</h2>
            <p className="text-sm text-gray-600 mb-2">by {post.username}</p>
            <p className="text-gray-700 mb-2">
              {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
            </p>

            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-1 ${
                  likedPosts[post._id] ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {likedPosts[post._id] ? <FaHeart /> : <FaRegHeart />} {post.likes.length}
              </button>
              <span>💬 {comments[post._id]?.length || 0}</span>
              <button
                onClick={() => setActiveSharePostId(post._id)}
                className="text-blue-500"
              >
                <FaShareAlt />
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={commentInputs[post._id] || ''}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-3 py-1 border rounded"
              />
              <button
                onClick={() => handleCommentSubmit(post._id)}
                className="text-sm bg-purple-500 text-white px-3 py-1 rounded"
              >
                Post
              </button>
            </div>

            {comments[post._id]?.map((c, idx) => (
              <p key={idx} className="text-sm text-gray-700 mb-1">
                <strong>{c.username}:</strong> {c.text}
              </p>
            ))}

            <Link
              to={`/posts/${post._id}`}
              className="text-purple-600 font-medium hover:underline mt-2 inline-block"
            >
              Read More →
            </Link>

            {/* Share Modal */}
            {activeSharePostId === post._id && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 w-80 shadow-lg">
                  <h2 className="text-lg font-semibold mb-4 text-purple-700">Share Post</h2>
                  <button
                    onClick={() => handleShare('whatsapp', post)}
                    className="w-full mb-2 bg-green-500 text-white py-2 rounded"
                  >
                    📱 Share on WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('email', post)}
                    className="w-full mb-2 bg-blue-600 text-white py-2 rounded"
                  >
                    ✉️ Share via Email
                  </button>
                  <button
                    onClick={() => downloadPDF(post)}
                    className="w-full mb-2 bg-purple-600 text-white py-2 rounded"
                  >
                    📄 Download as PDF
                  </button>
                  <button
                    onClick={() => setActiveSharePostId(null)}
                    className="w-full mt-2 text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
