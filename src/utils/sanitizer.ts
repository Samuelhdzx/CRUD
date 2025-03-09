import { escape } from 'validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const sanitizeInput = (input: string): string => {
  // Escape HTML special characters
  let sanitized = escape(input);
  // Clean any potential XSS
  sanitized = purify.sanitize(sanitized);
  return sanitized;
};

export const validateInput = (input: string): boolean => {
  // Check for SQL injection patterns
  const sqlInjectionPattern = /(\b(select|insert|update|delete|drop|union|exec|eval)\b)|(['"])/i;
  if (sqlInjectionPattern.test(input)) {
    return false;
  }
  return true;
};
