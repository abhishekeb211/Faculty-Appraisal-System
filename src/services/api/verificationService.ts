import apiClient from './client';

export interface VerificationData {
  [key: string]: any;
}

export interface FacultyToVerify {
  _id: string;
  name: string;
  dept: string;
  [key: string]: any;
}

const verificationService = {
  /**
   * Get faculty to verify by verifier ID
   */
  async getFacultyToVerify(verifierId: string): Promise<FacultyToVerify[]> {
    const response = await apiClient.get<FacultyToVerify[]>(`/faculty_to_verify/${verifierId}`);
    return response.data;
  },

  /**
   * Submit verification for research (Part B)
   */
  async verifyResearch(
    department: string,
    userId: string,
    verifierId: string,
    data: VerificationData
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `/${department}/${userId}/${verifierId}/verify-research`,
      data
    );
    return response.data;
  },

  /**
   * Submit verification for form part
   */
  async submitVerification(
    department: string,
    facultyId: string,
    part: string,
    data: VerificationData
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/${department}/${facultyId}/${part}`, data);
    return response.data;
  },

  /**
   * Get verification committee for a department
   */
  async getVerificationCommittee(department: string): Promise<any[]> {
    const response = await apiClient.get(`/${department}/verification-committee`);
    return response.data;
  },

  /**
   * Add faculty to verification committee
   */
  async addFacultyToVerificationCommittee(
    department: string,
    data: { facultyIds: string[] }
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/${department}/verification-committee/addfaculties`, data);
    return response.data;
  },
};

export default verificationService;

