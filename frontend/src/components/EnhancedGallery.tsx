import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

interface EnhancedGalleryProps {
  images: string[];
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const EnhancedGallery: React.FC<EnhancedGalleryProps> = ({
  images,
  alt,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [_isFullscreen, setIsFullscreen] = useState(false); // Prefijo _ para indicar que no se usa
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto slideshow
  useEffect(() => {
    if (!isAutoplay || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoplay, images.length]);

  // Reset states when image changes
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
    setImagePosition({ x: 0, y: 0 });
    setIsZoomed(false);
    setImageLoading(true); // Mostrar loading cuando cambia la imagen
  }, [currentIndex]);

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageLoading(true);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'r':
        case 'R':
          rotate();
          break;
        case ' ':
          e.preventDefault();
          toggleAutoplay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
    setIsZoomed(true);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setIsZoomed(false);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setImagePosition({ x: 0, y: 0 });
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(prev => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `${alt}-${currentIndex + 1}.jpg`;
    link.click();
  };

  // Mouse drag functionality for zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 5}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={rotate}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={downloadImage}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
            isZoomed ? 'cursor-move' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
            transformOrigin: 'center center'
          }}
          onMouseDown={handleMouseDown}
          onClick={isZoomed ? undefined : () => zoomIn()}
          onDoubleClick={resetZoom}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          draggable={false}
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white/10 transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white/10 transition-all duration-200 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex flex-col items-center gap-4">
          {/* Autoplay Toggle */}
          {images.length > 1 && (
            <button
              onClick={toggleAutoplay}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAutoplay 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white'
              }`}
            >
              {isAutoplay ? 'Pausar slideshow' : 'Iniciar slideshow'}
            </button>
          )}
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-white shadow-lg' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${alt} miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {imageLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white opacity-50"></div>
        </div>
      )}

      {/* Help overlay */}
      <div className="absolute top-20 right-4 bg-black/70 text-white p-3 rounded-lg text-xs opacity-70 hover:opacity-100 transition-opacity duration-200">
        <div className="space-y-1">
          <div>← → Navegar</div>
          <div>+ - Zoom</div>
          <div>R Rotar</div>
          <div>Espacio Slideshow</div>
          <div>Esc Cerrar</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGallery;
