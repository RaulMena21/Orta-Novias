import api from './api';

export async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token');
  const response = await api.post<{ access: string }>('token/refresh/', { refresh });
  localStorage.setItem('access', response.data.access);
  return response.data.access;
}
