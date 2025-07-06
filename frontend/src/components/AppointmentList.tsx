import React, { useEffect, useState } from 'react';
import { getAppointments } from '../services/appointments';
import type { Appointment } from '../services/appointments';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAppointments()
      .then(data => setAppointments(data))
      .catch(() => setError('Error al cargar las citas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h2>Listado de Citas</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            {app.name} - {app.date} {app.time} - Estado: {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
