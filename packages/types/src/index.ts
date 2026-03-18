export * from './organization';
export * from './user';
export * from './plan';
export * from './invoice';

// Generic API Response
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
  statusCode: number;
}
