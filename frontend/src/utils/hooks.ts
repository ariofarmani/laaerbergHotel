import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to manage a controlled form state
 * @param initialValues Initial form values
 * @returns Form state and handlers
 */
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    // Clear error when field is changed
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleReset,
  };
};

/**
 * Hook to manage local storage state
 * @param key Storage key
 * @param initialValue Initial value
 * @returns State and setter
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook to track previous value of a state or prop
 * @param value Current value
 * @returns Previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * Hook to manage query parameters in the URL
 * @returns Functions to get, set, and remove query parameters
 */
export const useQueryParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const getParam = (key: string): string | null => {
    return queryParams.get(key);
  };

  const getAllParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const setParam = (key: string, value: string) => {
    queryParams.set(key, value);
    navigate({
      pathname: location.pathname,
      search: queryParams.toString()
    });
  };

  const removeParam = (key: string) => {
    queryParams.delete(key);
    navigate({
      pathname: location.pathname,
      search: queryParams.toString()
    });
  };

  const setParams = (params: Record<string, string>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    });
    
    navigate({
      pathname: location.pathname,
      search: queryParams.toString()
    });
  };

  return {
    getParam,
    getAllParams,
    setParam,
    removeParam,
    setParams,
  };
};

/**
 * Hook for handling API loading states with debouncing
 * @param initialState Initial loading state
 * @param delay Debounce delay in ms
 * @returns Loading state and handlers
 */
export const useLoading = (initialState = false, delay = 300) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setError(null);
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback((err?: Error) => {
    // Debounce the loading state change to prevent flashes
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      if (err) {
        setError(err);
      }
    }, delay);
  }, [delay]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { isLoading, error, startLoading, stopLoading, setError };
};

/**
 * Hook to detect clicks outside of a component
 * @param callback Function to call on outside click
 * @returns Ref to attach to the component
 */
export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

/**
 * Hook for debouncing values
 * @param value Value to debounce
 * @param delay Delay in ms
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for responsive design
 * @returns Object with boolean flags for different screen sizes
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    width: windowSize.width,
    height: windowSize.height,
  };
};

/**
 * Hook for pagination
 * @param items Array of items to paginate
 * @param itemsPerPage Number of items per page
 * @returns Pagination state and handlers
 */
export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    currentItems,
    setCurrentPage,
  };
};