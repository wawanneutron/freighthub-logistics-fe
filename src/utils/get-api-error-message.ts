import axios from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status === 404) {
        return error.response.data?.message || 'Resource not found';
      }
      if (error.response.status === 422 || error.response.status === 400) {
        return error.response.data?.message || 'Validation error';
      }
      if (error.response.status >= 500) {
        return 'Internal server error. Please try again later.';
      }
      return error.response.data?.message || `Request failed with status ${error.response.status}`;
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
