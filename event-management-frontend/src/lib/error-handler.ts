// src/lib/error-handler.ts
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  public status?: number;
  public errors?: Array<{field: string, message: string}>;

  constructor(message: string, status?: number, errors?: Array<{field: string, message: string}>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const response = error.response;
    
    if (response) {
      const data = response.data as ErrorResponse;
      
      // Specific error handling based on status code
      switch (response.status) {
        case 400:
          return new ApiError('Bad Request', 400, data.errors);
        case 401:
          return new ApiError('Unauthorized. Please log in again.', 401);
        case 403:
          return new ApiError('Forbidden. You do not have permission.', 403);
        case 404:
          return new ApiError('Resource not found', 404);
        case 422:
          return new ApiError('Validation Error', 422, data.errors);
        case 500:
          return new ApiError('Internal Server Error', 500);
        default:
          return new ApiError(data.message || 'An unexpected error occurred', response.status);
      }
    }
    
    // Network error or no response
    return new ApiError('Network Error. Please check your connection.');
  }
  
  // Unknown error
  return new ApiError('An unexpected error occurred');
}

// Error Boundary Component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const errorHandler = (error: ApiError) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', errorHandler as EventListener);
    return () => {
      window.removeEventListener('error', errorHandler as EventListener);
    };
  }, []);

  if (hasError) {
    return (
      <div className="error-boundary">
        <h1>Something went wrong</h1>
        <p>{error?.message}</p>
        {error?.errors && (
          <ul>
            {error.errors.map((err, index) => (
              <li key={index}>{err.field}: {err.message}</li>
            ))}
          </ul>
        )}
        <button onClick={() => {
          setHasError(false);
          setError(null);
        }}>
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for error handling
export function useErrorHandler() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = (err: unknown) => {
    const apiError = handleApiError(err);
    setError(apiError);
    // Optionally log to monitoring service
    console.error(apiError);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}