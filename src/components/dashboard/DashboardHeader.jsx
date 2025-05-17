// src/components/dashboard/DashboardHeader.jsx
import React from 'react';

const DashboardHeader = ({ userData }) => {
  if (!userData) return null; // Or a placeholder

  return (
    <div className="bg-gradient-to-br from-sky-100 via-sky-50 to-indigo-50 p-6 md:p-10 mb-10 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-8 space-y-4 sm:space-y-0">
        <img
          src={userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.username || 'U')}&background=0284c7&color=fff&size=112&font-size=0.33&bold=true`}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
        />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{userData.name || userData.username}</h1>
          <p className="text-md text-slate-600 mt-1">{userData.email}</p>
          <p className="text-xs text-slate-500 mt-2">
            Member since {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;