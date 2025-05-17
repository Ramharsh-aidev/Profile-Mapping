// src/App.jsx - CORRECTED

import React from 'react';
// Remove: import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom'; // Keep Route and Routes
// import Header from './components/layouts/Header'; // You can uncomment if you use it
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfileListPage from './pages/ProfileListPage';
import ProfileDetailsPage from './pages/ProfileDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* <Router> NO LONGER NEEDED HERE - main.jsx provides it */}
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
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
          <Route path="*" element={<div><h2>404 Page Not Found</h2><a href="/">Go Home</a></div>} />
        </Routes>
    </AuthProvider>
  );
}

export default App;