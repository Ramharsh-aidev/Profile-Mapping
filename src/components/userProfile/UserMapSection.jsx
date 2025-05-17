import React from 'react';
import SingleAddressMap from '../SingleAddressMap'; // Adjust path if needed
import { FaMapMarkerAlt } from 'react-icons/fa';

const UserMapSection = ({ address, username }) => {
  return (
    <div className="bg-white p-6 md:p-8 shadow-md rounded-xl mt-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-sky-500" /> Location
      </h2>
      {address && address !== 'Location Undisclosed' ? (
        <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border border-slate-200">
          <SingleAddressMap address={address} key={address} /> {/* Add key to force remount if address changes */}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">
          {username}'s location is not disclosed.
        </p>
      )}
    </div>
  );
};

export default UserMapSection;