import React from 'react';


const HomePage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-[#F8F5F2]">
    <h1 className="text-5xl font-bold mb-6 text-[#D4B483] font-serif tracking-tight text-center drop-shadow-md">
      Bienvenida a Orta Novias
    </h1>
    <p className="text-xl text-[#8A2E3B] text-center max-w-2xl mb-4">
      Tu tienda de trajes de novia y experiencias únicas.
    </p>
    <button className="px-6 py-3 bg-[#8A2E3B] text-white rounded-lg shadow-lg hover:bg-[#A13347] transition">
      Reserva tu cita
    </button>
  </div>
);

export default HomePage;
