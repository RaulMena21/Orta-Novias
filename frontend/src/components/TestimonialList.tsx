import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/testimonials';
import type { Testimonial } from '../services/testimonials';

const TestimonialList: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTestimonials()
      .then(data => setTestimonials(data))
      .catch((err) => {
        if (err instanceof Error && err.message) {
          setError(`Error al cargar los testimonios: ${err.message}`);
        } else {
          setError('Error al cargar los testimonios');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando testimonios...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2>Testimonios de Novias</h2>
      {testimonials.length === 0 ? (
        <p>No hay testimonios en estos momentos</p>
      ) : (
        <ul>
          {testimonials.map(t => (
            <li key={t.id} className="mb-6">
              <strong>{t.bride_name}</strong> ({t.wedding_date})<br />
              <img src={t.image} alt={t.bride_name} className="max-w-[200px] block my-2" />
              <span>{t.testimonial}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestimonialList;
