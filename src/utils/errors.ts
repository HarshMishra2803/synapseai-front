/**
 * Extract a user-friendly error message from an unknown catch value.
 * Works with Axios errors (err.response.data.message) and generic Errors.
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object' &&
    'message' in err.response.data &&
    typeof (err.response.data as Record<string, unknown>).message === 'string'
  ) {
    return (err.response.data as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
