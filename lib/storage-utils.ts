/**
 * Utility functions for managing localStorage safely
 */

export const clearLocalStorageIfCorrupted = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Test if localStorage is accessible
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (error) {
    console.warn('localStorage is not accessible or corrupted, clearing all data');
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Failed to clear localStorage:', clearError);
    }
  }
};

export const getStorageSize = () => {
  if (typeof window === 'undefined') return 0;
  
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

export const isStorageQuotaExceeded = (error: any): boolean => {
  return error instanceof DOMException && (
    // Everything except Firefox
    error.code === 22 ||
    // Firefox
    error.code === 1014 ||
    // Test name field too, because code might not be present
    // Everything except Firefox
    error.name === 'QuotaExceededError' ||
    // Firefox
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );
};

export const safeSetItem = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (isStorageQuotaExceeded(error)) {
      console.warn('localStorage quota exceeded, attempting to free space');
      
      // Try to clear some space by removing non-essential items
      const nonEssentialKeys = ['temp', 'cache', 'logs'];
      for (const nonEssentialKey of nonEssentialKeys) {
        try {
          localStorage.removeItem(nonEssentialKey);
        } catch (removeError) {
          console.error('Error removing non-essential item:', removeError);
        }
      }
      
      // Try again
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Failed to save after clearing space:', retryError);
        return false;
      }
    } else {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
};

export const safeGetItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};