/**
 * API request and response types
 */

import { AxiosError } from 'axios';

export interface APIErrorResponse {
  error: string;
  code?: string;
  message?: string;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type APIError = AxiosError<APIErrorResponse>;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

