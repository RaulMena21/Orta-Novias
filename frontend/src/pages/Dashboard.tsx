import React from 'react';






const Dashboard: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-[#FAF6EE]">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#8A2E3B] font-serif tracking-tight text-center drop-shadow-sm italic">
        Bienvenida a tu Panel de Control
      </h1>
      <p className="text-lg md:text-xl text-[#A13347] text-center max-w-xl mb-2 italic">
        Aquí puedes gestionar tus citas, vestidos y testimonios.
      </p>
    </div>
  );
};

export default Dashboard;
