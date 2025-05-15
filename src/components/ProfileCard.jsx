import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button'; // Adjust path if necessary

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer">
      <img
        src={profile.photoURL || 'https://via.placeholder.com/150'}
        alt={profile.username}
        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" // Added object-cover
      />
      <h3 className="text-lg font-semibold text-center text-gray-800">{profile.username}</h3> {/* Changed color */}
      <p className="text-gray-600 text-center">{profile.email}</p>
      <p className="text-gray-700 text-center">{profile.description}</p>

      <div className="mt-4 flex justify-center">
        <Link to={`/profiles/${profile.email}`}> {/* Changed to email as ID */}
          <Button variant="primary" className="mr-2">Details</Button>
        </Link>
        {/* Add other buttons if needed */}
      </div>
    </div>
  );
};

export default ProfileCard;