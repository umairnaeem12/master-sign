import { useState } from 'react';

export const useExternalNavigation = () => {
  // Kept for API compatibility; external links now open immediately with no
  // artificial loading screen.
  const [isNavigating] = useState(false);

  const navigateToExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return {
    isNavigating,
    navigateToExternal
  };
};
