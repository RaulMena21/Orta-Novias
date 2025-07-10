// Interfaces que coinciden con los modelos del backend

export interface DressImage {
  id: number;
  image: string;
  order: number;
}

export interface Dress {
  id: number;
  name: string;
  description: string;
  image: string;
  additional_images: DressImage[];
  style: string;
  available: boolean;
  created_at: string;
}

export interface TestimonialImage {
  id: number;
  image: string;
  order: number;
}

export interface BrideTestimonial {
  id: number;
  bride_name: string;
  testimonial: string;
  image: string;
  additional_images: TestimonialImage[];
  wedding_date: string;
  created_at: string;
}

export interface Appointment {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  confirmation_method: 'whatsapp' | 'email';
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  comment?: string;
  auto_confirmed: boolean;
  created_at: string;
}

// Interfaces extendidas para el frontend (solo si es necesario)
export interface DressUI extends Dress {
  images?: string[];
}
