import React from 'react';
import AppointmentList from '../components/AppointmentList';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <AppointmentList />
    </div>
  );
};

export default Dashboard;
