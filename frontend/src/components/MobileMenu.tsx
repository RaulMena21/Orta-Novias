import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/dresses', label: 'Catálogo' },
  { to: '/appointments', label: 'Reserva tu cita' },
  { to: '/testimonials', label: 'Testimonios' }
];

export const MobileMenu: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="flex flex-col justify-center items-center focus:outline-none bg-transparent"
        aria-label="Abrir menú"
        onClick={() => setOpen(o => !o)}
        style={{zIndex: 10000}}
      >
        <span className={`block w-6 h-0.5 rounded bg-[#8A2E3B] transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 rounded bg-[#8A2E3B] my-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 rounded bg-[#8A2E3B] transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[9998] backdrop-blur-lg" onClick={() => setOpen(false)} />
          <aside
            className={`fixed top-[72px] left-0 z-[9999] h-auto max-h-[calc(100vh-72px)] w-4/5 max-w-xs backdrop-blur-xl transform transition-transform duration-300 flex flex-col font-sans ${open ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <nav className="flex flex-col gap-4 mt-8 px-6">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`${location.pathname === item.to ? 'bg-[#f5e9d7] font-bold text-[#8A2E3B]' : 'text-[#8A2E3B] hover:bg-[#f5e9d7] transition-all duration-300 ease-in-out hover:shadow-sm'} text-[1.15em] py-[0.5em] px-4 rounded`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
};
