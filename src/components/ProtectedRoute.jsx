// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the custom hook
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show a loading state while checking auth status
  if (loading) {
    // You can replace this with a beautiful loading spinner component
    return <div className="text-center py-20">Loading user data...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    // Store the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin and user is not admin, redirect (e.g., home or unauthorized page)
  if (adminOnly && !isAdmin) {
     // Redirect to home or a specific unauthorized page
     return <Navigate to="/" replace />; // Or <Navigate to="/unauthorized" />
  }

  // If authenticated (and optionally admin), render the children (the route component)
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool, // Prop to make the route admin-only
};

export default ProtectedRoute;