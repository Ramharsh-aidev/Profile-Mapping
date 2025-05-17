// src/components/ProfileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaMapMarkedAlt as ViewOnMapIcon } from 'react-icons/fa';

const ProfileCard = ({ profile, onViewOnMap }) => {
  const {
    username = 'Anonymous User',
    email,
    address = 'Location Undisclosed',
    description = 'No description provided.',
    photoURL,
    // name, // Assuming 'name' might be different from 'username'
  } = profile;

  const avatar = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=96&font-size=0.33`;
  // IMPORTANT: Change link to use username
  const profileDetailLink = `/profiles/${encodeURIComponent(username)}`;

  const canViewOnMap = address && address !== 'Location Undisclosed';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex p-3 text-slate-800">
      <img
        src={avatar}
        alt={username}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        {/* Display name if available, fallback to username */}
        <h3 className="text-md sm:text-lg font-semibold text-slate-800 truncate" title={profile.name || username}>{profile.name || username}</h3>
        {username && username !== (profile.name || 'N/A') && ( // Show username if different from display name
            <p className="text-xs sm:text-sm text-slate-500 -mt-1 mb-0.5">@{username}</p>
        )}
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
            to={profileDetailLink} // Link uses username
            className="inline-flex items-center px-2.5 py-1 border border-sky-500 text-xs font-medium rounded text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <FaInfoCircle className="mr-1.5" /> View Profile
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