/**
 * Collection of helper functions for the application
 */

/**
 * Format a date to a readable string
 * @param date Date string or Date object
 * @param format Format string (default: 'DD.MM.YYYY')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, format = 'DD.MM.YYYY'): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  // Format the date based on the format string
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  let result = format;
  result = result.replace('DD', day);
  result = result.replace('MM', month);
  result = result.replace('YYYY', year.toString());
  
  return result;
};

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code (default: 'EUR')
 * @param locale Locale for formatting (default: 'de-AT')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  currency = 'EUR', 
  locale = 'de-AT'
): string => {
  if (isNaN(amount)) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate number of nights between two dates
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @returns Number of nights
 */
export const calculateNights = (checkIn: Date | string, checkOut: Date | string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Calculate the time difference in milliseconds
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  
  // Convert to days
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Calculate the total price for a stay
 * @param nightPrice Price per night
 * @param nights Number of nights
 * @param discount Discount percentage (0-100)
 * @returns Total price
 */
export const calculateTotalPrice = (
  nightPrice: number, 
  nights: number, 
  discount = 0
): number => {
  const subtotal = nightPrice * nights;
  const discountAmount = subtotal * (discount / 100);
  return subtotal - discountAmount;
};

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Truncate a string to a maximum length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate a phone number
 * @param phone Phone number to validate
 * @returns True if phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Accept various formats with optional country code
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return regex.test(phone);
};

/**
 * Debounce a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  limit = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param obj Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get query parameters from a URL
 * @param url URL string
 * @returns Object with query parameters
 */
export const getQueryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url, window.location.origin);
  const searchParams = new URLSearchParams(urlObj.search);
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
};

/**
 * Build a query string from an object
 * @param params Object with parameters
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return query ? `?${query}` : '';
};

/**
 * Remove HTML tags from a string
 * @param html HTML string
 * @returns Clean text
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Safely access nested object properties
 * @param obj Object to access
 * @param path Path to property (e.g. 'user.address.city')
 * @param defaultValue Default value if property doesn't exist
 * @returns Property value or default
 */
export const getNestedValue = (
  obj: Record<string, any>,
  path: string,
  defaultValue = undefined
): any => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
};

/**
 * Download data as a file
 * @param data Data to download
 * @param filename Filename
 * @param type MIME type
 */
export const downloadFile = (
  data: string, 
  filename: string, 
  type = 'text/plain'
): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Scroll to an element
 * @param elementId Element ID
 * @param offset Offset from the top
 * @param behavior Scroll behavior
 */
export const scrollToElement = (
  elementId: string, 
  offset = 0, 
  behavior: ScrollBehavior = 'smooth'
): void => {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }
};

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if date is in the past
 */
export const isDateInPast = (date: Date | string): boolean => {
  const checkDate = new Date(date);
  const today = new Date();
  
  // Reset hours to compare just the date
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Check if a date is in the future
 * @param date Date to check
 * @returns True if date is in the future
 */
export const isDateInFuture = (date: Date | string): boolean => {
  const checkDate = new Date(date);
  const today = new Date();
  
  // Reset hours to compare just the date
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate > today;
};

/**
 * Add days to a date
 * @param date Base date
 * @param days Number of days to add
 * @returns New date
 */
export const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Convert object to FormData
 * @param obj Object to convert
 * @returns FormData object
 */
export const objectToFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return formData;
};