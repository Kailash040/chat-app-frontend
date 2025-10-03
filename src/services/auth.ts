import { clearStoredToken, getStoredToken, http, setStoredToken } from '@/src/lib/http';

export type User = {
  _id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/api/auth/register', { name, email, password });
  await setStoredToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/api/auth/login', { email, password });
  await setStoredToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  await clearStoredToken();
}

export async function getToken(): Promise<string | null> {
  return getStoredToken();
}


