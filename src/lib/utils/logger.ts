/**
 * Production-ready Logger Utility
 *
 * Provides controlled logging that can be disabled in production.
 * - In development: All logs are shown
 * - In production: Only errors are logged (for crash reporting)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger that respects environment settings
 * - log/info/warn: Only shown in development
 * - error: Always shown (important for debugging production issues)
 */
export const logger = {
  /**
   * Log general information (development only)
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log informational messages (development only)
   */
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always shown - important for production debugging)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default logger;
