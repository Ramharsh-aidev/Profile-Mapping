import React from 'react';

const ProfileCard = ({ profile, onSelect }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
      onClick={() => onSelect(profile)}
    >
      <img
        src={profile.photoURL || 'https://via.placeholder.com/150'} // Default placeholder image
        alt={profile.username}
        className="w-24 h-24 rounded-full mx-auto mb-2"
      />
      <h3 className="text-lg font-semibold text-center">{profile.username}</h3>
      <p className="text-gray-600 text-center">{profile.email}</p>
      <p className="text-gray-700 text-center">{profile.description}</p>
    </div>
  );
};

export default ProfileCard;