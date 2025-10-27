// Base64 encoding utilities
export const encodeBase64 = (str: string): string => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    // Node.js environment
    return Buffer.from(str, 'utf8').toString('base64');
  }
};

export const decodeBase64 = (str: string): string => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return decodeURIComponent(escape(atob(str)));
  } else {
    // Node.js environment
    return Buffer.from(str, 'base64').toString('utf8');
  }
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
