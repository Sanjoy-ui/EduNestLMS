
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import uploadOnCloudinary from '../../configs/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

describe('uploadOnCloudinary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cloudinary.config = jest.fn();
    cloudinary.uploader.upload = jest.fn();
    fs.unlinkSync = jest.fn();
  });

  it('should return null if no filePath is provided', async () => {
    const result = await uploadOnCloudinary(null);
    
    expect(result).toBeNull();
    expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  it('should upload successfully, delete the local file, and return the secure_url', async () => {
    const mockFilePath = 'public/temp/avatar.png';
    const mockSecureUrl = 'https://res.cloudinary.com/demo/image/upload/v1234/avatar.png';

    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: mockSecureUrl,
    });

    const result = await uploadOnCloudinary(mockFilePath);


    expect(cloudinary.config).toHaveBeenCalled();


    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFilePath, {
      resource_type: 'auto',
    });


    expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);

    // Verify final output
    expect(result).toBe(mockSecureUrl);
  });


  it('should delete the local file and log error if the upload fails', async () => {
    const mockFilePath = 'public/temp/avatar.png';
    const mockError = new Error('Cloudinary upload failed');

    // Spy on console.log so it doesn't flood your test terminal outputs
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Tell the mock upload function to reject/throw an error
    cloudinary.uploader.upload.mockRejectedValue(mockError);

    const result = await uploadOnCloudinary(mockFilePath);

    // It should still clean up the file even if upload fails
    expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    
    // It should log the error
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    // Since the catch block doesn't explicitly return anything, result will be undefined
    expect(result).toBeUndefined();

    // Clean up the console spy
    consoleSpy.mockRestore();
  });
});