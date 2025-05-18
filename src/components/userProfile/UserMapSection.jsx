// src/components/userProfile/UserMapSection.jsx
import React from 'react';
import SingleAddressMap from '../SingleAddressMap'; // Adjust path if SingleAddressMap is elsewhere
import { FaMapMarkerAlt } from 'react-icons/fa';

const UserMapSection = ({ address, username }) => { // Receives address and username from profileData
  return (
    <div className="bg-white p-6 md:p-8 shadow-xl rounded-xl"> {/* Removed mt-6, parent will handle spacing */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-3 border-slate-200 flex items-center">
        <FaMapMarkerAlt className="mr-2.5 text-sky-500" /> Location
      </h2>
      {address && address !== 'Location Undisclosed' ? (
        <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border border-slate-200 shadow-inner">
          <SingleAddressMap address={address} key={address + username} /> {/* Key on address + username */}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-10 italic">
          {username ? `${username}'s` : "This user's"} location is not disclosed.
        </p>
      )}
    </div>
  );
};

export default UserMapSection;