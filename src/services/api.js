import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const getPosts = () => API.get('/posts');
export const getPost = (id) => API.get(`/posts/${id}`); // ✅ FIXED
export const createPost = async (formData) => {
  const token = localStorage.getItem('token');
  return await axios.post(
    'http://localhost:5000/api/posts',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    }
  );
};
