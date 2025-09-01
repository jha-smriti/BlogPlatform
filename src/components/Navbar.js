import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
const Navbar = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const { username, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
  const fetchUnread = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        withCredentials: true
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  fetchUnread(); // initial load

  // ⏱️ Poll every 5 seconds
  const interval = setInterval(fetchUnread, 5000);

  return () => clearInterval(interval); // cleanup
}, []);
  const getInitial = (name) => name?.charAt(0).toUpperCase() || '';

  return (
    <nav className="backdrop-blur-sm bg-white/70 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/my-posts" className="text-2xl font-extrabold text-purple-700 tracking-tight">
          MyBlog
        </Link>

        <button
          className="md:hidden text-purple-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium transition">
            Home
          </Link>
          <Link to="/create" className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition font-semibold">
            Write
          </Link>
          <Link to="/all-posts" className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition font-semibold">
            Blogs
          </Link>
          <Link to="/notifications" className="relative text-purple-700 hover:text-purple-900">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full ring-2 ring-white" />
        )}
      </Link>

          {/* Profile or Guest */}
          {username ? (
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-lg">
                {getInitial(username)}
              </div>
              <div className="absolute top-full mt-2 right-0 bg-white text-gray-700 text-sm rounded shadow-md py-1 opacity-0 group-hover:opacity-100 transition-all w-32 z-10">
                <div className="px-4 py-2 border-b">{username}</div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group cursor-pointer">
              <User className="text-purple-700 w-6 h-6" />
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 text-sm rounded shadow-md py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                <Link to="/login" className="block px-4 py-1 hover:bg-gray-100">Login</Link>
                <Link to="/signup" className="block px-4 py-1 hover:bg-gray-100">Signup</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-4 border-t border-gray-200 shadow">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-purple-700">
            Home
          </Link>
          <Link to="/create" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-semibold text-center">
            Write
          </Link>
          {!username && (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-purple-700">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-purple-700">
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
