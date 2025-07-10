import api from './api';
import type { Dress } from '../types';

export async function getDresses(): Promise<Dress[]> {
  const response = await api.get<Dress[]>('dresses/');
  return response.data;
}

export async function getDress(id: number): Promise<Dress> {
  const response = await api.get<Dress>(`dresses/${id}/`);
  return response.data;
}
