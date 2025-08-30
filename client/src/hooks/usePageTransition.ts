import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useLoading } from '@/contexts/LoadingContext';

export function usePageTransition() {
  const [location] = useLocation();
  const { startLoading, stopLoading } = useLoading();
  const prevLocation = useRef(location);

  useEffect(() => {
    // Only show loading if location actually changed (not on initial load)
    if (prevLocation.current !== location && prevLocation.current !== '/') {
      startLoading();
      
      // Hide loading after a short delay
      const timer = setTimeout(() => {
        stopLoading();
      }, 800);

      return () => clearTimeout(timer);
    }
    
    prevLocation.current = location;
  }, [location, startLoading, stopLoading]);
}
