import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { genToken } from '../../configs/token.js';

describe('genToken Unit Test', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.sign = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Test Case 1: Successful token generation
  it('should generate a token using jwt.sign and return it', async () => {
    process.env.JWT_SECRET = 'super-secret-key';
    const mockToken = 'mocked.jwt.token.string';
    const mockUserId = 'user123';

    jwt.sign.mockReturnValue(mockToken);

    const result = await genToken(mockUserId);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUserId },
      'super-secret-key',
      { expiresIn: '7d' }
    );

    expect(result).toBe(mockToken);
  });

  // Test Case 2: Error handling
  it('should catch errors thrown by jwt.sign and log "token error"', async () => {
    jwt.sign.mockImplementation(() => {
      throw new Error('JWT Sign Failure');
    });

    const result = await genToken('user123');

    expect(consoleSpy).toHaveBeenCalledWith('token error');
    expect(result).toBeUndefined();
  });
});
