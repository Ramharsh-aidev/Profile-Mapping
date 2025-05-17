import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserProfileHeader from '../components/userProfile/UserProfileHeader';
import UserDetailsSection from '../components/userProfile/UserDetailsSection';
import UserMapSection from '../components/userProfile/UserMapSection';
import { FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal'; // Optional for animations

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProfileDetailsPage = () => {
  const { username } = useParams(); // Get username from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/users/username/${encodeURIComponent(username)}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.message || err.message || "Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-sky-600 p-4">
        <FaSpinner className="animate-spin w-12 h-12 mb-4" />
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 text-center">
        <FaExclamationTriangle className="w-16 h-16 text-red-400 mb-5" />
        <p className="text-xl font-semibold mb-2">Could not load profile</p>
        <p className="text-md mb-4">{error}</p>
        <Link 
            to="/profiles" 
            className="inline-flex items-center px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600 transition-colors"
        >
            <FaArrowLeft className="mr-2" /> Back to Profiles
        </Link>
      </div>
    );
  }

  if (!user) {
    return ( // Should ideally be caught by error state from 404
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-600 p-4">
        <p className="text-lg">User not found.</p>
        <Link 
            to="/profiles" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600 transition-colors"
        >
            <FaArrowLeft className="mr-2" /> Back to Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/profiles" 
            className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to All Profiles
          </Link>
        </div>

        <Fade direction="up" triggerOnce cascade damping={0.1}>
          <UserProfileHeader user={user} />
          <UserDetailsSection user={user} />
          <UserMapSection address={user.location} username={user.username} />
        </Fade>
        
        {/* Placeholder for "Edit Profile" button - for current user */}
        {/* You would need to compare logged-in user's ID/username with `user.username` */}
        {/* For example:
          const { currentUser } = useAuth(); // Assuming you have an auth context
          if (currentUser && currentUser.username === user.username) {
            // Render EditProfileButton
          }
        */}
      </div>
    </div>
  );
};

export default ProfileDetailsPage;