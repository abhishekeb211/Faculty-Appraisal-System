import { describe, it, expect, vi, beforeEach } from 'vitest';
import userService from '../../../services/api/userService';
import apiClient from '../../../services/api/client';

// Mock the API client
vi.mock('../../../services/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        {
          _id: 'user1',
          name: 'User 1',
          email: 'user1@example.com',
          role: 'faculty',
          dept: 'CS',
        },
        {
          _id: 'user2',
          name: 'User 2',
          email: 'user2@example.com',
          role: 'hod',
          dept: 'CS',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockUsers,
      });

      const result = await userService.getAllUsers();

      expect(apiClient.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should handle empty users array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await userService.getAllUsers();
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching users', async () => {
      const error = new Error('Failed to fetch users');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('Failed to fetch users');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(userService.getAllUsers()).rejects.toEqual(networkError);
    });

    it('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 403,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.get as any).mockRejectedValue(apiError);

      await expect(userService.getAllUsers()).rejects.toEqual(apiError);
    });
  });

  describe('getUserById', () => {
    it('should fetch user by ID', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'faculty',
        dept: 'CS',
        desg: 'Professor',
        department: 'Computer Science',
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockUser,
      });

      const result = await userService.getUserById('user123');

      expect(apiClient.get).toHaveBeenCalledWith('/users/user123');
      expect(result).toEqual(mockUser);
      expect(result._id).toBe('user123');
      expect(result.name).toBe('Test User');
    });

    it('should handle user not found error', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'User not found' },
        },
      };
      (apiClient.get as any).mockRejectedValue(error);

      await expect(userService.getUserById('invalid')).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(userService.getUserById('user123')).rejects.toEqual(networkError);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createData = {
        _id: 'user123',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'faculty',
        dept: 'CS',
        desg: 'Assistant Professor',
        department: 'Computer Science',
      };

      const mockCreatedUser = {
        _id: 'user123',
        name: 'New User',
        email: 'newuser@example.com',
        role: 'faculty',
        dept: 'CS',
        desg: 'Assistant Professor',
        department: 'Computer Science',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockCreatedUser,
      });

      const result = await userService.createUser(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/users', createData);
      expect(result).toEqual(mockCreatedUser);
      expect(result._id).toBe('user123');
      expect(result.name).toBe('New User');
    });

    it('should handle validation errors', async () => {
      const createData = {
        _id: 'user123',
        name: '',
        email: 'invalid-email',
        password: '123',
        dept: 'CS',
      };

      const error = {
        response: {
          status: 400,
          data: { message: 'Validation failed', errors: ['Name is required', 'Invalid email'] },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(userService.createUser(createData)).rejects.toEqual(error);
    });

    it('should handle duplicate user error', async () => {
      const createData = {
        _id: 'user123',
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
        dept: 'CS',
      };

      const error = {
        response: {
          status: 409,
          data: { message: 'User already exists' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(userService.createUser(createData)).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        userService.createUser({
          _id: 'user123',
          name: 'User',
          email: 'user@example.com',
          password: 'password123',
          dept: 'CS',
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        role: 'hod',
      };

      const mockUpdatedUser = {
        _id: 'user123',
        name: 'Updated Name',
        email: 'updated@example.com',
        role: 'hod',
        dept: 'CS',
      };

      (apiClient.put as any).mockResolvedValue({
        data: mockUpdatedUser,
      });

      const result = await userService.updateUser('user123', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/users/user123', updateData);
      expect(result).toEqual(mockUpdatedUser);
      expect(result.name).toBe('Updated Name');
    });

    it('should handle partial updates', async () => {
      const updateData = {
        name: 'New Name',
      };

      const mockUpdatedUser = {
        _id: 'user123',
        name: 'New Name',
        email: 'test@example.com',
        dept: 'CS',
      };

      (apiClient.put as any).mockResolvedValue({
        data: mockUpdatedUser,
      });

      const result = await userService.updateUser('user123', updateData);
      expect(result.name).toBe('New Name');
    });

    it('should handle user not found error', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'User not found' },
        },
      };
      (apiClient.put as any).mockRejectedValue(error);

      await expect(userService.updateUser('invalid', { name: 'Test' })).rejects.toEqual(error);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' },
        },
      };
      (apiClient.put as any).mockRejectedValue(error);

      await expect(
        userService.updateUser('user123', { email: 'invalid-email' })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.put as any).mockRejectedValue(networkError);

      await expect(userService.updateUser('user123', { name: 'Test' })).rejects.toEqual(
        networkError
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const mockResponse = { message: 'User deleted successfully' };

      (apiClient.delete as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await userService.deleteUser('user123');

      expect(apiClient.delete).toHaveBeenCalledWith('/users/user123');
      expect(result).toEqual(mockResponse);
      expect(result.message).toBe('User deleted successfully');
    });

    it('should handle user not found error', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'User not found' },
        },
      };
      (apiClient.delete as any).mockRejectedValue(error);

      await expect(userService.deleteUser('invalid')).rejects.toEqual(error);
    });

    it('should handle unauthorized error', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to delete user' },
        },
      };
      (apiClient.delete as any).mockRejectedValue(error);

      await expect(userService.deleteUser('user123')).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.delete as any).mockRejectedValue(networkError);

      await expect(userService.deleteUser('user123')).rejects.toEqual(networkError);
    });
  });

  describe('getAllFaculties', () => {
    it('should fetch all faculty members', async () => {
      const mockFaculties = [
        {
          _id: 'faculty1',
          name: 'Faculty 1',
          email: 'faculty1@example.com',
          role: 'faculty',
          dept: 'CS',
        },
        {
          _id: 'faculty2',
          name: 'Faculty 2',
          email: 'faculty2@example.com',
          role: 'faculty',
          dept: 'EE',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockFaculties,
      });

      const result = await userService.getAllFaculties();

      expect(apiClient.get).toHaveBeenCalledWith('/all-faculties');
      expect(result).toEqual(mockFaculties);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty faculties array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await userService.getAllFaculties();
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching faculties', async () => {
      const error = new Error('Failed to fetch faculties');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(userService.getAllFaculties()).rejects.toThrow('Failed to fetch faculties');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(userService.getAllFaculties()).rejects.toEqual(networkError);
    });
  });

  describe('getFacultyByDepartment', () => {
    it('should fetch faculty by department', async () => {
      const mockFaculties = [
        {
          _id: 'faculty1',
          name: 'Faculty 1',
          email: 'faculty1@example.com',
          role: 'faculty',
          dept: 'CS',
        },
        {
          _id: 'faculty2',
          name: 'Faculty 2',
          email: 'faculty2@example.com',
          role: 'faculty',
          dept: 'CS',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockFaculties,
      });

      const result = await userService.getFacultyByDepartment('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/faculty/CS');
      expect(result).toEqual(mockFaculties);
      expect(result.every((f) => f.dept === 'CS')).toBe(true);
    });

    it('should handle empty department faculties', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await userService.getFacultyByDepartment('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching department faculties', async () => {
      const error = new Error('Department not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(userService.getFacultyByDepartment('INVALID')).rejects.toThrow(
        'Department not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(userService.getFacultyByDepartment('CS')).rejects.toEqual(networkError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        dept: 'EE',
      };

      const mockUpdatedUser = {
        _id: 'user123',
        name: 'Updated Name',
        email: 'updated@example.com',
        dept: 'EE',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockUpdatedUser,
      });

      const result = await userService.updateProfile(updateData);

      expect(apiClient.post).toHaveBeenCalledWith('/update-profile', updateData);
      expect(result).toEqual(mockUpdatedUser);
      expect(result.name).toBe('Updated Name');
    });

    it('should handle partial profile updates', async () => {
      const updateData = {
        name: 'New Name',
      };

      const mockUpdatedUser = {
        _id: 'user123',
        name: 'New Name',
        email: 'test@example.com',
        dept: 'CS',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockUpdatedUser,
      });

      const result = await userService.updateProfile(updateData);
      expect(result.name).toBe('New Name');
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        userService.updateProfile({ email: 'invalid-email' })
      ).rejects.toEqual(error);
    });

    it('should handle unauthorized error', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(userService.updateProfile({ name: 'Test' })).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(userService.updateProfile({ name: 'Test' })).rejects.toEqual(networkError);
    });
  });
});
