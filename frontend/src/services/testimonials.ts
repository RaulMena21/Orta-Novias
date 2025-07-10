import api from './api';
import type { BrideTestimonial } from '../types';

export async function getTestimonials(): Promise<BrideTestimonial[]> {
  const response = await api.get<BrideTestimonial[]>('testimonials/');
  return response.data;
}

export async function getTestimonial(id: number): Promise<BrideTestimonial> {
  const response = await api.get<BrideTestimonial>(`testimonials/${id}/`);
  return response.data;
}
