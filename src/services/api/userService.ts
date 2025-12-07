import apiClient from './client';

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  dept: string;
  desg?: string;
  department?: string;
  [key: string]: any;
}

export interface CreateUserData {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  dept: string;
  desg?: string;
  department?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  dept?: string;
  desg?: string;
  department?: string;
}

const userService = {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Get all faculty members
   */
  async getAllFaculties(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/all-faculties');
    return response.data;
  },

  /**
   * Get faculty by department
   */
  async getFacultyByDepartment(department: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/faculty/${department}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await apiClient.post<User>('/update-profile', data);
    return response.data;
  },
};

export default userService;

