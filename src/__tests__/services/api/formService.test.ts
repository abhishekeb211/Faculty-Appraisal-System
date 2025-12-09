import { describe, it, expect, vi, beforeEach } from 'vitest';
import formService from '../../../services/api/formService';
import apiClient from '../../../services/api/client';

// Mock the API client
vi.mock('../../../services/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('formService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFormData', () => {
    it('should fetch form data for a specific part', async () => {
      const mockFormData = {
        part: 'A',
        data: { field1: 'value1', field2: 'value2' },
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockFormData,
      });

      const result = await formService.getFormData('CS', 'user123', 'A');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123/A');
      expect(result).toEqual(mockFormData);
    });

    it('should handle all form parts (A, B, C, D, E)', async () => {
      const parts: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];

      for (const part of parts) {
        const mockData = { part, data: {} };
        (apiClient.get as any).mockResolvedValue({ data: mockData });

        const result = await formService.getFormData('CS', 'user123', part);
        expect(apiClient.get).toHaveBeenCalledWith(`/CS/user123/${part}`);
        expect(result).toEqual(mockData);
      }
    });

    it('should handle errors when fetching form data', async () => {
      const error = new Error('Form data not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getFormData('CS', 'user123', 'A')).rejects.toThrow(
        'Form data not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.getFormData('CS', 'user123', 'A')).rejects.toEqual(networkError);
    });

    it('should handle API errors with status codes', async () => {
      const apiError = {
        response: {
          status: 404,
          data: { message: 'Form not found' },
        },
      };
      (apiClient.get as any).mockRejectedValue(apiError);

      await expect(formService.getFormData('CS', 'user123', 'A')).rejects.toEqual(apiError);
    });
  });

  describe('submitFormData', () => {
    it('should submit form data for a specific part', async () => {
      const mockResponse = {
        success: true,
        message: 'Form data submitted successfully',
        data: { id: 'form123' },
      };

      const formData = { field1: 'value1', field2: 'value2' };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await formService.submitFormData('CS', 'user123', 'A', formData);

      expect(apiClient.post).toHaveBeenCalledWith('/CS/user123/A', formData);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Form data submitted successfully');
    });

    it('should handle submission errors', async () => {
      const error = { response: { status: 400, data: { message: 'Invalid form data' } } };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        formService.submitFormData('CS', 'user123', 'A', { invalid: 'data' })
      ).rejects.toEqual(error);
    });

    it('should handle validation errors', async () => {
      const validationError = {
        response: {
          status: 422,
          data: { message: 'Validation failed', errors: ['field1 is required'] },
        },
      };
      (apiClient.post as any).mockRejectedValue(validationError);

      await expect(
        formService.submitFormData('CS', 'user123', 'A', {})
      ).rejects.toEqual(validationError);
    });

    it('should handle network errors during submission', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        formService.submitFormData('CS', 'user123', 'A', { data: 'test' })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getFormStatus', () => {
    it('should fetch form submission status', async () => {
      const mockStatus = {
        status: 'submitted',
        parts: {
          A: true,
          B: true,
          C: false,
          D: false,
          E: false,
        },
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getFormStatus('CS', 'user123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123/get-status');
      expect(result).toEqual(mockStatus);
      expect(result.status).toBe('submitted');
    });

    it('should handle all status types', async () => {
      const statuses: Array<'pending' | 'submitted' | 'verified' | 'approved' | 'rejected'> = [
        'pending',
        'submitted',
        'verified',
        'approved',
        'rejected',
      ];

      for (const status of statuses) {
        const mockStatus = { status, parts: {} };
        (apiClient.get as any).mockResolvedValue({ data: mockStatus });

        const result = await formService.getFormStatus('CS', 'user123');
        expect(result.status).toBe(status);
      }
    });

    it('should handle errors when fetching status', async () => {
      const error = new Error('Status not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getFormStatus('CS', 'user123')).rejects.toThrow('Status not found');
    });

    it('should handle empty parts object', async () => {
      const mockStatus = {
        status: 'pending',
        parts: {},
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getFormStatus('CS', 'user123');
      expect(result.parts).toEqual({});
    });
  });

  describe('submitFinalForm', () => {
    it('should submit final form', async () => {
      const mockResponse = {
        success: true,
        message: 'Final form submitted successfully',
        data: { submittedAt: '2024-01-01' },
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await formService.submitFinalForm('CS', 'user123');

      expect(apiClient.post).toHaveBeenCalledWith('/CS/user123/submit-form');
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle submission errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Cannot submit incomplete form' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(formService.submitFinalForm('CS', 'user123')).rejects.toEqual(error);
    });

    it('should handle already submitted form', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Form already submitted' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(formService.submitFinalForm('CS', 'user123')).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(formService.submitFinalForm('CS', 'user123')).rejects.toEqual(networkError);
    });
  });

  describe('generateDocument', () => {
    it('should generate PDF document', async () => {
      const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });

      (apiClient.get as any).mockResolvedValue({
        data: mockBlob,
      });

      const result = await formService.generateDocument('CS', 'user123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123/generate-doc', {
        responseType: 'blob',
      });
      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle errors when generating document', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Form not found' },
        },
      };
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.generateDocument('CS', 'user123')).rejects.toEqual(error);
    });

    it('should handle network errors during document generation', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.generateDocument('CS', 'user123')).rejects.toEqual(networkError);
    });

    it('should return blob with correct type', async () => {
      const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      (apiClient.get as any).mockResolvedValue({ data: mockBlob });

      const result = await formService.generateDocument('CS', 'user123');
      expect(result.type).toBe('application/pdf');
    });
  });

  describe('getFinalMarks', () => {
    it('should get all faculty final marks for a department', async () => {
      const mockMarks = [
        { userId: 'user1', name: 'Faculty 1', marks: 85 },
        { userId: 'user2', name: 'Faculty 2', marks: 90 },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockMarks,
      });

      const result = await formService.getFinalMarks('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/all_faculties_final_marks');
      expect(result).toEqual(mockMarks);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty marks array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await formService.getFinalMarks('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching final marks', async () => {
      const error = new Error('Marks not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getFinalMarks('CS')).rejects.toThrow('Marks not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.getFinalMarks('CS')).rejects.toEqual(networkError);
    });
  });

  describe('sendToDirector', () => {
    it('should send forms to director', async () => {
      const mockResponse = {
        success: true,
        message: 'Forms sent to director successfully',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await formService.sendToDirector('CS');

      expect(apiClient.post).toHaveBeenCalledWith('/CS/send-to-director');
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle errors when sending to director', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'No forms to send' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(formService.sendToDirector('CS')).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(formService.sendToDirector('CS')).rejects.toEqual(networkError);
    });
  });

  describe('getUserFormData', () => {
    it('should get form data for a user (all parts)', async () => {
      const mockFormData = {
        partA: { data: 'A' },
        partB: { data: 'B' },
        partC: { data: 'C' },
        partD: { data: 'D' },
        partE: { data: 'E' },
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockFormData,
      });

      const result = await formService.getUserFormData('CS', 'user123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123');
      expect(result).toEqual(mockFormData);
    });

    it('should handle errors when fetching user form data', async () => {
      const error = new Error('User form data not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getUserFormData('CS', 'user123')).rejects.toThrow(
        'User form data not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.getUserFormData('CS', 'user123')).rejects.toEqual(networkError);
    });
  });

  describe('verifyAuthority', () => {
    it('should verify authority (HOD verification)', async () => {
      const mockResponse = {
        success: true,
        message: 'Authority verified successfully',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await formService.verifyAuthority('CS', 'faculty123');

      expect(apiClient.post).toHaveBeenCalledWith('/CS/faculty123/verify-authority');
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle errors when verifying authority', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Unauthorized to verify' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(formService.verifyAuthority('CS', 'faculty123')).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(formService.verifyAuthority('CS', 'faculty123')).rejects.toEqual(networkError);
    });
  });

  describe('getHODMarkStatus', () => {
    it('should get HOD mark given status', async () => {
      const mockStatus = { given: true };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getHODMarkStatus('CS', 'user123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123/hod-mark-given');
      expect(result).toEqual(mockStatus);
      expect(result.given).toBe(true);
    });

    it('should handle false status', async () => {
      const mockStatus = { given: false };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getHODMarkStatus('CS', 'user123');
      expect(result.given).toBe(false);
    });

    it('should handle errors when fetching HOD mark status', async () => {
      const error = new Error('Status not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getHODMarkStatus('CS', 'user123')).rejects.toThrow(
        'Status not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.getHODMarkStatus('CS', 'user123')).rejects.toEqual(networkError);
    });
  });

  describe('getPortfolioStatus', () => {
    it('should get portfolio given status', async () => {
      const mockStatus = { given: true };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getPortfolioStatus('CS', 'user123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/user123/portfolio-given');
      expect(result).toEqual(mockStatus);
      expect(result.given).toBe(true);
    });

    it('should handle false status', async () => {
      const mockStatus = { given: false };

      (apiClient.get as any).mockResolvedValue({
        data: mockStatus,
      });

      const result = await formService.getPortfolioStatus('CS', 'user123');
      expect(result.given).toBe(false);
    });

    it('should handle errors when fetching portfolio status', async () => {
      const error = new Error('Status not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(formService.getPortfolioStatus('CS', 'user123')).rejects.toThrow(
        'Status not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(formService.getPortfolioStatus('CS', 'user123')).rejects.toEqual(networkError);
    });
  });
});
