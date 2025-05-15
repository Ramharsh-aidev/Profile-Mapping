// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
// import ProfileListPage from '../pages/ProfileListPage';
import LoginPage from '../pages/LoginPage';
// import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<LoginPage />} /> 
      {/* Protect the ProfileListPage */}
      {/* <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfileListPage />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
};

export default AppRoutes;