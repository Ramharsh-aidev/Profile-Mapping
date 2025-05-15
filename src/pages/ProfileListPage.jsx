import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import MapComponent from '../components/MapComponent';
import { getUsers } from '../utils/authStorage'; // Assuming you store user data in authStorage
// import { Link } from 'react-router-dom';

const ProfileListPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load profiles from storage on component mount
    const storedUsers = getUsers();
    setProfiles(storedUsers);
  }, []);

  // Function to handle profile selection
  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  // Function to filter profiles based on search query
  const filteredProfiles = profiles.filter(profile => {
    // Convert profile data and search query to lowercase for case-insensitive search
    const profileData = `${profile.username} ${profile.email}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return profileData.includes(query);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search profiles..."
        className="w-full px-4 py-2 border rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile.email} // Assuming email is unique.  If not, use a different unique ID.
            profile={profile}
            onSelect={handleProfileSelect}
          />
        ))}
      </div>

      {selectedProfile && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Map View</h2>
          <MapComponent address={selectedProfile.address} />
        </div>
      )}
    </div>
  );
};

export default ProfileListPage;