import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import Layout from '../components/layouts/Layout';
import { getUsers } from '../utils/authStorage';

const ProfileDetailsPage = () => {
  const { email } = useParams(); // Changed to email
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedUsers = getUsers();
    const foundProfile = storedUsers.find(user => user.email === email); // Changed to email
    setProfile(foundProfile);
  }, [email]);

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Profile not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={profile.photoURL || 'https://via.placeholder.com/300'}
              alt={profile.username}
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold mb-2 text-center">{profile.username}</h2>
            <p className="text-gray-600 mb-2 text-center">{profile.email}</p>
            <p className="text-gray-700 mb-4 text-center">{profile.description}</p>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Map</h2>
            <MapComponent address={profile.address} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileDetailsPage;