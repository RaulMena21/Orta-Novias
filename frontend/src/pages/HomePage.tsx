import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Clock, Phone, Mail, MapPin, Users, Gift, Camera, Calendar, Navigation } from 'lucide-react';
import EnhancedMap from '../components/EnhancedMap';
import '../styles/map.css';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Fondo base con gradiente complejo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F4] via-[#F8F5F2] to-[#F5F0E8]"></div>
        
        {/* Capas decorativas */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4B483]/10 via-transparent to-[#8A2E3B]/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8A2E3B]/5 via-transparent to-[#D4B483]/10"></div>
        
        {/* Elementos decorativos - Círculos */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4B483]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-[#8A2E3B]/15 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#D4B483]/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-[#8A2E3B]/20 rounded-full blur-lg animate-pulse delay-500"></div>
        
        {/* Elementos decorativos - Formas geométricas con movimiento */}
        <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-[#D4B483]/30 rotate-45 blur-sm animate-bounce duration-3000"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-[#8A2E3B]/25 rotate-45 blur-sm animate-bounce delay-1000 duration-3000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-[#D4B483]/20 rotate-45 blur-sm animate-bounce delay-2000 duration-3000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-[#8A2E3B]/30 rotate-45 blur-sm animate-bounce delay-1500 duration-3000"></div>
        
        {/* Patrón de puntos decorativos */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-2 h-2 bg-[#D4B483] rounded-full"></div>
          <div className="absolute top-24 left-32 w-1.5 h-1.5 bg-[#8A2E3B] rounded-full"></div>
          <div className="absolute top-32 left-24 w-1 h-1 bg-[#D4B483] rounded-full"></div>
          <div className="absolute top-40 left-40 w-2 h-2 bg-[#8A2E3B] rounded-full"></div>
          
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-[#D4B483] rounded-full"></div>
          <div className="absolute top-36 right-32 w-2 h-2 bg-[#8A2E3B] rounded-full"></div>
          <div className="absolute top-44 right-16 w-1 h-1 bg-[#D4B483] rounded-full"></div>
          <div className="absolute top-52 right-40 w-1.5 h-1.5 bg-[#8A2E3B] rounded-full"></div>
          
          <div className="absolute bottom-20 left-24 w-2 h-2 bg-[#D4B483] rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-[#8A2E3B] rounded-full"></div>
          <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-[#D4B483] rounded-full"></div>
          
          <div className="absolute bottom-24 right-24 w-1.5 h-1.5 bg-[#8A2E3B] rounded-full"></div>
          <div className="absolute bottom-36 right-16 w-2 h-2 bg-[#D4B483] rounded-full"></div>
          <div className="absolute bottom-44 right-36 w-1 h-1 bg-[#8A2E3B] rounded-full"></div>
        </div>
        
        {/* Efectos de luz suave */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-2/3 bg-gradient-to-t from-[#D4B483]/5 to-transparent blur-2xl"></div>
        
        {/* Overlay final suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-[#8A2E3B]/5"></div>
        
        <div className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-[#8A2E3B] tracking-tight drop-shadow-lg leading-none">
              Orta Novias
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#D4B483] to-[#8A2E3B] mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#8A2E3B] max-w-4xl mx-auto leading-relaxed italic">
            "Donde cada sueño se viste de perfección"
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
            Más de 25 años de experiencia creando momentos únicos e irrepetibles. 
            <br className="hidden md:block" />
            Tu vestido de ensueño te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link 
              to="/appointments" 
              className="group px-12 py-5 bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-white/20"
            >
              <span className="flex items-center justify-center gap-3">
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Reserva tu Cita Exclusiva
              </span>
            </Link>
            <Link 
              to="/dresses" 
              className="group px-12 py-5 border-2 border-[#D4B483] text-[#8A2E3B] text-xl font-semibold rounded-full hover:bg-[#D4B483] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-3">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Descubre Nuestra Colección
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
      

            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-[#8A2E3B] leading-tight">
              Una Tradición de Elegancia
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Más de dos décadas creando momentos únicos y vestidos de ensueño
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  Desde 1998, <span className="font-semibold text-[#8A2E3B]">Orta Novias</span> ha sido sinónimo de 
                  <em className="text-[#D4B483]"> elegancia atemporal</em> y <em className="text-[#D4B483]">artesanía excepcional</em>. 
                  Lo que comenzó como un pequeño atelier familiar, se ha convertido en el destino de confianza 
                  para novias que buscan la perfección absoluta.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Cada vestido que creamos cuenta una historia única, porque entendemos que 
                  <strong className="text-[#8A2E3B]">cada novia es extraordinaria</strong>. 
                  Nuestro compromiso trasciende la moda: creamos experiencias inolvidables con 
                  atención meticulosa al detalle y un servicio personalizado que supera expectativas.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#D4B483]/20">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-[#8A2E3B] mb-2 group-hover:text-[#D4B483] transition-colors duration-300">25+</div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Años de Maestría</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-[#8A2E3B] mb-2 group-hover:text-[#D4B483] transition-colors duration-300">2000+</div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Sueños Realizados</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-[#8A2E3B] mb-2 group-hover:text-[#D4B483] transition-colors duration-300">100%</div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Excelencia</div>
                </div>
              </div>
            
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-[#F8F5F2] to-[#F0ECE5] p-8 rounded-2xl shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#D4B483] rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#8A2E3B] rounded-full opacity-40"></div>
                
                <div className="h-96 bg-gradient-to-br from-[#D4B483] via-[#C4A373] to-[#8A2E3B] rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Decorative pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-8 left-8 w-4 h-4 border-2 border-white rotate-45"></div>
                    <div className="absolute top-16 right-12 w-3 h-3 border-2 border-white rotate-45"></div>
                    <div className="absolute bottom-12 left-12 w-5 h-5 border-2 border-white rotate-45"></div>
                    <div className="absolute bottom-8 right-8 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="text-center text-white z-10">
                    <Camera className="w-20 h-20 mx-auto mb-4 opacity-90" />
                    <p className="text-xl font-serif font-semibold">Momentos Únicos</p>
                    <p className="text-sm opacity-80 mt-2">Capturando la esencia de cada sueño</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 italic">
                    "Cada vestido es una obra de arte, cada novia una musa"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalog */}
      <section className="py-20 bg-gradient-to-b from-[#F8F5F2] to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#D4B483]"></div>
              <span className="text-sm font-semibold text-[#D4B483] uppercase tracking-wider">Colección Exclusiva</span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#D4B483]"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-[#8A2E3B] leading-tight">
              Catálogo de Ensueño
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Descubre nuestra selección curada de vestidos excepcionales, donde cada pieza 
              es una obra maestra diseñada para hacer de tu día especial un momento eterno.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {[
              {
                title: "Elegancia Atemporal",
                subtitle: "Colección Clásica",
                description: "Siluetas icónicas que trascienden tendencias, diseñadas para novias que valoran la sofisticación eterna.",
                price: "Desde €1,200",
                gradient: "from-[#8A2E3B] via-[#A13347] to-[#B8475A]"
              },
              {
                title: "Modernidad Sublime",
                subtitle: "Colección Contemporánea", 
                description: "Líneas vanguardistas y detalles innovadores para la novia que define su propio estilo único.",
                price: "Desde €1,500",
                gradient: "from-[#D4B483] via-[#C4A373] to-[#B49363]"
              },
              {
                title: "Romance Infinito",
                subtitle: "Colección Romántica",
                description: "Encajes delicados y detalles etéreos que capturan la esencia más pura del amor verdadero.",
                price: "Desde €1,000",
                gradient: "from-[#8A2E3B] via-[#D4B483] to-[#A13347]"
              }
            ].map((collection, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`h-80 bg-gradient-to-br ${collection.gradient} relative overflow-hidden`}>
                  {/* Decorative patterns */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 left-6 w-6 h-6 border-2 border-white rotate-45"></div>
                    <div className="absolute top-12 right-8 w-4 h-4 border-2 border-white rotate-45"></div>
                    <div className="absolute bottom-8 left-12 w-5 h-5 border-2 border-white rotate-45"></div>
                    <div className="absolute bottom-6 right-6 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Heart className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-lg font-serif font-semibold opacity-90">{collection.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-[#8A2E3B] group-hover:text-[#D4B483] transition-colors duration-300">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed font-light">
                    {collection.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-[#D4B483]">{collection.price}</span>
                    <Link 
                      to="/dresses" 
                      className="inline-flex items-center gap-2 text-[#8A2E3B] hover:text-[#D4B483] font-semibold transition-colors duration-300 group"
                    >
                      <span>Explorar</span>
                      <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/dresses" 
              className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <span>Descubre Toda Nuestra Colección</span>
              <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#D4B483]"></div>
              <span className="text-sm font-semibold text-[#D4B483] uppercase tracking-wider">Testimonios Reales</span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#D4B483]"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-[#8A2E3B] leading-tight">
              Historias de Amor Verdadero
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Cada testimonio es un eco de felicidad, una historia de confianza que nos inspira 
              a seguir creando momentos únicos e irrepetibles.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Isabella Rodríguez",
                role: "Novia 2024",
                text: "Desde el primer momento supe que había encontrado mi lugar. El equipo de Orta Novias no solo me ayudó a encontrar el vestido perfecto, sino que hicieron realidad cada uno de mis sueños. Una experiencia absolutamente mágica.",
                rating: 5
              },
              {
                name: "Carmen Martínez",
                role: "Novia 2023", 
                text: "La atención al detalle es extraordinaria. Cada ajuste, cada consulta, todo fue perfecto. Mi vestido no era solo hermoso, era exactamente lo que había soñado desde niña. Orta Novias superó todas mis expectativas.",
                rating: 5
              },
              {
                name: "Lucía Fernández",
                role: "Novia 2024",
                text: "Profesionalismo, elegancia y calidez humana. El proceso de selección fue tan especial como la boda misma. Gracias por hacer que me sintiera como una verdadera princesa en el día más importante de mi vida.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative">
                {/* Background card with subtle gradient */}
                <div className="bg-gradient-to-br from-white to-[#F8F5F2] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-[#D4B483]/10">
                  {/* Decorative quote mark */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-[#D4B483] to-[#8A2E3B] rounded-full flex items-center justify-center">
                    <span className="text-white font-serif text-lg">"</span>
                  </div>
                  
                  {/* Stars rating */}
                  <div className="flex mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-5 h-5 text-[#D4B483] fill-current mx-0.5" />
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <blockquote className="text-gray-700 mb-8 italic leading-relaxed text-center font-light text-lg">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Author info */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4B483] to-[#8A2E3B] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[#8A2E3B] text-lg">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/testimonials" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-[#8A2E3B] text-[#8A2E3B] text-lg font-semibold rounded-full hover:bg-[#8A2E3B] hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <span>Lee Más Historias de Amor</span>
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gradient-to-b from-[#F8F5F2] to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#D4B483]"></div>
              <span className="text-sm font-semibold text-[#D4B483] uppercase tracking-wider">Experiencia Integral</span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#D4B483]"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-[#8A2E3B] leading-tight">
              Servicios 
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Más que una boutique, somos tu equipo de confianza dedicado a hacer realidad 
              cada detalle de tus sueños más preciados.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                image: "/asesoriaPersonalizada.jpg",
                title: "Asesoría Personalizada",
                description: "Consultoría exclusiva uno a uno para descubrir el vestido que refleje perfectamente tu esencia única y realce tu belleza natural.",
                features: ["Sesión privada", "Análisis de estilo", "Recomendaciones expertas"]
              },
              {
                image: "/ajustesDeAltaCostura.jpg",
                title: "Ajustes de Alta Costura",
                description: "Modificaciones artesanales realizadas por maestros sastres para garantizar un ajuste impecable y una silueta de ensueño.",
                features: ["Precisión milimétrica", "Múltiples pruebas", "Acabado perfecto"]
              },
              {
                image: "/accesorioNovia.jpg",
                title: "Accesorios Exclusivos",
                description: "Colección curada de velos, joyas y calzado de diseñadores prestigiosos para completar tu look con elegancia atemporal.",
                features: ["Piezas únicas", "Calidad premium", "Asesoramiento completo"]
              }
            ].map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                {/* Header with image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8A2E3B]/80 via-[#8A2E3B]/40 to-transparent"></div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white text-center">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed font-light">
                    {service.description}
                  </p>
                  
                  {/* Features list */}
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-[#D4B483] rounded-full mr-3"></div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Call to action */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link 
                      to="/appointments" 
                      className="inline-flex items-center gap-2 text-[#8A2E3B] hover:text-[#D4B483] font-semibold transition-colors duration-300 group"
                    >
                      <span>Solicitar Información</span>
                      <Gift className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
                      <div className="text-gray-600">Calle Gorrion 13, Puerto Serrano</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-[#D4B483] mr-4" />
                    <div>
                      <div className="font-semibold text-[#8A2E3B]">Teléfono</div>
                      <div className="text-gray-600">+34 123 456 789 <br />+34 987 654 321</div>
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
                      <div className="text-gray-600">Lun-Sáb: 09:00-14:00/17:00-21:00</div>
                    </div>
                  </div>
                </div>
                
    
              </div>
            </div>
            
            <div>
              <div className="bg-[#F8F5F2] p-8 rounded-lg shadow-lg h-full">
                <h3 className="text-2xl font-semibold mb-6 text-[#8A2E3B]">Mapa de Ubicación</h3>
                
                <div className="h-80 rounded-lg overflow-hidden shadow-inner">
                  <EnhancedMap className="w-full h-full" showControls={true} />
                </div>
                
                <div className="mt-4 text-center">
                  <a
                    href="https://maps.google.com/?q=Calle+Gorrion+13,+Puerto+Serrano,+Spain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#8A2E3B] hover:text-[#D4B483] transition-colors font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F8F5F2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#8A2E3B]/5 to-[#D4B483]/5 rounded-2xl p-12">
              <h3 className="text-3xl font-serif font-bold text-[#8A2E3B] mb-4">
                ¿Lista para vivir tu experiencia única?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-light">
                Agenda tu cita personalizada y descubre por qué miles de novias han confiado en nosotros 
                para los momentos más importantes de sus vidas.
              </p>
              <Link 
                to="/appointments" 
                className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#8A2E3B] to-[#A13347] text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span>Reservar Mi Experiencia</span>
                <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

     


      {/* Footer */}
      <footer className="bg-[#8A2E3B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold mb-4">Orta Novias</h3>
              <p className="text-gray-300 mb-4">
                Tu boutique de confianza para el día más especial de tu vida. 
                Donde los sueños se visten de elegancia.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:contents">
              <div className="md:col-span-1 md:pl-8">
                <h4 className="text-lg font-semibold mb-4">Navegación</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                  <li><Link to="/dresses" className="hover:text-white transition-colors">Vestidos</Link></li>
                  <li><Link to="/appointments" className="hover:text-white transition-colors">Citas</Link></li>
                  <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonios</Link></li>
                </ul>
              </div>
              
              <div className="md:col-span-1">
                <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Calle Gorrion Nº13</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+34 123 456 789 <br />+34 123 456 789 </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>info@ortanovias.com</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block md:col-span-1">
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Asesoría Personalizada</li>
                <li>Ajustes Profesionales</li>
                <li>Accesorios Exclusivos</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Orta Novias. Todos los derechos reservados. | Diseñado con ❤️ para novias únicas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
