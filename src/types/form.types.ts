/**
 * Form data types for Parts A-E
 */

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

// Part A: Teaching Performance
export interface TeachingFormData {
  1?: {
    courses: { [courseCode: string]: any };
    marks?: number;
  };
  2?: {
    courses: { [courseCode: string]: any };
    marks?: number;
  };
  4?: {
    courses: { [courseCode: string]: any };
    marks?: number;
  };
  7?: {
    courses: { [courseCode: string]: any };
    marks?: number;
  };
  total_marks?: number;
}

// Part B: Research
export interface ResearchFormData {
  1?: { papers: any; marks?: number };
  2?: { conferences: any; marks?: number };
  [key: string]: any;
  total_marks?: number;
}

// Part C: Self Development
export interface SelfDevelopmentFormData {
  [key: string]: any;
  total_marks?: number;
}

// Part D: Portfolio
export interface PortfolioFormData {
  portfolioType?: string;
  selfAwardedMarks?: number;
  deanMarks?: number;
  hodMarks?: number;
  [key: string]: any;
}

// Part E: Extra Contribution
export interface ExtraFormData {
  bullet_points?: string;
  total_marks?: number;
  [key: string]: any;
}

export type FormData = 
  | TeachingFormData 
  | ResearchFormData 
  | SelfDevelopmentFormData 
  | PortfolioFormData 
  | ExtraFormData;

