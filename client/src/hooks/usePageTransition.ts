import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useLoading } from '@/contexts/LoadingContext';

export function usePageTransition() {
  const [location] = useLocation();
  const { startLoading, stopLoading } = useLoading();
  const prevLocation = useRef(location);

  useEffect(() => {
    // Don't show loading for authentication pages
    const isAuthPage = location === '/login' || location === '/signup';
    const wasAuthPage = prevLocation.current === '/login' || prevLocation.current === '/signup';
    
    // Only show loading if location actually changed (not on initial load) and not for auth pages
    if (prevLocation.current !== location && prevLocation.current !== '/' && !isAuthPage && !wasAuthPage) {
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
