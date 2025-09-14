export function formatActionResponse(
  data: any,
  isSuccess: boolean,
  statusCode: number
) {
  return {
    success: isSuccess,
    data: data,
    statusCode: statusCode,
  };
}
