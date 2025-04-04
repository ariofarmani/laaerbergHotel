import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  initialIndex?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Gallery image',
  className = '',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Handle auto-play functionality
  useEffect(() => {
    if (!autoPlay || isLightboxOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length, isLightboxOpen]);
  
  // Navigate to previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  // Navigate to next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };
  
  // Navigate to specific image by index
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Open and close lightbox
  const openLightbox = () => {
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // If no images, don't render anything
  if (!images.length) return null;
  
  return (
    <div className={`relative ${className}`}>
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 focus:outline-none"
          aria-label="Previous image"
        >
          <FaChevronLeft size={16} />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 focus:outline-none"
          aria-label="Next image"
        >
          <FaChevronRight size={16} />
        </button>
        
        {/* Expand button */}
        <button
          onClick={openLightbox}
          className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-gray-800 focus:outline-none"
          aria-label="Open fullscreen gallery"
        >
          <FaExpand size={16} />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 focus:outline-none ${
                currentIndex === index
                  ? 'ring-2 ring-primary'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            aria-label="Close fullscreen gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div className="relative max-w-5xl w-full">
            <img
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1} (fullscreen)`}
              className="w-full max-h-[80vh] object-contain"
            />
            
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 text-white focus:outline-none"
              aria-label="Previous image (fullscreen)"
            >
              <FaChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 text-white focus:outline-none"
              aria-label="Next image (fullscreen)"
            >
              <FaChevronRight size={20} />
            </button>
            
            {/* Lightbox image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;