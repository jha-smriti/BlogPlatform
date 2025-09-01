// src/pages/EditPost.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(res.data.title);
        setContent(res.data.content);
        setPreview(`http://localhost:5000${res.data.imageUrl}`);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      alert('Post updated!');
      navigate('/my-posts');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">✏️ Edit Post</h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <textarea
            placeholder="Update your content..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />

          {preview && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Image Preview:</p>
              <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg shadow" />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
