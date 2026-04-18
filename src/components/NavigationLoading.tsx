'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  endNavigation: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
  startNavigation: () => {},
  endNavigation: () => {},
});

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, startNavigation, endNavigation }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
}