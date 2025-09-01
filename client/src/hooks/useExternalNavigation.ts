import { useState } from 'react';

export const useExternalNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToExternal = (url: string, delay: number = 2000) => {
    setIsNavigating(true);
    
    // Show loading screen for specified delay
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsNavigating(false);
    }, delay);
  };

  return {
    isNavigating,
    navigateToExternal
  };
};
