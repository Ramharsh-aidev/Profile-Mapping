import React from 'react';
import { FaInfoCircle, FaCalendarAlt, FaVenusMars } from 'react-icons/fa'; // Example icons

const DetailItem = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 w-8 h-8 inline-flex items-center justify-center text-sky-600 bg-sky-100 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-slate-700 text-sm md:text-base">{value}</p>
      </div>
    </div>
  );
};

const UserDetailsSection = ({ user }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString; // fallback if date is invalid
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 shadow-md rounded-b-xl">
      <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">About {user.name || user.username}</h2>
      
      <DetailItem icon={<FaInfoCircle size={16}/>} label="Bio / Description" value={user.description || 'No description provided.'} />
      
      {/* Example of other details you might have */}
      {user.dateOfBirth && (
        <DetailItem icon={<FaCalendarAlt size={16}/>} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
      )}
      
      {/* You can add more DetailItem components for other user fields */}
      {/* e.g., user.gender, user.pronouns, etc. */}
      {/* <DetailItem icon={<FaVenusMars size={16}/>} label="Gender" value={user.gender} /> */}

      {user.isAdmin !== undefined && (
         <div className="flex items-start py-3 mt-2">
            <div className={`flex-shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-full mr-4 ${user.isAdmin ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                {user.isAdmin ? '👑' : '👤'}
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Account Type</p>
                <p className={`font-semibold text-sm md:text-base ${user.isAdmin ? 'text-amber-700' : 'text-green-700'}`}>
                {user.isAdmin ? 'Administrator' : 'Regular User'}
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsSection;