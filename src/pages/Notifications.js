import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { refreshUnread } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          withCredentials: true,
        });
        // Sort by most recent first
        setNotifications(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };

    const markAsRead = async () => {
      try {
        await axios.put('http://localhost:5000/api/notifications/mark-read', {}, {
          withCredentials: true,
        });
        refreshUnread(); // remove red dot in Navbar
      } catch (err) {
        console.error('Error marking notifications as read', err);
      }
    };

    fetchNotifications();
    markAsRead();
  }, [refreshUnread]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        notifications.map((notif, idx) => (
          <div
            key={idx}
            className={`mb-3 p-4 rounded-md shadow border ${
              !notif.isRead
                ? 'bg-purple-50 border-purple-300 font-semibold'
                : 'bg-white border-gray-200'
            }`}
          >
            <p>{notif.message}</p>
            <p className="text-sm text-gray-500 mt-1">
              📌 Post: <span className="font-medium">{notif.post?.title || 'Untitled'}</span> <br />
              🕒 {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
