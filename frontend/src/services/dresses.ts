import api from './api';

export interface Dress {
  id: number;
  name: string;
  description: string;
  image: string;
  style: string;
  available: boolean;
  created_at: string;
}

export async function getDresses(): Promise<Dress[]> {
  const response = await api.get<Dress[]>('dresses/');
  return response.data;
}
