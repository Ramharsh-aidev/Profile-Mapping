// src/components/userProfile/UserProfileHeader.jsx
import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const UserProfileHeader = ({ user }) => { // Receives `profileData` as `user` prop
  if (!user) return null;

  const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=0D8ABC&color=fff&size=128&font-size=0.33&bold=true`;

  return (
    <div className="bg-gradient-to-br from-sky-500 to-cyan-400 text-white p-6 md:p-8 rounded-t-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={avatar}
          alt={user.name || user.username}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">{user.name || user.username}</h1>
          {user.username && <p className="text-sky-100 text-md">@{user.username}</p>}
          {user.email && ( // Assuming email is part of the public profile data from backend
            <a href={`mailto:${user.email}`} className="mt-2 inline-flex items-center text-sm text-sky-50 hover:text-white transition-colors">
              <FaEnvelope className="mr-2" /> {user.email}
            </a>
          )}
          {/* Any other header-specific info from user (profileData) */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;