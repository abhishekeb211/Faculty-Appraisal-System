import apiClient from './client';

export interface InteractionMarks {
  marks: number;
  comments?: string;
}

export interface ExternalMarks {
  marks: number;
  comments?: string;
}

export interface TotalMarks {
  total: number;
  breakdown?: {
    [key: string]: number;
  };
}

const evaluationService = {
  /**
   * Submit HOD interaction marks
   */
  async submitHODInteractionMarks(
    department: string,
    externalId: string,
    facultyId: string,
    data: InteractionMarks
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `/${department}/hod_interaction_marks/${externalId}/${facultyId}`,
      data
    );
    return response.data;
  },

  /**
   * Get external interaction marks
   */
  async getExternalInteractionMarks(externalId: string): Promise<ExternalMarks[]> {
    const response = await apiClient.get<ExternalMarks[]>(
      `/external_interaction_marks/${externalId}`
    );
    return response.data;
  },

  /**
   * Get total marks for a faculty member
   */
  async getTotalMarks(department: string, facultyId: string): Promise<TotalMarks> {
    const response = await apiClient.get<TotalMarks>(`/total_marks/${department}/${facultyId}`);
    return response.data;
  },

  /**
   * Get external assignments
   */
  async getExternalAssignments(department: string, externalId: string): Promise<any[]> {
    const response = await apiClient.get(`/${department}/external-assignments/${externalId}`);
    return response.data;
  },

  /**
   * Get external evaluators for a department
   */
  async getExternals(department: string): Promise<any[]> {
    const response = await apiClient.get(`/${department}/get-externals`);
    return response.data;
  },

  /**
   * Assign external evaluators
   */
  async assignExternals(department: string, data: any): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/${department}/assign-externals`, data);
    return response.data;
  },
};

export default evaluationService;

