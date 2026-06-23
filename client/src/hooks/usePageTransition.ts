import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/**
 * Tracks the current location. Page navigations are instant (client-side
 * routing with no data fetching to block on), so we no longer show an
 * artificial loading screen between routes.
 */
export function usePageTransition() {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    prevLocation.current = location;
  }, [location]);
}
