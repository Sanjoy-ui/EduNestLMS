import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import connectDb from '../../configs/db.js';

describe('connectDb', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.connect = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Test Case 1: Successful Connection
  it('should successfully connect to MongoDB and log a success message', async () => {
    process.env.MONGODB_URL = 'mongodb://localhost:27017/test';
    mongoose.connect.mockResolvedValue(true);

    await connectDb();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    expect(consoleSpy).toHaveBeenCalledWith('DB connected');
  });

  // Test Case 2: Connection Failure
  it('should catch the error and log "DB error" if the connection fails', async () => {
    process.env.MONGODB_URL = 'mongodb://localhost:27017/test';
    mongoose.connect.mockRejectedValue(new Error('Connection timed out'));

    await connectDb();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('DB error');
  });
});

