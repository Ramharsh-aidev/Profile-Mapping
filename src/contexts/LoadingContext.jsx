// src/contexts/LoadingContext.jsx
import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// GlobalLoader import removed from here

const LoadingContext = createContext({
  isLoading: false, // This will directly control if the loader UI should be visible
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children, delay = 50 }) => { // Default delay kept low
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  const [isLoaderUIVisible, setIsLoaderUIVisible] = useState(false);
  const timeoutIdRef = useRef(null);

  const show = useCallback(() => {
    setIsActuallyLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsActuallyLoading(false);
  }, []);

  useEffect(() => {
    if (isActuallyLoading) {
      // If loading has started, set a timer to show the loader UI
      timeoutIdRef.current = setTimeout(() => {
        setIsLoaderUIVisible(true);
      }, delay);
    } else {
      // If loading has stopped, clear any timer and hide the loader UI
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
      setIsLoaderUIVisible(false);
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isActuallyLoading, delay]);

  // The context now provides isLoaderUIVisible as 'isLoading'
  return (
    <LoadingContext.Provider value={{ isLoading: isLoaderUIVisible, showLoader: show, hideLoader: hide }}>
      {children}
      {/* GlobalLoader is NOT rendered here anymore */}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};