import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadComplete = useRef(false);

  // Initial loading effect
  useEffect(() => {
    if (!initialLoadComplete.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        initialLoadComplete.current = true;
      }, 2000); // Show loader for 2 seconds on initial load

      return () => clearTimeout(timer);
    }
  }, []);

  const startLoading = () => {
    if (initialLoadComplete.current) {
      setIsLoading(true);
    }
  };
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
