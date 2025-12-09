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

    it('should handle login with all user fields', async () => {
      const mockUserData = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'hod',
        dept: 'CS',
        desg: 'Professor',
        department: 'Computer Science',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockUserData,
      });

      const result = await authService.login({
        _id: 'user123',
        password: 'password123',
      });

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('dept');
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.login({ _id: 'user123', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      const networkError = {
        message: 'Network error',
        code: 'ECONNABORTED',
      };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        authService.login({ _id: 'user123', password: 'password123' })
      ).rejects.toEqual(networkError);
    });

    it('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.post as any).mockRejectedValue(apiError);

      await expect(
        authService.login({ _id: 'user123', password: 'wrong' })
      ).rejects.toEqual(apiError);
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
      expect(result).toHaveProperty('message');
    });

    it('should handle sendOTP errors', async () => {
      const error = new Error('User not found');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(authService.sendOTP({ _id: 'invalid' })).rejects.toThrow('User not found');
    });

    it('should handle network errors when sending OTP', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(authService.sendOTP({ _id: 'user123' })).rejects.toEqual(networkError);
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
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('message');
    });

    it('should handle invalid OTP', async () => {
      const error = new Error('Invalid OTP');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.verifyOTP({ _id: 'user123', otp: '000000' })
      ).rejects.toThrow('Invalid OTP');
    });

    it('should handle expired OTP', async () => {
      const error = { response: { status: 400, data: { message: 'OTP expired' } } };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.verifyOTP({ _id: 'user123', otp: '123456' })
      ).rejects.toEqual(error);
    });

    it('should return token and message on successful verification', async () => {
      const mockResponse = {
        token: 'jwt-token-12345',
        message: 'OTP verified successfully',
      };
      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authService.verifyOTP({
        _id: 'user123',
        otp: '123456',
      });

      expect(result.token).toBe('jwt-token-12345');
      expect(result.message).toBe('OTP verified successfully');
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
      expect(result).toHaveProperty('message');
    });

    it('should handle invalid token error', async () => {
      const error = { response: { status: 401, data: { message: 'Invalid token' } } };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.resetPassword({
          _id: 'user123',
          newPassword: 'newPassword123',
          token: 'invalid-token',
        })
      ).rejects.toEqual(error);
    });

    it('should handle password validation errors', async () => {
      const error = { response: { status: 400, data: { message: 'Password too weak' } } };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        authService.resetPassword({
          _id: 'user123',
          newPassword: '123',
          token: 'test-token',
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors during password reset', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        authService.resetPassword({
          _id: 'user123',
          newPassword: 'newPassword123',
          token: 'test-token',
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', async () => {
      const mockResponse = { message: 'Password reset email sent successfully' };
      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await authService.forgotPassword({ _id: 'user123' });

      expect(apiClient.post).toHaveBeenCalledWith('/forgot-password', { _id: 'user123' });
      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('message');
    });

    it('should handle user not found error', async () => {
      const error = { response: { status: 404, data: { message: 'User not found' } } };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(authService.forgotPassword({ _id: 'invalid' })).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(authService.forgotPassword({ _id: 'user123' })).rejects.toEqual(networkError);
    });

    it('should handle API errors', async () => {
      const error = new Error('Server error');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(authService.forgotPassword({ _id: 'user123' })).rejects.toThrow('Server error');
    });
  });
});

