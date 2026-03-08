/**
 * HTTP Client — Axios instance with base configuration.
 * In mock mode, this is exported but API functions use mockServer directly.
 * When switching to Laravel Sanctum, configure baseURL and withCredentials here.
 */

import axios from 'axios';
import { setupInterceptors } from './interceptors';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // SECURITY: withCredentials for cookie-based auth with Laravel Sanctum
  withCredentials: true,
});

// Interceptors will be attached when auth context is available
export function initializeHttpClient(logoutRef) {
  setupInterceptors(httpClient, logoutRef);
}

export default httpClient;
