import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Grid, List, Search, X, Calendar, Tag, CheckCircle } from 'lucide-react';
import type { Dress } from '../types';
import { getDresses } from '../services/dresses';

const DressesPage: React.FC = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 6;

  // Cargar vestidos del backend
  useEffect(() => {
    const fetchDresses = async () => {
      try {
        setLoading(true);
        const data = await getDresses();
        setDresses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dresses:', err);
        setError('Error al cargar los vestidos. Mostrando datos de ejemplo.');
        // Fallback a datos de ejemplo si falla la API
      
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []);

  // Filtrar vestidos
  const filteredDresses = dresses.filter(dress => {
    return (
      (selectedStyle === '' || dress.style === selectedStyle) &&
      (searchTerm === '' || dress.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredDresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDresses = filteredDresses.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSelectedStyle('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const openModal = (dress: Dress) => {
    setSelectedDress(dress);
    setCurrentImageIndex(0);  // Resetear al índice 0
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDress(null);
    setCurrentImageIndex(0);
    setShowModal(false);
  };

  // Función para obtener todas las imágenes del vestido
  const getAllImages = (dress: Dress) => {
    const images = [dress.image];
    if (dress.additional_images && dress.additional_images.length > 0) {
      images.push(...dress.additional_images.map(img => img.image));
    }
    return images;
  };

  const nextImage = () => {
    if (selectedDress) {
      const allImages = getAllImages(selectedDress);
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedDress) {
      const allImages = getAllImages(selectedDress);
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  // Obtener estilos únicos de los vestidos
  const styles = Array.from(new Set(dresses.map(dress => dress.style))).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A2E3B] mx-auto mb-4"></div>
          <p className="text-[#8A2E3B] text-lg">Cargando vestidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-4 mt-4">
          <div className="flex">
            <div className="text-yellow-600 text-sm">
              ⚠️ {error}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-[#FAF7F4] via-[#F5F0E8] to-[#F8F5F2] flex items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A2E3B]/5 via-transparent to-[#D4B483]/5"></div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#D4B483]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#8A2E3B]/15 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 text-center px-4 py-8 md:py-15 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#D4B483]"></div>
              <span className="text-sm font-semibold text-[#D4B483] uppercase tracking-wider">Colección Exclusiva</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#D4B483]"></div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-[#8A2E3B] mb-6 tracking-tight leading-none">
              Catálogo de Ensueño
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 leading-relaxed font-light max-w-4xl mx-auto">
              Descubre nuestra colección curada de vestidos excepcionales, donde cada pieza 
              es una obra maestra diseñada para hacer de tu día especial un momento eterno.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-[#D4B483] text-[#8A2E3B] rounded-lg hover:bg-[#D4B483]/10 transition-colors duration-300"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar vestidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-[#8A2E3B] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-300`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-[#8A2E3B] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-300`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#8A2E3B]">Filtros</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-[#8A2E3B] transition-colors duration-300"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estilo</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent outline-none transition-all duration-300"
                >
                  <option value="">Todos los estilos</option>
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-gray-600 mb-6">
          Mostrando {Math.min(startIndex + 1, filteredDresses.length)}-{Math.min(startIndex + itemsPerPage, filteredDresses.length)} de {filteredDresses.length} vestidos
        </p>

        {/* Dress Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentDresses.map((dress) => (
              <div key={dress.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="relative overflow-hidden">
                  <img
                    src={dress.image}
                    alt={dress.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4B483] to-[#8A2E3B] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {dress.style}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8A2E3B] mb-3 group-hover:text-[#D4B483] transition-colors duration-300">
                    {dress.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {dress.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dress.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {dress.available ? 'Disponible' : 'No disponible'}
                    </span>
                    <button 
                      onClick={() => openModal(dress)}
                      className="bg-gradient-to-r from-[#8A2E3B] to-[#D4B483] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {currentDresses.map((dress) => (
              <div key={dress.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={dress.image}
                      alt={dress.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#8A2E3B] mb-2">
                          {dress.name}
                        </h3>
                        <span className="inline-block bg-gradient-to-r from-[#D4B483] to-[#8A2E3B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {dress.style}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {dress.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        dress.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {dress.available ? 'Disponible' : 'No disponible'}
                      </span>
                      <button 
                        onClick={() => openModal(dress)}
                        className="bg-gradient-to-r from-[#8A2E3B] to-[#D4B483] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Ver detalles
                      </button>
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
            ¿Encontraste el vestido de tus sueños?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Agenda una cita personalizada y déjanos ayudarte a encontrar el vestido perfecto para tu día especial.
          </p>
          <Link 
            to="/appointments"
            className="inline-block bg-white text-[#8A2E3B] px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Agendar Cita
          </Link>
        </div>
      </section>

      {/* Modal de detalles del vestido */}
      {showModal && selectedDress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-[#8A2E3B]">
                {selectedDress.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Carrusel de Imágenes */}
                <div className="space-y-4">
                  {(() => {
                    const allImages = getAllImages(selectedDress);
                    return (
                      <div className="relative">
                        <img
                          src={allImages[currentImageIndex]}
                          alt={`${selectedDress.name} - ${currentImageIndex + 1}`}
                          className="w-full h-96 md:h-[500px] object-cover rounded-xl"
                        />
                        
                        {/* Navegación del carrusel si hay múltiples imágenes */}
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                            
                            {/* Indicadores */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                              {allImages.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentImageIndex 
                                      ? 'bg-white' 
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                  
                  {/* Miniaturas */}
                  {(() => {
                    const allImages = getAllImages(selectedDress);
                    return allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex 
                                ? 'border-[#8A2E3B]' 
                                : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${selectedDress.name} miniatura ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Información */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#D4B483]" />
                      Detalles del Vestido
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Estilo:</span>
                        <span className="px-3 py-1 bg-[#D4B483]/20 text-[#8A2E3B] rounded-full text-sm font-medium">
                          {selectedDress.style}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Disponibilidad:</span>
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          selectedDress.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                          {selectedDress.available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Fecha de creación:</span>
                        <span className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedDress.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Descripción
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {selectedDress.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      ¿Te interesa este vestido?
                    </h3>
                    <div className="space-y-3">
                      <Link 
                        to="/appointments"
                        className="block w-full bg-gradient-to-r from-[#8A2E3B] to-[#D4B483] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
                      >
                        Agendar Cita para Probármelo
                      </Link>
                      <button 
                        onClick={closeModal}
                        className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        Seguir Explorando
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DressesPage;