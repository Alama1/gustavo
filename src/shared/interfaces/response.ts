export interface HttpSuccessResponse<T> {
  readonly data: T;
}

export interface FailResponse {
  readonly message: string;
  readonly statusCode: number;
  readonly success: boolean;
}

export interface SuccessResponse {
  readonly message: string;
  readonly statusCode: number;
  readonly success: boolean;
}
