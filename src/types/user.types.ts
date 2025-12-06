/**
 * User and authentication types
 */

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

export interface LoginCredentials {
  _id: string;
  password: string;
}

export type UserRole = 
  | 'admin' 
  | 'faculty' 
  | 'hod' 
  | 'dean' 
  | 'director' 
  | 'external' 
  | 'verification_team';

export interface AuthState {
  isAuthenticated: boolean;
  userData: User | null;
  userRole: UserRole | null;
}

