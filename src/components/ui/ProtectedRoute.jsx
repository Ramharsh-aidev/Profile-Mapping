import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want to render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;