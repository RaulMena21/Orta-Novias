import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "./ui/navigation-menu";
import { MobileMenu } from "./MobileMenu";


const Navbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className={`w-full bg-gradient-to-br from-[#FAF6EE] via-[#F8F2E6] to-[#F5EDE0] border-b-2 border-[#D4B483] shadow-soft px-6 py-1 flex flex-col items-center fixed top-0 left-0 z-50 font-sans gap-4 transition-transform duration-300 ease-in-out overflow-hidden`} 
         style={{ 
           boxShadow: '0 4px 15px -1px rgba(212, 180, 131, 0.2), 0 8px 25px -5px rgba(138, 46, 59, 0.1)',
           backgroundImage: `
             radial-gradient(circle at 20% 50%, rgba(212, 180, 131, 0.08) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(138, 46, 59, 0.05) 0%, transparent 50%),
             radial-gradient(circle at 40% 80%, rgba(212, 180, 131, 0.06) 0%, transparent 50%)
           `
         }}>
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-10 w-2 h-2 bg-[#D4B483] rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-20 w-1 h-1 bg-[#8A2E3B] rounded-full animate-ping"></div>
        <div className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-[#D4B483] rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-3 right-1/4 w-1 h-1 bg-[#8A2E3B] rounded-full animate-ping delay-1000"></div>
      </div>
      
      {/* Subtle floating pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lace-pattern" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="20" r="2" fill="#8A2E3B" opacity="0.3">
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="45" cy="20" r="1.5" fill="#D4B483" opacity="0.4">
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite"/>
              </circle>
              <path d="M10,15 Q20,10 30,15 Q40,20 50,15" stroke="#8A2E3B" strokeWidth="0.5" fill="none" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lace-pattern)"/>
        </svg>
      </div>
      {/* Logo and Contact info */}
      <div className="w-full flex justify-between items-center">
        {/* Desktop contact info */}
        <div className="hidden md:flex flex-row items-center text-xs text-[#8A2E3B] gap-3 w-48">
          <a href="mailto:info@ortanovias.com" className="group hover:text-[#D4B483] whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-1 hover:scale-105 relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 group-hover:animate-bounce">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span className="relative">
              info@ortanovias.com
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D4B483] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
          <a href="https://wa.me/34612345678?text=Hola%20Orta%20Novias,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n." className="group hover:text-[#D4B483] whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-1 hover:scale-105 relative" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 group-hover:animate-pulse">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            <span className="relative">
              612 345 678
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D4B483] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
          <a href="tel:+34912345678" className="group hover:text-[#D4B483] whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-1 hover:scale-105 relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 group-hover:animate-spin">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span className="relative">
              912 345 678
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D4B483] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden w-12 flex justify-start">
          <MobileMenu />
        </div>
        
        {/* Logo - centered */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="group flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 relative">
            <img 
              src="/logo.svg" 
              alt="Orta Novias" 
              className="h-16 relative z-10 transition-all duration-300 ease-in-out group-hover:drop-shadow-md" 
            />
          </Link>
        </div>
        
        {/* Mobile contact buttons */}
        <div className="md:hidden w-12 flex justify-end">
          <div className="flex gap-2">
            <a href="tel:+34912345678" className="bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white p-2 rounded-full hover:from-[#A13347] hover:to-[#B8425A] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>
            <a href="https://wa.me/34612345678?text=Hola%20Orta%20Novias,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n." className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-2 rounded-full hover:from-[#128C7E] hover:to-[#0D7762] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Desktop spacer */}
        <div className="hidden md:block w-48"></div>
      </div>
      {/* Desktop menu */}
      <div className="hidden md:flex flex-row gap-12 items-center flex-grow">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                to="/"
                className={`group relative px-8 py-2 mx-2 text-lg rounded-lg font-medium transition-all duration-300 ease-in-out hover:shadow-md ${
                  location.pathname === "/" 
                    ? "bg-gradient-to-r from-[#D4B483]/30 to-[#8A2E3B]/20 text-[#8A2E3B] font-bold shadow-md" 
                    : "hover:bg-gradient-to-r hover:from-[#f5e9d7] hover:to-[#f0e2d0] text-[#8A2E3B] hover:text-[#6B1F29]"
                }`}
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4B483]/0 to-[#8A2E3B]/0 group-hover:from-[#D4B483]/5 group-hover:to-[#8A2E3B]/5 rounded-lg transition-all duration-300"></div>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/dresses"
                className={`group relative px-8 py-2 mx-2 text-lg rounded-lg font-medium transition-all duration-300 ease-in-out hover:shadow-md ${
                  location.pathname === "/dresses" 
                    ? "bg-gradient-to-r from-[#D4B483]/30 to-[#8A2E3B]/20 text-[#8A2E3B] font-bold shadow-md" 
                    : "hover:bg-gradient-to-r hover:from-[#f5e9d7] hover:to-[#f0e2d0] text-[#8A2E3B] hover:text-[#6B1F29]"
                }`}
              >
                <span className="relative z-10">Catálogo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4B483]/0 to-[#8A2E3B]/0 group-hover:from-[#D4B483]/5 group-hover:to-[#8A2E3B]/5 rounded-lg transition-all duration-300"></div>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/appointments"
                className={`group relative px-8 py-2 mx-2 text-lg rounded-lg font-medium transition-all duration-300 ease-in-out hover:shadow-md ${
                  location.pathname === "/appointments" 
                    ? "bg-gradient-to-r from-[#D4B483]/30 to-[#8A2E3B]/20 text-[#8A2E3B] font-bold shadow-md" 
                    : "hover:bg-gradient-to-r hover:from-[#f5e9d7] hover:to-[#f0e2d0] text-[#8A2E3B] hover:text-[#6B1F29]"
                }`}
              >
                <span className="relative z-10">Reserva tu cita</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4B483]/0 to-[#8A2E3B]/0 group-hover:from-[#D4B483]/5 group-hover:to-[#8A2E3B]/5 rounded-lg transition-all duration-300"></div>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/testimonials"
                className={`group relative px-8 py-2 mx-2 text-lg rounded-lg font-medium transition-all duration-300 ease-in-out hover:shadow-md ${
                  location.pathname === "/testimonials" 
                    ? "bg-gradient-to-r from-[#D4B483]/30 to-[#8A2E3B]/20 text-[#8A2E3B] font-bold shadow-md" 
                    : "hover:bg-gradient-to-r hover:from-[#f5e9d7] hover:to-[#f0e2d0] text-[#8A2E3B] hover:text-[#6B1F29]"
                }`}
              >
                <span className="relative z-10">Testimonios</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4B483]/0 to-[#8A2E3B]/0 group-hover:from-[#D4B483]/5 group-hover:to-[#8A2E3B]/5 rounded-lg transition-all duration-300"></div>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
