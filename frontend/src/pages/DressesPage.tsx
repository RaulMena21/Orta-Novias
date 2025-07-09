import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Filter, Calendar, Grid, List } from 'lucide-react';

// Datos de ejemplo para los vestidos
const dressesData = [
  {
    id: 1,
    name: "Elegancia Clásica",
    style: "princesa",
    price: "Consultar",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Blanco", "Marfil"],
    featured: true
  },
  {
    id: 2,
    name: "Sirena Moderna",
    style: "sirena",
    price: "Desde €1,200",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["36", "38", "40", "42"],
    colors: ["Blanco", "Marfil", "Champagne"],
    featured: false
  },
  {
    id: 3,
    name: "Boho Romántico",
    style: "boho",
    price: "Consultar",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["36", "38", "40", "42", "44", "46"],
    colors: ["Marfil", "Champagne"],
    featured: true
  },
  {
    id: 4,
    name: "Minimalista Chic",
    style: "recto",
    price: "Desde €800",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Blanco", "Marfil"],
    featured: false
  },
  {
    id: 5,
    name: "Vintage Glamour",
    style: "vintage",
    price: "Consultar",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["38", "40", "42", "44"],
    colors: ["Marfil", "Champagne", "Blush"],
    featured: true
  },
  {
    id: 6,
    name: "Princesa Real",
    style: "princesa",
    price: "Desde €1,500",
    images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
    designer: "Orta Collection",
    sizes: ["36", "38", "40", "42", "44", "46"],
    colors: ["Blanco", "Marfil"],
    featured: false
  }
];

const DressesPage: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtrar vestidos
  const filteredDresses = dressesData.filter(dress => {
    return (
      (selectedStyle === '' || dress.style === selectedStyle) &&
      (selectedSize === '' || dress.sizes.includes(selectedSize)) &&
      (selectedColor === '' || dress.colors.includes(selectedColor)) &&
      (searchTerm === '' || dress.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredDresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDresses = filteredDresses.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSelectedStyle('');
    setSelectedSize('');
    setSelectedColor('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] bg-gradient-to-br from-[#FAF7F4] via-[#F5F0E8] to-[#F8F5F2] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#8A2E3B]/5"></div>
        <div className="relative z-10 text-center px-4 py-8 md:py-15 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-[#8A2E3B] mb-4 md:mb-6 tracking-tight">
            Catálogo de Vestidos
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
            Descubre nuestra colección exclusiva. El vestido de tus sueños te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-8 py-4 border-2 border-[#D4B483] text-[#8A2E3B] text-lg font-semibold rounded-lg hover:bg-[#D4B483] hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              <Filter className="w-8 h-5 inline mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtros y Búsqueda */}
        <div className={`mb-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar vestido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por Estilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estilo</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
              >
                <option value="">Todos los estilos</option>
                <option value="princesa">Princesa</option>
                <option value="sirena">Sirena</option>
                <option value="boho">Boho</option>
                <option value="recto">Recto</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>

            {/* Filtro por Talla */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
              >
                <option value="">Todas las tallas</option>
                <option value="36">36</option>
                <option value="38">38</option>
                <option value="40">40</option>
                <option value="42">42</option>
                <option value="44">44</option>
                <option value="46">46</option>
              </select>
            </div>

            {/* Filtro por Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B483] focus:border-transparent"
              >
                <option value="">Todos los colores</option>
                <option value="Blanco">Blanco</option>
                <option value="Marfil">Marfil</option>
                <option value="Champagne">Champagne</option>
                <option value="Blush">Blush</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-[#8A2E3B] hover:text-[#A13347] font-medium"
            >
              Limpiar filtros
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Vista:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#8A2E3B] text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#8A2E3B] text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDresses.length)} de {filteredDresses.length} vestidos
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-2 bg-[#8A2E3B] text-white rounded-lg"
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Filtros
          </button>
        </div>

        {/* Grid/Lista de Vestidos */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {currentDresses.map((dress) => (
              <div key={dress.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={dress.images[0]}
                    alt={dress.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {dress.featured && (
                    <div className="absolute top-4 left-4 bg-[#D4B483] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destacado
                    </div>
                  )}
                  <div className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors cursor-pointer">
                    <Heart className="w-5 h-5 text-[#8A2E3B]" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      to={`/dresses/${dress.id}`}
                      className="px-6 py-3 bg-white text-[#8A2E3B] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#8A2E3B]">{dress.name}</h3>
                  <p className="text-gray-600 mb-2 capitalize">{dress.style}</p>
                  <p className="text-gray-500 text-sm mb-4">{dress.designer}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D4B483] font-semibold text-lg">{dress.price}</span>
                    <Link
                      to="/appointments"
                      className="px-4 py-2 bg-[#8A2E3B] text-white rounded-lg text-sm hover:bg-[#A13347] transition-colors"
                    >
                      Agendar Cita
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 mb-12">
            {currentDresses.map((dress) => (
              <div key={dress.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex">
                <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={dress.images[0]}
                    alt={dress.name}
                    className="w-full h-full object-cover"
                  />
                  {dress.featured && (
                    <div className="absolute top-2 left-2 bg-[#D4B483] text-white px-2 py-1 rounded text-xs font-semibold">
                      Destacado
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#8A2E3B]">{dress.name}</h3>
                    <p className="text-gray-600 mb-2 capitalize">{dress.style}</p>
                    <p className="text-gray-500 text-sm mb-2">{dress.designer}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>Tallas: {dress.sizes.join(', ')}</span>
                      <span>Colores: {dress.colors.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D4B483] font-semibold text-lg">{dress.price}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/dresses/${dress.id}`}
                        className="px-4 py-2 border border-[#D4B483] text-[#8A2E3B] rounded-lg text-sm hover:bg-[#D4B483] hover:text-white transition-colors"
                      >
                        Ver Detalles
                      </Link>
                      <Link
                        to="/appointments"
                        className="px-4 py-2 bg-[#8A2E3B] text-white rounded-lg text-sm hover:bg-[#A13347] transition-colors"
                      >
                        Agendar Cita
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-[#8A2E3B] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Llamada a la Acción */}
        <section className="bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            ¿No encuentras tu vestido ideal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Agenda una cita personalizada y te ayudaremos a encontrar el vestido perfecto para ti.
            Nuestro equipo de expertas estará encantado de asesorarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointments"
              className="px-8 py-4 bg-white text-[#8A2E3B] text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Agendar Cita Personalizada
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DressesPage;
