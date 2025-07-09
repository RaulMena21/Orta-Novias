import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { MobileMenu } from "./MobileMenu";


const Navbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className={`w-full bg-[#FAF6EE] border-b-2 border-[#D4B483] shadow-soft px-6 py-1 flex flex-col items-center fixed top-0 left-0 z-50 font-sans gap-4 transition-transform duration-300 ease-in-out`} style={{ boxShadow: '0 4px 6px -1px rgba(212, 180, 131, 0.1), 0 2px 4px -1px rgba(212, 180, 131, 0.06)' }}>
      {/* Logo and Contact info */}
      <div className="w-full flex justify-between items-center">
        <div className="hidden md:flex flex-row items-center text-xs text-[#8A2E3B] gap-3 w-48">
          <a href="mailto:info@ortanovias.com" className="hover:text-[#D4B483] whitespace-nowrap transition-colors duration-300 ease-in-out flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            info@ortanovias.com
          </a>
          <a href="https://wa.me/34612345678?text=Hola%20Orta%20Novias,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n." className="hover:text-[#D4B483] whitespace-nowrap transition-colors duration-300 ease-in-out flex items-center gap-1" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            612 345 678
          </a>
          <a href="tel:+34912345678" className="hover:text-[#D4B483] whitespace-nowrap transition-colors duration-300 ease-in-out flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            912 345 678
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-md">
            <img src="/logo.svg" alt="Orta Novias" className="h-16 transition-all duration-300 ease-in-out" />
          </Link>
        </div>
        <div className="hidden md:block w-48"></div> {/* Spacer para equilibrar */}
      </div>
      {/* Desktop menu */}
      <div className="hidden md:flex flex-row gap-12 items-center flex-grow">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                to="/"
                className={`px-8 py-1 mx-2 text-lg rounded hover:bg-[#f5e9d7] transition-all duration-300 ease-in-out hover:shadow-sm ${location.pathname === "/" ? "bg-[#f5e9d7] font-bold" : ""}`}
              >
                Inicio
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/dresses"
                className={`px-8 py-1 mx-2 text-lg rounded hover:bg-[#f5e9d7] transition-all duration-300 ease-in-out hover:shadow-sm ${location.pathname === "/dresses" ? "bg-[#f5e9d7] font-bold" : ""}`}
              >
                Catalogo
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/appointments"
                className={`px-8 py-1 mx-2 text-lg rounded hover:bg-[#f5e9d7] transition-all duration-300 ease-in-out hover:shadow-sm ${location.pathname === "/appointments" ? "bg-[#f5e9d7] font-bold" : ""}`}
              >
                Reserva tu cita
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/testimonials"
                className={`px-8 py-1 mx-2 text-lg rounded hover:bg-[#f5e9d7] transition-all duration-300 ease-in-out hover:shadow-sm ${location.pathname === "/testimonials" ? "bg-[#f5e9d7] font-bold" : ""}`}
              >
                Testimonios
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Mobile menu */}
      <div className="flex md:hidden flex-1 justify-between items-center w-full">
        <MobileMenu />
        <div className="flex gap-2">
          <a href="tel:+34912345678" className="bg-[#8A2E3B] text-white p-2 rounded-full hover:bg-[#A13347] transition-colors duration-300 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </a>
          <a href="https://wa.me/34612345678?text=Hola%20Orta%20Novias,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n." className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition-colors duration-300 flex items-center justify-center" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
