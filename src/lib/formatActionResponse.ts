export function formatActionResponse(
  data: any,
  isSuccess: boolean,
  statusCode: number,
  message?: string
) {
  return {
    success: isSuccess,
    data,
    statusCode,
    ...(message && { message }),
  };
}

export interface FormattedResponse<T = any> {
  success: boolean;
  data: T;
  statusCode: number;
  message?: string;
}
