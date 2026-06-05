export interface ApiSuccessResponse<T> {
  status: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export interface ApiExceptionResponse {
  status: boolean;
  message: string;
  errors?: unknown[];
}
