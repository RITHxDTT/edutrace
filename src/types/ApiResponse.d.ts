export type ApiErrorField = {
  field: string;
  reason: string;
  message: string;
  allowedValues: string[];
}

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    payload: T;
    status: number;
    path: string;
    timestamp: string;
    code: string;
    errors: ApiErrorField[];
}