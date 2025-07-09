import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Users, Quote, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

// Datos de testimonios de ejemplo
const testimonialsData = [
  {
    id: 1,
    name: "Ana Martínez",
    location: "Sevilla",
    date: "2024",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "Una experiencia mágica desde el primer momento.",
    fullText: "Desde el momento en que entré a Orta Novias, me sentí como una princesa. La atención fue increíble, me ayudaron a encontrar el vestido perfecto para mi figura y estilo. El equipo es profesional, cariñoso y realmente se preocupan por hacer tu sueño realidad. ¡Recomiendo 100%!",
    dressStyle: "Sirena",
    featured: true
  },
  {
    id: 2,
    name: "Carmen López",
    location: "Cádiz",
    date: "2024",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "El mejor día de mi vida empezó aquí.",
    fullText: "Orta Novias hizo que encontrar mi vestido fuera una experiencia inolvidable. Su paciencia, conocimiento y dedicación son extraordinarios. Me sentí especial desde el primer día hasta que me llevé mi vestido. Gracias por hacer realidad mis sueños.",
    dressStyle: "Princesa",
    featured: true
  },
  {
    id: 3,
    name: "Isabel García",
    location: "Madrid",
    date: "2023",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "Profesionalidad y cariño en cada detalle.",
    fullText: "El trato personalizado que recibí en Orta Novias no tiene precio. Me asesoraron perfectamente, se adaptaron a mi presupuesto y el resultado fue perfecto. Mi vestido era exactamente lo que había soñado. Gracias por vuestra paciencia y dedicación.",
    dressStyle: "Boho",
    featured: false
  },
  {
    id: 4,
    name: "María José Ruiz",
    location: "Málaga",
    date: "2023",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "Superaron todas mis expectativas.",
    fullText: "Llegué muy nerviosa sin saber qué tipo de vestido me quedaría bien. El equipo de Orta Novias me tranquilizó desde el primer momento y me ayudó a descubrir mi estilo. El proceso de ajustes fue perfecto y el día de mi boda me sentí absolutamente radiante.",
    dressStyle: "Vintage",
    featured: false
  },
  {
    id: 5,
    name: "Laura Fernández",
    location: "Granada",
    date: "2023",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "Una experiencia VIP increíble.",
    fullText: "La experiencia VIP en Orta Novias fue espectacular. El champagne, la atención exclusiva, el ambiente... todo perfecto. Pero lo mejor fue encontrar el vestido de mis sueños. El equipo tiene un ojo excelente para saber qué le queda bien a cada novia.",
    dressStyle: "Recto",
    featured: true
  },
  {
    id: 6,
    name: "Rocío Moreno",
    location: "Córdoba",
    date: "2022",
    rating: 5,
    image: "/api/placeholder/400/400",
    shortText: "25 años de experiencia se notan.",
    fullText: "Elegí Orta Novias porque mi madre se casó aquí hace 20 años. La tradición familiar continuó y no pude estar más feliz. Su experiencia de 25 años se nota en cada detalle. Son auténticos profesionales que conocen perfectamente su trabajo.",
    dressStyle: "Clásico",
    featured: false
  }
];

const TestimonialsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Filtrar testimonios
  const filteredTestimonials = testimonialsData.filter(testimonial => {
    return (
      (selectedYear === 'all' || testimonial.date === selectedYear) &&
      (selectedStyle === 'all' || testimonial.dressStyle.toLowerCase() === selectedStyle)
    );
  });

  // Testimonios destacados para el slider
  const featuredTestimonials = testimonialsData.filter(t => t.featured);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  const years = ['all', '2024', '2023', '2022'];
  const styles = ['all', 'sirena', 'princesa', 'boho', 'vintage', 'recto', 'clásico'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] mt-4 bg-gradient-to-br from-[#FAF7F4] via-[#F5F0E8] to-[#F8F5F2] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#8A2E3B]/5"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#8A2E3B] mb-6 tracking-tight">
            Testimonios de Novias
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 leading-relaxed">
            Historias reales, momentos inolvidables
          </p>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre cómo nuestras novias vivieron su experiencia Orta Novias. 
            Cada testimonio es una historia de amor, confianza y sueños hechos realidad.
          </p>
        </div>
      </section>

      {/* Slider de Testimonios Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A2E3B]">
            Más Destacados
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Las experiencias más especiales de nuestras novias
            </p>
          </div>

          <div className="relative bg-[#F8F5F2] rounded-2xl shadow-xl overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{transform: `translateX(-${currentTestimonial * 100}%)`}}>
              {featuredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-64 md:h-72 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-3 left-3 bg-[#D4B483] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {testimonial.dressStyle}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Quote className="w-10 h-10 text-[#D4B483]" />
                      
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-[#D4B483] fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed">
                        "{testimonial.fullText}"
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#8A2E3B] rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-[#8A2E3B]">{testimonial.name}</h4>
                          <p className="text-gray-600 text-sm">{testimonial.location} • Novia {testimonial.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Controles del slider */}
            <button
              onClick={prevTestimonial}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#8A2E3B]" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#8A2E3B]" />
            </button>
            
            {/* Indicadores */}
            <div className="flex justify-center space-x-2 pb-4">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-[#8A2E3B]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#8A2E3B]" />
                <span className="font-semibold text-[#8A2E3B]">Filtrar testimonios:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
                  >
                    <option value="all">Todos los años</option>
                    {years.slice(1).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estilo</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
                  >
                    <option value="all">Todos los estilos</option>
                    {styles.slice(1).map(style => (
                      <option key={style} value={style} className="capitalize">{style}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Todos los Testimonios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#D4B483] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {testimonial.dressStyle}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#D4B483] fill-current" />
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#8A2E3B] mb-2">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{testimonial.location} • Novia {testimonial.date}</p>
                  
                  <p className="text-gray-700 italic mb-4 leading-relaxed">
                    "{testimonial.shortText}"
                  </p>
                  
                  <button className="text-[#8A2E3B] hover:text-[#A13347] font-medium text-sm">
                    Leer testimonio completo →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No se encontraron testimonios con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedStyle('all');
                }}
                className="mt-4 px-6 py-3 bg-[#8A2E3B] text-white rounded-lg hover:bg-[#A13347] transition-colors"
              >
                Ver todos los testimonios
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Estadísticas de satisfacción */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A2E3B]">
              Por qué nuestras novias nos recomiendan
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-[#F8F5F2] p-6 rounded-lg">
              <div className="text-4xl font-bold text-[#D4B483] mb-2">100%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
            <div className="bg-[#F8F5F2] p-6 rounded-lg">
              <div className="text-4xl font-bold text-[#D4B483] mb-2">2000+</div>
              <div className="text-sm text-gray-600">Novias Felices</div>
            </div>
            <div className="bg-[#F8F5F2] p-6 rounded-lg">
              <div className="text-4xl font-bold text-[#D4B483] mb-2">25+</div>
              <div className="text-sm text-gray-600">Años de Experiencia</div>
            </div>
            <div className="bg-[#F8F5F2] p-6 rounded-lg">
              <div className="text-4xl font-bold text-[#D4B483] mb-2">5⭐</div>
              <div className="text-sm text-gray-600">Valoración Media</div>
            </div>
          </div>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="py-20 bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            ¿Quieres ser una novia Orta?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Únete a las más de 2000 novias que han confiado en nosotras para el día más especial de sus vidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/appointments"
              className="px-8 py-4 bg-white text-[#8A2E3B] text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Reserva tu Cita
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-lg italic opacity-90">
              "Gracias por confiar en Orta Novias para un día tan especial"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
