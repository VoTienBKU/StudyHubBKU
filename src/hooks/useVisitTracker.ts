import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/utils/discordWebhook';

export const useVisitTracker = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Track initial page load
    trackPageVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Track when user leaves the page (optional)
    const handleBeforeUnload = () => {
      // Could send additional analytics here if needed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
