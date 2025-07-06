import React, { useEffect, useState } from 'react';
import { getDresses } from '../services/dresses';
import type { Dress } from '../services/dresses';

const DressList: React.FC = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDresses()
      .then(data => setDresses(data))
      .catch((err) => {
        if (err instanceof Error && err.message) {
          setError(`Error al cargar los vestidos: ${err.message}`);
        } else {
          setError('Error al cargar los vestidos');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando vestidos...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h2>Vestidos Disponibles</h2>
      {dresses.length === 0 ? (
        <p>No hay vestidos en estos momentos</p>
      ) : (
        <ul>
          {dresses.map(dress => (
            <li key={dress.id} style={{marginBottom: '1.5em'}}>
              <strong>{dress.name}</strong> ({dress.style})<br />
              <img src={dress.image} alt={dress.name} style={{maxWidth: 200, display: 'block', margin: '0.5em 0'}} />
              <span>{dress.description}</span>
              <div>Disponible: {dress.available ? 'Sí' : 'No'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DressList;
