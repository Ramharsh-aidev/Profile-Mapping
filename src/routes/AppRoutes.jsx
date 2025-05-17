// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfileListPage from '../pages/ProfileListPage';
import ProfileDetailsPage from '../pages/ProfileDetailsPage'; // Import the new page
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<LoginPage />} /> {/* Assuming signup also uses LoginPage component with a mode toggle */}

      {/* Protect the ProfileListPage */}
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfileListPage />
          </ProtectedRoute>
        }
      />

      {/* Protect the ProfileDetailsPage */}
      {/* This route needs to be defined to catch /profiles/:username */}
      <Route
        path="/profiles/:username"
        element={
          <ProtectedRoute>
            <ProfileDetailsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;