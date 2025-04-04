/**
 * Utility to determine if we should use mock data instead of real API calls
 * Useful for development or demo purposes
 */

// Environmental flag to enable mock data usage
// In a real app, this would be set based on environment variables or build flags
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

// Check if the mock data should be used
export const shouldUseMockData = (): boolean => {
  return USE_MOCK_DATA;
};

// Function to add artificial delay to responses (for demonstrating loading states)
export const mockDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to generate a random ID for new items
export const generateMockId = (): number => {
  return Math.floor(Math.random() * 10000) + 1;
};

// Helper to format currency values
export const formatCurrency = (amount: number): string => {
  return `€${amount.toFixed(2)}`;
};

// Helper to format dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

export default {
  shouldUseMockData,
  mockDelay,
  generateMockId,
  formatCurrency,
  formatDate
};