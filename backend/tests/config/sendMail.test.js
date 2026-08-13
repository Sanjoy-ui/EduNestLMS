import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create a mock sendMail function
const mockSendMailFn = jest.fn();

// Import nodemailer and manually replace the module
import nodemailer from 'nodemailer';

// Override createTransport before importing Mail.js
nodemailer.createTransport = jest.fn(() => ({
  sendMail: mockSendMailFn,
}));

// Import after mocking
import sendMail from '../../configs/Mail.js';

describe('sendMail Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call nodemailer transporter.sendMail with the correct options', async () => {
    process.env.EMAIL = 'test@gmail.com';
    process.env.EMAIL_PASS = 'test_password';

    const testRecipient = 'user@example.com';
    const testOtp = '123456';

    await sendMail(testRecipient, testOtp);

    expect(mockSendMailFn).toHaveBeenCalledWith({
      from: 'test@gmail.com',
      to: testRecipient,
      subject: 'Reset Your Password',
      html: `<p>Your OTP for Password Reset is <b>${testOtp}</b>.
        It expires in 5 minutes.</p>`,
    });
  });
});
