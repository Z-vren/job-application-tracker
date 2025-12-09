import { Platform } from 'react-native';
import { Application, ApplicationInput, AuthResponse } from '../types';

const localBase =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? localBase
    : 'https://job-application-tracker-production-4656.up.railway.app';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let message = 'Request failed';
    try {
      const parsed = JSON.parse(errorText);
      message = parsed.message || message;
    } catch {
      message = errorText || message;
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: { email, password } }),
  getApplications: (token: string | null) =>
    request<Application[]>('/applications', { token }),
  createApplication: (token: string | null, payload: ApplicationInput) =>
    request<Application>('/applications', { method: 'POST', body: payload, token }),
  updateApplication: (token: string | null, id: string, payload: Partial<ApplicationInput>) =>
    request<Application>(`/applications/${id}`, { method: 'PUT', body: payload, token }),
  deleteApplication: (token: string | null, id: string) =>
    request<void>(`/applications/${id}`, { method: 'DELETE', token }),
};

export { API_BASE_URL };

