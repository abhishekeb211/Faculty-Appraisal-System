import { describe, it, expect, vi, beforeEach } from 'vitest';
import verificationService from '../../../services/api/verificationService';
import apiClient from '../../../services/api/client';

// Mock the API client
vi.mock('../../../services/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('verificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFacultyToVerify', () => {
    it('should get faculty to verify by verifier ID', async () => {
      const mockFaculty = [
        {
          _id: 'faculty1',
          name: 'Faculty 1',
          dept: 'CS',
          email: 'faculty1@example.com',
        },
        {
          _id: 'faculty2',
          name: 'Faculty 2',
          dept: 'CS',
          email: 'faculty2@example.com',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockFaculty,
      });

      const result = await verificationService.getFacultyToVerify('verifier123');

      expect(apiClient.get).toHaveBeenCalledWith('/faculty_to_verify/verifier123');
      expect(result).toEqual(mockFaculty);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should handle empty faculty array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await verificationService.getFacultyToVerify('verifier123');
      expect(result).toEqual([]);
    });

    it('should handle faculty with additional properties', async () => {
      const mockFaculty = [
        {
          _id: 'faculty1',
          name: 'Faculty 1',
          dept: 'CS',
          desg: 'Professor',
          department: 'Computer Science',
          customField: 'customValue',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockFaculty,
      });

      const result = await verificationService.getFacultyToVerify('verifier123');
      expect(result[0].customField).toBe('customValue');
    });

    it('should handle errors when fetching faculty', async () => {
      const error = new Error('Faculty not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(verificationService.getFacultyToVerify('invalid')).rejects.toThrow(
        'Faculty not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(verificationService.getFacultyToVerify('verifier123')).rejects.toEqual(
        networkError
      );
    });

    it('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 404,
          data: { message: 'Verifier not found' },
        },
      };
      (apiClient.get as any).mockRejectedValue(apiError);

      await expect(verificationService.getFacultyToVerify('invalid')).rejects.toEqual(apiError);
    });
  });

  describe('verifyResearch', () => {
    it('should submit verification for research (Part B)', async () => {
      const mockResponse = {
        success: true,
        message: 'Research verified successfully',
      };

      const verificationData = {
        verified: true,
        comments: 'Research verified',
        marks: 85,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.verifyResearch(
        'CS',
        'user123',
        'verifier123',
        verificationData
      );

      expect(apiClient.post).toHaveBeenCalledWith(
        '/CS/user123/verifier123/verify-research',
        verificationData
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Research verified successfully');
    });

    it('should handle verification with minimal data', async () => {
      const mockResponse = {
        success: true,
        message: 'Research verified successfully',
      };

      const verificationData = {
        verified: true,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.verifyResearch(
        'CS',
        'user123',
        'verifier123',
        verificationData
      );

      expect(result.success).toBe(true);
    });

    it('should handle verification rejection', async () => {
      const mockResponse = {
        success: false,
        message: 'Research verification rejected',
      };

      const verificationData = {
        verified: false,
        comments: 'Insufficient evidence',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.verifyResearch(
        'CS',
        'user123',
        'verifier123',
        verificationData
      );

      expect(result.success).toBe(false);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid verification data' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.verifyResearch('CS', 'user123', 'verifier123', {})
      ).rejects.toEqual(error);
    });

    it('should handle unauthorized errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to verify' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.verifyResearch('CS', 'user123', 'verifier123', {
          verified: true,
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        verificationService.verifyResearch('CS', 'user123', 'verifier123', {
          verified: true,
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('submitVerification', () => {
    it('should submit verification for form part', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification submitted successfully',
      };

      const verificationData = {
        verified: true,
        comments: 'Form part verified',
        marks: 90,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.submitVerification(
        'CS',
        'faculty123',
        'A',
        verificationData
      );

      expect(apiClient.post).toHaveBeenCalledWith('/CS/faculty123/A', verificationData);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle verification for different form parts', async () => {
      const parts = ['A', 'B', 'C', 'D', 'E'];

      for (const part of parts) {
        const mockResponse = {
          success: true,
          message: `Part ${part} verified successfully`,
        };

        (apiClient.post as any).mockResolvedValue({
          data: mockResponse,
        });

        const result = await verificationService.submitVerification(
          'CS',
          'faculty123',
          part,
          { verified: true }
        );

        expect(apiClient.post).toHaveBeenCalledWith(`/CS/faculty123/${part}`, {
          verified: true,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should handle verification with minimal data', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification submitted successfully',
      };

      const verificationData = {
        verified: true,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.submitVerification(
        'CS',
        'faculty123',
        'A',
        verificationData
      );

      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid verification data' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.submitVerification('CS', 'faculty123', 'A', {})
      ).rejects.toEqual(error);
    });

    it('should handle unauthorized errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to verify this part' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.submitVerification('CS', 'faculty123', 'A', {
          verified: true,
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        verificationService.submitVerification('CS', 'faculty123', 'A', {
          verified: true,
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getVerificationCommittee', () => {
    it('should get verification committee for a department', async () => {
      const mockCommittee = [
        {
          _id: 'member1',
          name: 'Committee Member 1',
          role: 'verifier',
          dept: 'CS',
        },
        {
          _id: 'member2',
          name: 'Committee Member 2',
          role: 'verifier',
          dept: 'CS',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockCommittee,
      });

      const result = await verificationService.getVerificationCommittee('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/verification-committee');
      expect(result).toEqual(mockCommittee);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty committee array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await verificationService.getVerificationCommittee('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching committee', async () => {
      const error = new Error('Committee not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(verificationService.getVerificationCommittee('CS')).rejects.toThrow(
        'Committee not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(verificationService.getVerificationCommittee('CS')).rejects.toEqual(
        networkError
      );
    });

    it('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 404,
          data: { message: 'Department not found' },
        },
      };
      (apiClient.get as any).mockRejectedValue(apiError);

      await expect(verificationService.getVerificationCommittee('INVALID')).rejects.toEqual(
        apiError
      );
    });
  });

  describe('addFacultyToVerificationCommittee', () => {
    it('should add faculty to verification committee', async () => {
      const mockResponse = {
        success: true,
        message: 'Faculty added to verification committee successfully',
      };

      const data = {
        facultyIds: ['faculty1', 'faculty2', 'faculty3'],
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.addFacultyToVerificationCommittee('CS', data);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/CS/verification-committee/addfaculties',
        data
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Faculty added to verification committee successfully');
    });

    it('should handle adding single faculty', async () => {
      const mockResponse = {
        success: true,
        message: 'Faculty added to verification committee successfully',
      };

      const data = {
        facultyIds: ['faculty1'],
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await verificationService.addFacultyToVerificationCommittee('CS', data);

      expect(result.success).toBe(true);
    });

    it('should handle empty faculty IDs array', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Faculty IDs cannot be empty' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.addFacultyToVerificationCommittee('CS', { facultyIds: [] })
      ).rejects.toEqual(error);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid faculty IDs' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.addFacultyToVerificationCommittee('CS', {
          facultyIds: ['invalid'],
        })
      ).rejects.toEqual(error);
    });

    it('should handle unauthorized errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to modify committee' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.addFacultyToVerificationCommittee('CS', {
          facultyIds: ['faculty1'],
        })
      ).rejects.toEqual(error);
    });

    it('should handle duplicate faculty errors', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Faculty already in committee' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        verificationService.addFacultyToVerificationCommittee('CS', {
          facultyIds: ['faculty1'],
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        verificationService.addFacultyToVerificationCommittee('CS', {
          facultyIds: ['faculty1'],
        })
      ).rejects.toEqual(networkError);
    });
  });
});
