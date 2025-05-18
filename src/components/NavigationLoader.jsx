// src/components/NavigationLoader.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext'; // Adjust path as needed

const NavigationLoader = ({ autoHideDelay = 1000 }) => { // Default auto-hide after 3 seconds
  const { showLoader, hideLoader } = useLoading();
  const location = useLocation();
  const previousPathnameRef = useRef(location.pathname);
  const autoHideTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing auto-hide timeout when location changes
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
      autoHideTimeoutRef.current = null;
    }

    if (location.pathname !== previousPathnameRef.current) {
      console.log("NavigationLoader: Path changed to", location.pathname, "- showLoader()");
      showLoader(); // Show loader (its appearance is delayed by LoadingProvider's own delay prop)
      previousPathnameRef.current = location.pathname;

      // Set a new timeout to automatically hide the loader
      autoHideTimeoutRef.current = setTimeout(() => {
        console.log("NavigationLoader: Auto-hiding loader for path", location.pathname);
        hideLoader();
      }, autoHideDelay);
    }

    // Cleanup function for this effect
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [location.pathname, showLoader, hideLoader, autoHideDelay]);

  // This effect is to ensure that if hideLoader is called by a page component
  // (because its content loaded fast), our auto-hide timeout is also cleared.
  // We listen to the isLoading value from the context. If it becomes false,
  // it means someone (either this component's auto-hide or another component)
  // has called hideLoader.
  const { isLoading } = useLoading(); // Get the current loader visibility state
  useEffect(() => {
    if (!isLoading && autoHideTimeoutRef.current) {
        // console.log("NavigationLoader: Loader hidden by another component, clearing auto-hide timeout.");
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
    }
  }, [isLoading]);


  return null; // This component doesn't render anything itself
};

export default NavigationLoader;