
import React from 'react';

import AppointmentList from '../components/AppointmentList';
import TestimonialList from '../components/TestimonialList';
import DressList from '../components/DressList';
import { logout } from '../services/logout';


const Dashboard: React.FC = () => {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bienvenido al Dashboard</h1>
        <button onClick={logout} style={{ padding: '0.5em 1em', cursor: 'pointer' }}>Cerrar sesión</button>
      </header>
      <AppointmentList />
      <hr style={{margin: '2em 0'}} />
      <TestimonialList />
      <hr style={{margin: '2em 0'}} />
      <DressList />
    </div>
  );
};

export default Dashboard;
