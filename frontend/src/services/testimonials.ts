import api from './api';

export interface Testimonial {
  id: number;
  bride_name: string;
  testimonial: string;
  image: string;
  wedding_date: string;
  created_at: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await api.get<Testimonial[]>('testimonials/');
  return response.data;
}
