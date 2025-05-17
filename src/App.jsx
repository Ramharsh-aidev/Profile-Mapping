// src/App.jsx
import React from 'react';
// Removed Route, Routes, Link from here as AppRoutes.jsx handles them
import AppRoutes from './routes/AppRoutes'; // Import your consolidated routes
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
        <AppRoutes /> {/* Render the AppRoutes component here */}
    </AuthProvider>
  );
}

export default App;