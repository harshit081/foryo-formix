import { apiFetch } from './apiClient';

export async function checkHealth() {
  return apiFetch('/health');
}

export async function getAuthConfig() {
  return apiFetch('/api/auth/config');
}

export async function fetchCurrentUser(token: string) {
  return apiFetch('/api/auth/me', { token });
}

export async function exchangeGoogleCode(code: string) {
  return apiFetch('/api/auth/google-callback', {
    method: 'POST',
    bodyData: { code },
  });
}
