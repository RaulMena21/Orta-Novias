import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BrideTestimonial } from '../types';
import { getTestimonials } from '../services/testimonials';
import SEO from '../components/SEO';
import { useAnalyticsContext } from '../components/AnalyticsProvider';
import { useConversionTracking } from '../hooks/useAnalytics';

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<BrideTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 6;

  // Analytics hooks
  const { trackEvent } = useAnalyticsContext();
  const { trackTestimonialEngagement, trackAppointmentIntent } = useConversionTracking();

  // Track page entry
  useEffect(() => {
    trackEvent('testimonials_page_view', {
      category: 'page_views',
      page_type: 'testimonials'
    });
  }, [trackEvent]);

  // Cargar testimonios del backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Cargando testimonios del backend...');
        
        const data = await getTestimonials();
        console.log('Testimonios recibidos:', data);
        
        setTestimonials(data);
        
      } catch (err) {
        console.error('Error al cargar testimonios:', err);
        setError('Error al conectar con el servidor. Por favor, verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Paginación con analytics
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const currentTestimonials = testimonials.slice(startIndex, startIndex + testimonialsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    trackEvent('testimonials_pagination', {
      category: 'user_interaction',
      page_number: newPage,
      total_pages: totalPages
    });
  };

  const handleAppointmentClick = (source: string) => {
    trackAppointmentIntent(source);
    trackEvent('appointment_cta_click', {
      category: 'conversions',
      source: source,
      page: 'testimonials'
    });
  };

  const handleTestimonialView = (testimonial: BrideTestimonial) => {
    trackTestimonialEngagement(testimonial.id.toString(), 'view');
    trackEvent('testimonial_viewed', {
      category: 'content_engagement',
      testimonial_id: testimonial.id,
      bride_name: testimonial.bride_name
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A2E3B] mx-auto mb-4"></div>
          <p className="text-[#8A2E3B] text-lg">Cargando testimonios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* SEO Component */}
      <SEO
        title="Testimonios de Novias | Orta Novias"
        description="Descubre las experiencias reales de las novias que confiaron en Orta Novias. Lee sus testimonios y vive la elegancia y confianza que ofrecemos."
        image="/path-to-your-default-image.jpg"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mt-4">
          <div className="flex">
            <div className="text-red-600 text-sm">
              ❌ {error}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-[#FAF7F4] via-[#F5F0E8] to-[#F8F5F2] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A2E3B]/5 via-transparent to-[#D4B483]/5"></div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#D4B483]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#8A2E3B]/15 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 text-center px-4 py-8 md:py-15 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#D4B483]"></div>
              <span className="text-sm font-semibold text-[#D4B483] uppercase tracking-wider">Experiencias Reales</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#D4B483]"></div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-[#8A2E3B] mb-6 tracking-tight leading-none">
              Testimonios de Nuestras Novias
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 leading-relaxed font-light max-w-4xl mx-auto">
              Cada testimonio cuenta una historia única de elegancia, confianza y momentos inolvidables. 
              Descubre las experiencias reales de las novias que confiaron en nosotros para su día más especial.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="container mx-auto px-4 py-8">
        {/* Results count */}
        <p className="text-gray-600 mb-6">
          Mostrando {Math.min(startIndex + 1, testimonials.length)}-{Math.min(startIndex + testimonialsPerPage, testimonials.length)} de {testimonials.length} testimonios
        </p>

        {/* Empty State */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💍</div>
            <h3 className="text-2xl font-bold text-[#8A2E3B] mb-2">No hay testimonios disponibles</h3>
            <p className="text-gray-600 mb-6">Aún no tenemos testimonios que mostrar, pero pronto tendremos experiencias increíbles que compartir.</p>
            <Link 
              to="/appointments"
              onClick={() => handleAppointmentClick('empty_state')}
              className="inline-block bg-[#8A2E3B] text-white px-6 py-3 rounded-lg hover:bg-[#7A2635] transition-colors duration-300"
            >
              Sé la primera en compartir tu experiencia
            </Link>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100"
                onClick={() => handleTestimonialView(testimonial)}
              >
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.bride_name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('Error cargando imagen:', testimonial.image);
                      // Fallback a una imagen local o estilo por defecto
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent && !parent.querySelector('.placeholder-div')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder-div w-full h-64 bg-gradient-to-br from-[#8A2E3B] to-[#D4B483] flex items-center justify-center text-white text-xl font-semibold';
                        placeholder.textContent = 'Orta Novias';
                        parent.appendChild(placeholder);
                      }
                    }}
                    onLoad={() => {
                      console.log('Imagen cargada correctamente:', testimonial.image);
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Quote className="w-6 h-6 text-[#D4B483]" />
                    <h3 className="text-xl font-bold text-[#8A2E3B]">
                      {testimonial.bride_name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                    {testimonial.testimonial}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(testimonial.wedding_date).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-[#8A2E3B] text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-300"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#8A2E3B] to-[#D4B483] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            ¿Lista para vivir tu propia experiencia?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Únete a las novias que han confiado en nosotros. Agenda tu cita y descubre por qué somos la elección preferida.
          </p>
          <Link 
            to="/appointments"
            onClick={() => handleAppointmentClick('cta_section')}
            className="inline-block bg-white text-[#8A2E3B] px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Agendar Mi Cita
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
