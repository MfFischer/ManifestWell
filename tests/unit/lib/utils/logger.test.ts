/**
 * Tests for Production Logger Utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the logger in different environments
describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => { }),
      info: vi.spyOn(console, 'info').mockImplementation(() => { }),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => { }),
      error: vi.spyOn(console, 'error').mockImplementation(() => { }),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => { }),
    };
  });

  afterEach(() => {
    // Restore environment
    vi.stubEnv('NODE_ENV', originalEnv || 'test');
    // Restore console methods
    vi.restoreAllMocks();
    // Clear module cache to reload logger with new env
    vi.resetModules();
  });

  describe('in development environment', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.resetModules();
    });

    it('should call console.log in development', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.log('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('test message');
    });

    it('should call console.info in development', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.info('info message');
      expect(consoleSpy.info).toHaveBeenCalledWith('info message');
    });

    it('should call console.warn in development', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.warn('warning message');
      expect(consoleSpy.warn).toHaveBeenCalledWith('warning message');
    });

    it('should call console.error in development', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalledWith('error message');
    });

    it('should call console.debug in development', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.debug('debug message');
      expect(consoleSpy.debug).toHaveBeenCalledWith('debug message');
    });
  });

  describe('in production environment', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.resetModules();
    });

    it('should NOT call console.log in production', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.log('test message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should NOT call console.info in production', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.info('info message');
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it('should NOT call console.warn in production', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.warn('warning message');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should STILL call console.error in production (for debugging)', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalledWith('error message');
    });

    it('should NOT call console.debug in production', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.debug('debug message');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });

  describe('argument handling', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.resetModules();
    });

    it('should pass multiple arguments to console methods', async () => {
      const { logger } = await import('@/lib/utils/logger');
      logger.log('message', { data: 'object' }, 123);
      expect(consoleSpy.log).toHaveBeenCalledWith('message', { data: 'object' }, 123);
    });

    it('should handle Error objects', async () => {
      const { logger } = await import('@/lib/utils/logger');
      const error = new Error('Test error');
      logger.error('An error occurred:', error);
      expect(consoleSpy.error).toHaveBeenCalledWith('An error occurred:', error);
    });
  });
});
