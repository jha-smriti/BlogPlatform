import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ This is the correct import in React 18+
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
