import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to create a post');
      navigate('/login');
    }
  }, [navigate]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/posts/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      alert('Post created successfully!');
      setTitle('');
      setContent('');
      setImage(null);
      setPreview(null);

      navigate('/all-posts'); // or to /blogs if you want to go to public view
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">📝 Create a New Blog Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <textarea
            placeholder="Write your post content..."
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
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
