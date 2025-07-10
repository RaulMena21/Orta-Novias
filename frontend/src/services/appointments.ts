import api from './api';
import type { Appointment } from '../types';

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>('appointments/');
  return response.data;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'status' | 'auto_confirmed'>): Promise<Appointment> {
  const response = await api.post<Appointment>('appointments/', appointment);
  return response.data;
}

export async function getAppointment(id: number): Promise<Appointment> {
  const response = await api.get<Appointment>(`appointments/${id}/`);
  return response.data;
}
