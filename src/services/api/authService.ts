import apiClient from './client';

export interface LoginCredentials {
  _id: string;
  password: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role?: string;
  dept: string;
  desg?: string;
  department?: string;
  [key: string]: any;
}

export interface OTPRequest {
  _id: string;
}

export interface OTPVerification {
  _id: string;
  otp: string;
}

export interface PasswordReset {
  _id: string;
  newPassword: string;
  token: string;
}

const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<UserData> {
    const response = await apiClient.post<UserData>('/login', credentials);
    return response.data;
  },

  /**
   * Send OTP for password reset
   */
  async sendOTP(data: OTPRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/send-otp', data);
    return response.data;
  },

  /**
   * Verify OTP
   */
  async verifyOTP(data: OTPVerification): Promise<{ token: string; message: string }> {
    const response = await apiClient.post('/verify-otp', data);
    return response.data;
  },

  /**
   * Reset password
   */
  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    const response = await apiClient.post('/reset-user-password', data);
    return response.data;
  },

  /**
   * Forgot password
   */
  async forgotPassword(data: OTPRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/forgot-password', data);
    return response.data;
  },
};

export default authService;

