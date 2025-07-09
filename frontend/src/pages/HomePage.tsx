import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Clock, Phone, Mail, MapPin, Award, Instagram, Facebook, Users, Gift, Camera } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[73vh] flex items-start justify-center bg-gradient-to-r from-[#F8F5F2] via-[#FAF7F4] to-[#F8F5F2] pt-24">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto flex flex-col space-y-12 mt-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-[#D4B483] tracking-tight drop-shadow-lg leading-none">
            Orta Novias
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#8A2E3B] max-w-4xl mx-auto leading-relaxed">
            Donde los sueños se visten de elegancia
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Más de 25 años creando momentos únicos. Tu vestido perfecto te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link 
              to="/appointments" 
              className="px-10 py-5 bg-[#8A2E3B] text-white text-xl font-semibold rounded-lg shadow-xl hover:bg-[#A13347] transform hover:scale-105 transition-all duration-300"
            >
              Reserva tu Cita
            </Link>
            <Link 
              to="/dresses" 
              className="px-10 py-5 border-2 border-[#D4B483] text-[#8A2E3B] text-xl font-semibold rounded-lg hover:bg-[#D4B483] hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              Ver Catálogo
            </Link>
            <Link 
              to="/testimonials" 
              className="md:hidden px-10 py-5 border-2 border-[#8A2E3B] text-[#8A2E3B] text-xl font-semibold rounded-lg hover:bg-[#8A2E3B] hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              Ver Testimonios
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Nuestra Historia
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Desde 1998, Orta Novias ha sido el refugio de elegancia para novias que buscan perfección. 
                Comenzamos como un pequeño atelier familiar y hemos crecido hasta convertirnos en la boutique 
                de confianza para las novias más exigentes.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Cada vestido cuenta una historia, cada novia es única. Nuestro compromiso es hacer realidad 
                tus sueños con la máxima atención al detalle y un servicio personalizado que va más allá de 
                tus expectativas.
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4B483]">25+</div>
                  <div className="text-sm text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4B483]">2000+</div>
                  <div className="text-sm text-gray-600">Novias Felices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4B483]">100%</div>
                  <div className="text-sm text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#F8F5F2] p-8 rounded-lg shadow-lg">
                <div className="h-80 bg-gradient-to-br from-[#D4B483] to-[#C4A373] rounded-lg flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                  <p className="text-white ml-4 font-semibold">Historia Visual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalog */}
      <section className="py-20 bg-[#F8F5F2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Catálogo Destacado
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Descubre nuestra selección exclusiva de vestidos de novia, diseñados para hacer de tu día especial un momento inolvidable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-80 bg-gradient-to-br from-[#D4B483] to-[#C4A373] flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#8A2E3B]">Colección Elegancia</h3>
                  <p className="text-gray-600 mb-4">Vestidos clásicos con toques modernos que realzan tu belleza natural.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D4B483] font-semibold">Desde €800</span>
                    <Link to="/dresses" className="text-[#8A2E3B] hover:text-[#A13347] font-medium">
                      Ver más →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/dresses" 
              className="inline-block px-8 py-4 bg-[#8A2E3B] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#A13347] transform hover:scale-105 transition-all duration-300"
            >
              Ver Todo el Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Lo Que Dicen Nuestras Novias
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Cada testimonio es una historia de amor y confianza que nos motiva a seguir creando momentos mágicos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-[#F8F5F2] p-8 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-[#D4B483] fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "Una experiencia mágica desde el primer momento. El equipo de Orta Novias hizo que encontrar mi vestido perfecto fuera un sueño hecho realidad."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#8A2E3B]">María García</div>
                    <div className="text-sm text-gray-600">Novia 2023</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/testimonials" 
              className="inline-block px-6 py-3 border-2 border-[#D4B483] text-[#8A2E3B] font-semibold rounded-lg hover:bg-[#D4B483] hover:text-white transition-all duration-300"
            >
              Ver Más Testimonios
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#F8F5F2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Servicios Exclusivos
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Más que una boutique, somos tu equipo de confianza para hacer realidad el día de tus sueños.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#8A2E3B]">Asesoría Personalizada</h3>
              <p className="text-gray-600">Consulta uno a uno para encontrar el vestido perfecto para tu estilo y figura.</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#8A2E3B]">Ajustes Profesionales</h3>
              <p className="text-gray-600">Modificaciones expertas para que tu vestido se adapte perfectamente a ti.</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#8A2E3B]">Accesorios Exclusivos</h3>
              <p className="text-gray-600">Complementa tu look con nuestra selección de velos, joyas y zapatos.</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#8A2E3B]">Experiencia VIP</h3>
              <p className="text-gray-600">Atención premium con champagne y ambiente exclusivo para ti y tus acompañantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            ¿Lista para Encontrar tu Vestido Perfecto?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Agenda tu cita personalizada y déjanos ser parte de tu historia de amor. 
            La experiencia Orta Novias te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/appointments" 
              className="px-8 py-4 bg-white text-[#8A2E3B] text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Reservar Cita Ahora
            </Link>
            <a 
              href="tel:+34123456789" 
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-[#8A2E3B] transform hover:scale-105 transition-all duration-300"
            >
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Visítanos
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Estamos ubicados en el corazón de la ciudad, en un espacio diseñado para hacer de tu visita una experiencia única.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-[#F8F5F2] p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-[#8A2E3B]">Información de Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-[#D4B483] mr-4" />
                    <div>
                      <div className="font-semibold text-[#8A2E3B]">Dirección</div>
                      <div className="text-gray-600">Calle Principal 123, Centro Histórico</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-[#D4B483] mr-4" />
                    <div>
                      <div className="font-semibold text-[#8A2E3B]">Teléfono</div>
                      <div className="text-gray-600">+34 123 456 789</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-[#D4B483] mr-4" />
                    <div>
                      <div className="font-semibold text-[#8A2E3B]">Email</div>
                      <div className="text-gray-600">info@ortanovias.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-[#D4B483] mr-4" />
                    <div>
                      <div className="font-semibold text-[#8A2E3B]">Horarios</div>
                      <div className="text-gray-600">Lun-Sáb: 10:00-20:00</div>
                      <div className="text-gray-600">Dom: 11:00-15:00</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <a href="#" className="p-3 bg-[#8A2E3B] text-white rounded-full hover:bg-[#A13347] transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-[#8A2E3B] text-white rounded-full hover:bg-[#A13347] transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-[#F8F5F2] p-8 rounded-lg shadow-lg h-full">
                <h3 className="text-2xl font-semibold mb-6 text-[#8A2E3B]">Mapa de Ubicación</h3>
                <div className="h-80 bg-gradient-to-br from-[#D4B483] to-[#C4A373] rounded-lg flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-white" />
                  <p className="text-white ml-4 font-semibold">Mapa Interactivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Brides Gallery */}
      <section className="py-20 bg-[#F8F5F2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
              Galería de Novias Reales
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Cada novia es única y especial. Descubre cómo nuestros vestidos cobran vida en el día más importante.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-[#D4B483] to-[#C4A373] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="px-6 py-3 border-2 border-[#D4B483] text-[#8A2E3B] font-semibold rounded-lg hover:bg-[#D4B483] hover:text-white transition-all duration-300">
              Ver Más Fotos
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter & Social */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A2E3B]">
            Mantente Conectada
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter para recibir las últimas tendencias, ofertas exclusivas y consejos de estilo.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto mb-8">
            <input 
              type="email" 
              placeholder="Tu email" 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#D4B483]"
            />
            <button className="px-6 py-3 bg-[#8A2E3B] text-white font-semibold rounded-r-lg sm:rounded-l-none rounded-l-lg hover:bg-[#A13347] transition-colors">
              Suscribirse
            </button>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="p-4 bg-[#F8F5F2] rounded-full hover:bg-[#D4B483] group transition-colors">
              <Instagram className="w-6 h-6 text-[#8A2E3B] group-hover:text-white" />
            </a>
            <a href="#" className="p-4 bg-[#F8F5F2] rounded-full hover:bg-[#D4B483] group transition-colors">
              <Facebook className="w-6 h-6 text-[#8A2E3B] group-hover:text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Details */}
      <section className="py-16 bg-[#F8F5F2] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-[#8A2E3B] mb-2">Premio Excelencia</div>
              <div className="text-sm text-gray-600">Mejor Boutique 2023</div>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-[#8A2E3B] mb-2">Familia Local</div>
              <div className="text-sm text-gray-600">25+ Años en la Ciudad</div>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-[#8A2E3B] mb-2">5 Estrellas</div>
              <div className="text-sm text-gray-600">Google & Facebook</div>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-[#8A2E3B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold text-[#8A2E3B] mb-2">Garantía Total</div>
              <div className="text-sm text-gray-600">Satisfacción 100%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8A2E3B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">Orta Novias</h3>
              <p className="text-gray-300 mb-4">
                Tu boutique de confianza para el día más especial de tu vida. 
                Donde los sueños se visten de elegancia.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/dresses" className="hover:text-white transition-colors">Vestidos</Link></li>
                <li><Link to="/appointments" className="hover:text-white transition-colors">Citas</Link></li>
                <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonios</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Asesoría Personalizada</li>
                <li>Ajustes Profesionales</li>
                <li>Accesorios Exclusivos</li>
                <li>Experiencia VIP</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Calle Principal 123</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+34 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>info@ortanovias.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Orta Novias. Todos los derechos reservados. | Diseñado con ❤️ para novias únicas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
