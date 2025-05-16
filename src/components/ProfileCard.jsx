// src/components/ProfileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaMapMarkedAlt as ViewOnMapIcon } from 'react-icons/fa'; // Renamed for clarity

const ProfileCard = ({ profile, onViewOnMap }) => {
  const {
    username = 'Anonymous User', // This is now mapped from user.username or user.name
    email,
    address = 'Location Undisclosed', // This is now mapped from user.location
    description = 'No description provided.',
    photoURL,
    latitude,
    longitude
  } = profile;

  const avatar = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=96&font-size=0.33`;
  // Using email as the primary part of the ID for the link, as it's the backend identifier
  const profileDetailLink = `/profiles/${encodeURIComponent(email)}`;

  const canViewOnMap = latitude !== undefined && longitude !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex p-3">
      <img
        src={avatar}
        alt={username}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h3 className="text-md sm:text-lg font-semibold text-slate-800 truncate" title={username}>{username}</h3>
        {email && (
          <p className="text-xs sm:text-sm text-sky-600 flex items-center truncate" title={email}>
            <FaEnvelope className="mr-1.5 flex-shrink-0 w-3 h-3" /> {email}
          </p>
        )}
        {address !== 'Location Undisclosed' && (
          <p className="text-xs text-slate-500 mt-0.5 flex items-center truncate" title={address}>
            <FaMapMarkerAlt className="mr-1.5 flex-shrink-0 w-3 h-3" /> {address}
          </p>
        )}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2" title={description}>
          {description}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <Link
            to={profileDetailLink}
            className="inline-flex items-center px-2.5 py-1 border border-sky-500 text-xs font-medium rounded text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <FaInfoCircle className="mr-1.5" /> Details
          </Link>
          {canViewOnMap && onViewOnMap && (
            <button
              onClick={onViewOnMap}
              className="inline-flex items-center px-2.5 py-1 border border-teal-500 text-xs font-medium rounded text-teal-600 hover:bg-teal-50 transition-colors"
            >
              <ViewOnMapIcon className="mr-1.5" /> View on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;