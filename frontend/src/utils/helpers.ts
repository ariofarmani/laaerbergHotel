/**
 * Helper utility functions for the application
 */

/**
 * Formats a price value to a currency string
 * @param price - The price value to format
 * @param currency - The currency code (default: EUR)
 * @param locale - The locale code (default: de-DE)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  price: number,
  currency: string = 'EUR',
  locale: string = 'de-DE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Formats a date string to a localized date string
 * @param dateString - The date string to format
 * @param locale - The locale code (default: en-US)
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Calculates the number of nights between two dates
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Number of nights
 */
export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculates the total price for a stay
 * @param pricePerNight - Price per night
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Total price
 */
export const calculateTotalPrice = (
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date
): number => {
  const nights = calculateNights(checkIn, checkOut);
  return pricePerNight * nights;
};

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - The string to truncate
 * @param length - Maximum length
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Generates a random ID
 * @returns Random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Parses URL query parameters
 * @param search - URL search string
 * @returns Object with query parameters
 */
export const parseQueryParams = (search: string): Record<string, string> => {
  if (!search || search === '?') return {};
  
  const params = new URLSearchParams(search.startsWith('?') ? search.substring(1) : search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Builds URL query string from parameters object
 * @param params - Object with query parameters
 * @returns Query string starting with ?
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Debounce function to limit how often a function is called
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Get days of the week, starting from Monday
 * @param locale - The locale code (default: en-US)
 * @returns Array of weekday names
 */
export const getWeekdays = (locale: string = 'en-US'): string[] => {
  const weekdays = [];
  const date = new Date(2021, 10, 1); // Use a Monday
  
  for (let i = 0; i < 7; i++) {
    weekdays.push(
      new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)
    );
    date.setDate(date.getDate() + 1);
  }
  
  return weekdays;
};

/**
 * Validates an email address format
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Adds days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns Boolean indicating if date is in the past
 */
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Gets a list of years for selection dropdowns
 * @param startYear - Starting year (default: current year)
 * @param numberOfYears - Number of years to include (default: 10)
 * @returns Array of years
 */
export const getYearOptions = (
  startYear: number = new Date().getFullYear(),
  numberOfYears: number = 10
): number[] => {
  return Array.from({ length: numberOfYears }, (_, i) => startYear + i);
};