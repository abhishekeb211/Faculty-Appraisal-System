import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../../../services/api/authService';
import apiClient from '../../../services/api/client';

// Mock the API client
vi.mock('../../../services/api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call API with correct credentials', async () => {
      const mockUserData = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'faculty',
        dept: 'CS',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockUserData,
      });

      const credentials = {
        _id: 'user123',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/login', credentials);
      expect(result).toEqual(mockUserData);
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.login({ _id: 'user123', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('sendOTP', () => {
    it('should send OTP request', async () => {
      const mockResponse = { message: 'OTP sent successfully' };
      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authService.sendOTP({ _id: 'user123' });

      expect(apiClient.post).toHaveBeenCalledWith('/send-otp', { _id: 'user123' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP', async () => {
      const mockResponse = {
        token: 'test-token',
        message: 'OTP verified',
      };
      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authService.verifyOTP({
        _id: 'user123',
        otp: '123456',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/verify-otp', {
        _id: 'user123',
        otp: '123456',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const mockResponse = { message: 'Password reset successfully' };
      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authService.resetPassword({
        _id: 'user123',
        newPassword: 'newPassword123',
        token: 'test-token',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/reset-user-password', {
        _id: 'user123',
        newPassword: 'newPassword123',
        token: 'test-token',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});

