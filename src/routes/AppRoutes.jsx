// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link here for the 404 page
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage'; // Assuming this path from your App.jsx
import SignupPage from '../pages/auth/SignupPage'; // Assuming this path from your App.jsx
import ProfileListPage from '../pages/ProfileListPage';
import ProfileDetailsPage from '../pages/ProfileDetailsPage';
import AdminDashboard from '../pages/AdminDashboard'; // From your App.jsx
import UserDashboardPage from '../pages/UserDashboardPage'; // From your App.jsx
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} /> {/* Use SignupPage if distinct */}
      
      <Route 
        path="/profiles" 
        element={
          <ProtectedRoute>
            <ProfileListPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profiles/:username"
        element={
          <ProtectedRoute>
            <ProfileDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/dashboard/edit-profile"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all 404 Route */}
      <Route path="*" element={
          <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-4rem)]">
              <h2 className="text-4xl font-bold text-slate-700 dark:text-slate-200 mb-4">404 - Page Not Found</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Oops! The page you're looking for doesn't exist.</p>
              <Link to="/" className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors">
                  Go Back Home
              </Link>
          </div>
      } />
    </Routes>
  );
};

export default AppRoutes;