import { describe, it, expect, vi, beforeEach } from 'vitest';
import evaluationService from '../../../services/api/evaluationService';
import apiClient from '../../../services/api/client';

// Mock the API client
vi.mock('../../../services/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('evaluationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitHODInteractionMarks', () => {
    it('should submit HOD interaction marks', async () => {
      const mockResponse = {
        success: true,
        message: 'HOD interaction marks submitted successfully',
      };

      const marksData = {
        marks: 85,
        comments: 'Good performance',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.submitHODInteractionMarks(
        'CS',
        'external123',
        'faculty123',
        marksData
      );

      expect(apiClient.post).toHaveBeenCalledWith(
        '/CS/hod_interaction_marks/external123/faculty123',
        marksData
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle marks without comments', async () => {
      const mockResponse = {
        success: true,
        message: 'Marks submitted successfully',
      };

      const marksData = {
        marks: 90,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.submitHODInteractionMarks(
        'CS',
        'external123',
        'faculty123',
        marksData
      );

      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid marks value' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        evaluationService.submitHODInteractionMarks('CS', 'external123', 'faculty123', {
          marks: 150,
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.submitHODInteractionMarks('CS', 'external123', 'faculty123', {
          marks: 85,
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getExternalInteractionMarks', () => {
    it('should get external interaction marks', async () => {
      const mockMarks = [
        {
          marks: 85,
          comments: 'Good performance',
        },
        {
          marks: 90,
          comments: 'Excellent work',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockMarks,
      });

      const result = await evaluationService.getExternalInteractionMarks('external123');

      expect(apiClient.get).toHaveBeenCalledWith('/external_interaction_marks/external123');
      expect(result).toEqual(mockMarks);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty marks array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getExternalInteractionMarks('external123');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching marks', async () => {
      const error = new Error('Marks not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(
        evaluationService.getExternalInteractionMarks('invalid')
      ).rejects.toThrow('Marks not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.getExternalInteractionMarks('external123')
      ).rejects.toEqual(networkError);
    });
  });

  describe('getTotalMarks', () => {
    it('should get total marks for a faculty member', async () => {
      const mockTotalMarks = {
        total: 450,
        breakdown: {
          partA: 100,
          partB: 100,
          partC: 100,
          partD: 100,
          partE: 50,
        },
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockTotalMarks,
      });

      const result = await evaluationService.getTotalMarks('CS', 'faculty123');

      expect(apiClient.get).toHaveBeenCalledWith('/total_marks/CS/faculty123');
      expect(result).toEqual(mockTotalMarks);
      expect(result.total).toBe(450);
      expect(result.breakdown).toBeDefined();
    });

    it('should handle marks without breakdown', async () => {
      const mockTotalMarks = {
        total: 450,
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockTotalMarks,
      });

      const result = await evaluationService.getTotalMarks('CS', 'faculty123');
      expect(result.total).toBe(450);
      expect(result.breakdown).toBeUndefined();
    });

    it('should handle errors when fetching total marks', async () => {
      const error = new Error('Marks not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(evaluationService.getTotalMarks('CS', 'invalid')).rejects.toThrow(
        'Marks not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getTotalMarks('CS', 'faculty123')).rejects.toEqual(
        networkError
      );
    });
  });

  describe('getExternalAssignments', () => {
    it('should get external assignments', async () => {
      const mockAssignments = [
        {
          externalId: 'external1',
          facultyId: 'faculty1',
          department: 'CS',
        },
        {
          externalId: 'external1',
          facultyId: 'faculty2',
          department: 'CS',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockAssignments,
      });

      const result = await evaluationService.getExternalAssignments('CS', 'external123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/external-assignments/external123');
      expect(result).toEqual(mockAssignments);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty assignments array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getExternalAssignments('CS', 'external123');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching assignments', async () => {
      const error = new Error('Assignments not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(
        evaluationService.getExternalAssignments('CS', 'invalid')
      ).rejects.toThrow('Assignments not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.getExternalAssignments('CS', 'external123')
      ).rejects.toEqual(networkError);
    });
  });

  describe('getExternals', () => {
    it('should get external evaluators for a department', async () => {
      const mockExternals = [
        {
          _id: 'external1',
          name: 'External 1',
          email: 'external1@example.com',
        },
        {
          _id: 'external2',
          name: 'External 2',
          email: 'external2@example.com',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockExternals,
      });

      const result = await evaluationService.getExternals('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/get-externals');
      expect(result).toEqual(mockExternals);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty externals array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getExternals('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching externals', async () => {
      const error = new Error('Externals not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(evaluationService.getExternals('CS')).rejects.toThrow('Externals not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getExternals('CS')).rejects.toEqual(networkError);
    });
  });

  describe('assignExternals', () => {
    it('should assign external evaluators', async () => {
      const mockResponse = {
        success: true,
        message: 'External evaluators assigned successfully',
      };

      const assignmentData = {
        externalId: 'external123',
        facultyIds: ['faculty1', 'faculty2'],
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.assignExternals('CS', assignmentData);

      expect(apiClient.post).toHaveBeenCalledWith('/CS/assign-externals', assignmentData);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid assignment data' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        evaluationService.assignExternals('CS', { externalId: '', facultyIds: [] })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.assignExternals('CS', {
          externalId: 'external123',
          facultyIds: ['faculty1'],
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getExternalAssignmentsByDepartment', () => {
    it('should get external assignments for a department', async () => {
      const mockAssignments = [
        {
          externalId: 'external1',
          facultyId: 'faculty1',
        },
        {
          externalId: 'external2',
          facultyId: 'faculty2',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockAssignments,
      });

      const result = await evaluationService.getExternalAssignmentsByDepartment('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/external-assignments');
      expect(result).toEqual(mockAssignments);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty assignments array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getExternalAssignmentsByDepartment('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching assignments', async () => {
      const error = new Error('Assignments not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(
        evaluationService.getExternalAssignmentsByDepartment('CS')
      ).rejects.toThrow('Assignments not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.getExternalAssignmentsByDepartment('CS')
      ).rejects.toEqual(networkError);
    });
  });

  describe('getExternalDeanAssignments', () => {
    it('should get external dean assignments', async () => {
      const mockAssignments = [
        {
          externalId: 'external1',
          deanId: 'dean1',
        },
        {
          externalId: 'external2',
          deanId: 'dean2',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockAssignments,
      });

      const result = await evaluationService.getExternalDeanAssignments('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/external-dean-assignments');
      expect(result).toEqual(mockAssignments);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty assignments array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getExternalDeanAssignments('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching assignments', async () => {
      const error = new Error('Assignments not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(
        evaluationService.getExternalDeanAssignments('CS')
      ).rejects.toThrow('Assignments not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getExternalDeanAssignments('CS')).rejects.toEqual(
        networkError
      );
    });
  });

  describe('getInteractionDeans', () => {
    it('should get interaction deans for a department', async () => {
      const mockDeans = [
        {
          _id: 'dean1',
          name: 'Dean 1',
          email: 'dean1@example.com',
        },
        {
          _id: 'dean2',
          name: 'Dean 2',
          email: 'dean2@example.com',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockDeans,
      });

      const result = await evaluationService.getInteractionDeans('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/interaction-deans');
      expect(result).toEqual(mockDeans);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty deans array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getInteractionDeans('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching deans', async () => {
      const error = new Error('Deans not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(evaluationService.getInteractionDeans('CS')).rejects.toThrow('Deans not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getInteractionDeans('CS')).rejects.toEqual(networkError);
    });
  });

  describe('getDeanExternalMappings', () => {
    it('should get dean external mappings', async () => {
      const mockMappings = [
        {
          deanId: 'dean1',
          externalId: 'external1',
          department: 'CS',
        },
        {
          deanId: 'dean2',
          externalId: 'external2',
          department: 'CS',
        },
      ];

      (apiClient.get as any).mockResolvedValue({
        data: mockMappings,
      });

      const result = await evaluationService.getDeanExternalMappings('CS');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/dean-external-mappings');
      expect(result).toEqual(mockMappings);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty mappings array', async () => {
      (apiClient.get as any).mockResolvedValue({
        data: [],
      });

      const result = await evaluationService.getDeanExternalMappings('CS');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching mappings', async () => {
      const error = new Error('Mappings not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(evaluationService.getDeanExternalMappings('CS')).rejects.toThrow(
        'Mappings not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getDeanExternalMappings('CS')).rejects.toEqual(networkError);
    });
  });

  describe('assignDeanToExternal', () => {
    it('should assign dean to external', async () => {
      const mockResponse = {
        success: true,
        message: 'Dean assigned to external successfully',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.assignDeanToExternal('CS', 'external123', 'dean123');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/CS/dean-external-assignment/external123/dean123'
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid assignment' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        evaluationService.assignDeanToExternal('CS', 'invalid', 'invalid')
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.assignDeanToExternal('CS', 'external123', 'dean123')
      ).rejects.toEqual(networkError);
    });
  });

  describe('removeDeanFromExternal', () => {
    it('should remove dean from external', async () => {
      const mockResponse = {
        success: true,
        message: 'Dean removed from external successfully',
      };

      const data = {
        externalId: 'external123',
        deanId: 'dean123',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.removeDeanFromExternal('CS', data);

      expect(apiClient.post).toHaveBeenCalledWith('/CS/remove-dean-from-external', data);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Assignment not found' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        evaluationService.removeDeanFromExternal('CS', {
          externalId: 'invalid',
          deanId: 'invalid',
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.removeDeanFromExternal('CS', {
          externalId: 'external123',
          deanId: 'dean123',
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getExternalInteractionMarksForFaculty', () => {
    it('should get external interaction marks for specific faculty', async () => {
      const mockMarks = {
        marks: 85,
        comments: 'Good performance',
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockMarks,
      });

      const result = await evaluationService.getExternalInteractionMarksForFaculty(
        'external123',
        'faculty123'
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        '/external_interaction_marks/external123/faculty123'
      );
      expect(result).toEqual(mockMarks);
      expect(result.marks).toBe(85);
    });

    it('should handle marks without comments', async () => {
      const mockMarks = {
        marks: 90,
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockMarks,
      });

      const result = await evaluationService.getExternalInteractionMarksForFaculty(
        'external123',
        'faculty123'
      );
      expect(result.marks).toBe(90);
      expect(result.comments).toBeUndefined();
    });

    it('should handle errors when fetching marks', async () => {
      const error = new Error('Marks not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(
        evaluationService.getExternalInteractionMarksForFaculty('invalid', 'invalid')
      ).rejects.toThrow('Marks not found');
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.getExternalInteractionMarksForFaculty('external123', 'faculty123')
      ).rejects.toEqual(networkError);
    });
  });

  describe('submitExternalInteractionMarks', () => {
    it('should submit external interaction marks', async () => {
      const mockResponse = {
        success: true,
        message: 'External interaction marks submitted successfully',
      };

      const marksData = {
        marks: 85,
        comments: 'Good performance',
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.submitExternalInteractionMarks(
        'CS',
        'external123',
        'faculty123',
        marksData
      );

      expect(apiClient.post).toHaveBeenCalledWith(
        '/CS/external_interaction_marks/external123/faculty123',
        marksData
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle marks without comments', async () => {
      const mockResponse = {
        success: true,
        message: 'Marks submitted successfully',
      };

      const marksData = {
        marks: 90,
      };

      (apiClient.post as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await evaluationService.submitExternalInteractionMarks(
        'CS',
        'external123',
        'faculty123',
        marksData
      );

      expect(result.success).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid marks value' },
        },
      };
      (apiClient.post as any).mockRejectedValue(error);

      await expect(
        evaluationService.submitExternalInteractionMarks('CS', 'external123', 'faculty123', {
          marks: 150,
        })
      ).rejects.toEqual(error);
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.post as any).mockRejectedValue(networkError);

      await expect(
        evaluationService.submitExternalInteractionMarks('CS', 'external123', 'faculty123', {
          marks: 85,
        })
      ).rejects.toEqual(networkError);
    });
  });

  describe('getFacultyTotal', () => {
    it('should get total marks for faculty with breakdown', async () => {
      const mockTotalMarks = {
        total: 450,
        breakdown: {
          partA: 100,
          partB: 100,
          partC: 100,
          partD: 100,
          partE: 50,
        },
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockTotalMarks,
      });

      const result = await evaluationService.getFacultyTotal('CS', 'faculty123');

      expect(apiClient.get).toHaveBeenCalledWith('/CS/faculty123/total');
      expect(result).toEqual(mockTotalMarks);
      expect(result.total).toBe(450);
      expect(result.breakdown).toBeDefined();
    });

    it('should handle marks without breakdown', async () => {
      const mockTotalMarks = {
        total: 450,
      };

      (apiClient.get as any).mockResolvedValue({
        data: mockTotalMarks,
      });

      const result = await evaluationService.getFacultyTotal('CS', 'faculty123');
      expect(result.total).toBe(450);
      expect(result.breakdown).toBeUndefined();
    });

    it('should handle errors when fetching total marks', async () => {
      const error = new Error('Marks not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(evaluationService.getFacultyTotal('CS', 'invalid')).rejects.toThrow(
        'Marks not found'
      );
    });

    it('should handle network errors', async () => {
      const networkError = { message: 'Network error' };
      (apiClient.get as any).mockRejectedValue(networkError);

      await expect(evaluationService.getFacultyTotal('CS', 'faculty123')).rejects.toEqual(
        networkError
      );
    });
  });
});
