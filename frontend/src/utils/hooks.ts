import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing local storage data with type safety
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error return initialValue
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that persists
  // the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch a custom event so other components can subscribe
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };
  
  // Watch for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error reading from localStorage in storage event:', error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}

/**
 * Custom hook for handling clickaway (click outside) detection
 * @param onClickAway - Callback function for when click outside happens
 * @returns Ref to attach to element
 */
export function useClickAway<T extends HTMLElement = HTMLElement>(
  onClickAway: (event: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClickAway]);
  
  return ref;
}

/**
 * Custom hook for managing scroll position and direction
 * @returns Object with scroll information
 */
export function useScroll() {
  const [scrollInfo, setScrollInfo] = useState({
    y: 0,
    x: 0,
    lastY: 0,
    lastX: 0,
    direction: {
      x: '' as 'left' | 'right' | '',
      y: '' as 'up' | 'down' | '',
    },
  });
  
  const handleScroll = useCallback(() => {
    setScrollInfo((prev) => {
      const newScrollInfo = {
        y: window.scrollY,
        x: window.scrollX,
        lastY: prev.y,
        lastX: prev.x,
        direction: {
          x: prev.x < window.scrollX ? 'right' : prev.x > window.scrollX ? 'left' : '',
          y: prev.y < window.scrollY ? 'down' : prev.y > window.scrollY ? 'up' : '',
        },
      };
      return newScrollInfo;
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  return scrollInfo;
}

/**
 * Custom hook for managing media queries
 * @param query - Media query string
 * @returns Boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Set initial state
    setMatches(mediaQueryList.matches);
    
    // Use legacy or modern API depending on browser support
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    } else {
      // Legacy browsers (Safari < 14)
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [query]);
  
  return matches;
}

/**
 * Custom hook for debouncing a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Custom hook to check if component is mounted
 * @returns Ref that is true if component is mounted
 */
export function useIsMounted() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return isMounted;
}

/**
 * Custom hook for window size
 * @returns Current window dimensions
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}