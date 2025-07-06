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
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h2>Testimonios de Novias</h2>
      {testimonials.length === 0 ? (
        <p>No hay testimonios en estos momentos</p>
      ) : (
        <ul>
          {testimonials.map(t => (
            <li key={t.id} style={{marginBottom: '1.5em'}}>
              <strong>{t.bride_name}</strong> ({t.wedding_date})<br />
              <img src={t.image} alt={t.bride_name} style={{maxWidth: 200, display: 'block', margin: '0.5em 0'}} />
              <span>{t.testimonial}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestimonialList;
