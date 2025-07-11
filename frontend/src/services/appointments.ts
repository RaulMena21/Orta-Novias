import apiClient from './api';

export interface Appointment {
  id: number;
  user: number;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BusinessHoursInfo {
  working_days: string[];
  working_hours: {
    morning: { start: string; end: string };
    afternoon: { start: string; end: string };
  };
  time_slots: string[];
  timezone: string;
}

export interface DateValidation {
  is_valid: boolean;
  date: string;
  is_working_day: boolean;
  next_working_day: string;
  message: string;
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get('/appointments/');
    return response.data as Appointment[];
  },

  async createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const response = await apiClient.post('/appointments/', data);
    return response.data as Appointment;
  },

  async getBookedAppointments(date: string): Promise<string[]> {
    console.log('🔍 Buscando citas ocupadas para:', date);
    const response = await apiClient.get(`/appointments/?date=${date}&status=confirmed`);
    console.log('📋 Respuesta completa:', response.data);
    
    const appointments = response.data as Appointment[];
    const bookedTimes = appointments.map((appointment: Appointment) => {
      const originalTime = appointment.time;
      const formattedTime = originalTime.substring(0, 5);
      console.log(`⏰ Hora original: ${originalTime} → Hora formateada: ${formattedTime}`);
      return formattedTime;
    });
    
    console.log('🚫 Horas ocupadas finales:', bookedTimes);
    return bookedTimes;
  },

  async getBusinessHours(): Promise<BusinessHoursInfo> {
    const response = await apiClient.get('/appointments/business_hours/');
    return response.data as BusinessHoursInfo;
  },

  async validateDate(date: string): Promise<DateValidation> {
    const response = await apiClient.get(`/appointments/validate_date/?date=${date}`);
    return response.data as DateValidation;
  },

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}/`, data);
    return response.data as Appointment;
  },

  async deleteAppointment(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}/`);
  },

  async confirmAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/`, { status: 'confirmed' });
    return response.data as Appointment;
  },

  async cancelAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/`, { status: 'cancelled' });
    return response.data as Appointment;
  }
};
