import api from './api';

export interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  status: string;
  auto_confirmed: boolean;
  created_at: string;
  // Agrega más campos según tu modelo
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>('appointments/');
  return response.data;
}
