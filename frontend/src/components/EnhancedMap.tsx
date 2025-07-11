import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Navigation, Layers, Phone, Mail, Clock, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Configurar el icono del marker personalizado
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para cambiar la vista del mapa
const MapController: React.FC<{ view: 'street' | 'satellite' }> = ({ view }) => {
  const map = useMap();
  
  React.useEffect(() => {
    // Aquí podrías cambiar entre diferentes tipos de mapas
    // Por ahora mantenemos OpenStreetMap
  }, [view, map]);
  
  return null;
};

interface EnhancedMapProps {
  className?: string;
  showControls?: boolean;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({ 
  className = '', 
  showControls = true 
}) => {
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Coordenadas exactas para Calle Gorrión 13, Puerto Serrano, Cádiz
  // Coordenadas del centro de Puerto Serrano ajustadas para la calle específica
  const position: [number, number] = [36.920133, -5.540311];
  
  const businessHours = [
    { day: 'Lunes - Viernes', hours: '10:00 - 14:00, 17:00 - 20:00' },
    { day: 'Sábados', hours: '10:00 - 14:00' },
    { day: 'Domingos', hours: 'Cerrado' }
  ];


  return (
    <>
      <div className={`interactive-map-container ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : ''}`}>
        <div className={`relative ${isFullscreen ? 'absolute inset-4 bg-white rounded-lg overflow-hidden' : 'w-full h-full'}`}>

          <MapContainer
            center={position}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
            zoomControl={true}
            scrollWheelZoom={isFullscreen}
          >
            <MapController view={mapView} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customIcon}>
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-4 text-center">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-[#8A2E3B] mb-2">
                      Orta Novias
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Tu momento perfecto nos espera
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#8A2E3B] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Dirección</p>
                        <p className="text-sm text-gray-600">
                          Calle Gorrión Nº13<br />
                          Puerto Serrano, Cádiz
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-[#8A2E3B] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Teléfono</p>
                        <p className="text-sm text-gray-600">+34 123 456 789</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-[#8A2E3B] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <p className="text-sm text-gray-600">info@ortanovias.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#8A2E3B] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Horarios</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          {businessHours.map((schedule, index) => (
                            <div key={index}>
                              <span className="font-medium">{schedule.day}:</span>{' '}
                              <span>{schedule.hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <a
                      href="https://maps.google.com/?q=Calle+Gorrion+13,+Puerto+Serrano,+Spain"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-[#8A2E3B] text-white text-sm rounded-lg hover:bg-[#D4B483] transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Cómo llegar
                    </a>
                    
                    <a
                      href="tel:+34123456789"
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-[#D4B483] text-white text-sm rounded-lg hover:bg-[#8A2E3B] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar ahora
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      
    </>
  );
};

export default EnhancedMap;
