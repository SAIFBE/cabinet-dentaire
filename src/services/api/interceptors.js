/**
 * Axios Interceptors — SECURITY:
 * - Response interceptor catches 401 errors
 * - On 401: auto-logout + redirect to /login
 * - No token injection (mock mode); with Sanctum, cookies handle this
 */

export function setupInterceptors(httpClient, logoutRef) {
  // Response interceptor: handle 401 → auto logout
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Auto-logout on 401
        if (logoutRef && logoutRef.current) {
          logoutRef.current();
        }
        // Redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}
