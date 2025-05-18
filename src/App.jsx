// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext'; // Import useLoading
import NavigationLoader from './components/NavigationLoader';
import GlobalLoader from './components/ui/GlobalLoader'; // Import GlobalLoader

// This inner component will consume the loading state
const MainAppStructure = () => {
  const { isLoading: isAppLoading } = useLoading(); // Get loading state

  if (isAppLoading) {
    return <GlobalLoader isLoading={true} />; // Show only loader if app is loading
  }

  // If not loading, show the normal app structure
  return (
    <>
        <AppRoutes />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <LoadingProvider delay={50}> {/* delay prop for LoadingProvider */}
        <NavigationLoader /> {/* This component will trigger show/hideLoader on route changes */}
        <MainAppStructure /> {/* This component handles conditional rendering */}
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;