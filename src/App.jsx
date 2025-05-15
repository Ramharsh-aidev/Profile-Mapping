// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'; // Import global styles

function App() {
  return (
      <Router> {/* Provides routing context */}
          <AuthProvider>
              <AppRoutes /> {/* Renders the defined routes */}
          </AuthProvider>
      </Router>
  );
}

export default App;