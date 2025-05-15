import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layouts/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage'; // Updated import
import SignupPage from './pages/auth/SignupPage'; // Updated import
import ProfileListPage from './pages/ProfileListPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Updated route */}
          <Route path="/signup" element={<SignupPage />} /> {/* Updated route */}
          <Route path="/profiles" element={<ProtectedRoute><ProfileListPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;