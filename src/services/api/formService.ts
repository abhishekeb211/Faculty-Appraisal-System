import apiClient from './client';

export type FormPart = 'A' | 'B' | 'C' | 'D' | 'E';

export interface FormStatus {
  status: 'pending' | 'submitted' | 'verified' | 'approved' | 'rejected';
  parts?: {
    A?: boolean;
    B?: boolean;
    C?: boolean;
    D?: boolean;
    E?: boolean;
  };
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
}

const formService = {
  /**
   * Get form data for a specific part
   */
  async getFormData(department: string, userId: string, part: FormPart): Promise<any> {
    const response = await apiClient.get(`/${department}/${userId}/${part}`);
    return response.data;
  },

  /**
   * Submit form data for a specific part
   */
  async submitFormData(
    department: string,
    userId: string,
    part: FormPart,
    data: any
  ): Promise<FormSubmissionResponse> {
    const response = await apiClient.post(`/${department}/${userId}/${part}`, data);
    return response.data;
  },

  /**
   * Get form submission status
   */
  async getFormStatus(department: string, userId: string): Promise<FormStatus> {
    const response = await apiClient.get(`/${department}/${userId}/get-status`);
    return response.data;
  },

  /**
   * Final form submission
   */
  async submitFinalForm(department: string, userId: string): Promise<FormSubmissionResponse> {
    const response = await apiClient.post(`/${department}/${userId}/submit-form`);
    return response.data;
  },

  /**
   * Generate PDF document
   */
  async generateDocument(department: string, userId: string): Promise<Blob> {
    const response = await apiClient.get(`/${department}/${userId}/generate-doc`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get all faculty final marks for a department
   */
  async getFinalMarks(department: string): Promise<any> {
    const response = await apiClient.get(`/${department}/all_faculties_final_marks`);
    return response.data;
  },

  /**
   * Send to director
   */
  async sendToDirector(department: string): Promise<FormSubmissionResponse> {
    const response = await apiClient.post(`/${department}/send-to-director`);
    return response.data;
  },

  /**
   * Get form data for a user (all parts)
   */
  async getUserFormData(department: string, userId: string): Promise<any> {
    const response = await apiClient.get(`/${department}/${userId}`);
    return response.data;
  },

  /**
   * Verify authority (HOD verification)
   */
  async verifyAuthority(
    department: string,
    facultyId: string
  ): Promise<FormSubmissionResponse> {
    const response = await apiClient.post(`/${department}/${facultyId}/verify-authority`);
    return response.data;
  },

  /**
   * Get HOD mark given status
   */
  async getHODMarkStatus(department: string, userId: string): Promise<{ given: boolean }> {
    const response = await apiClient.get(`/${department}/${userId}/hod-mark-given`);
    return response.data;
  },

  /**
   * Get portfolio given status
   */
  async getPortfolioStatus(department: string, userId: string): Promise<{ given: boolean }> {
    const response = await apiClient.get(`/${department}/${userId}/portfolio-given`);
    return response.data;
  },
};

export default formService;

