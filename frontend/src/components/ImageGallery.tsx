import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  thumbnailPosition?: 'bottom' | 'left' | 'right' | 'none';
  showThumbnails?: boolean;
  showArrows?: boolean;
  showFullscreenButton?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  maxHeight?: string;
  aspectRatio?: string;
  onImageChange?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Gallery image',
  className = '',
  thumbnailPosition = 'bottom',
  showThumbnails = true,
  showArrows = true,
  showFullscreenButton = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  maxHeight = '500px',
  aspectRatio = '16/9',
  onImageChange,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // If images array is empty, show placeholder
  if (images.length === 0) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center rounded-lg ${className}`}
        style={{ maxHeight, aspectRatio }}
      >
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Navigate to previous image
  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  };

  // Navigate to next image
  const nextImage = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  };

  // Select specific image
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    if (onImageChange) onImageChange(index);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;
    
    if (isSwipeLeft) {
      nextImage();
    }
    
    if (isSwipeRight) {
      prevImage();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && !isFullscreen) {
      interval = setInterval(() => {
        nextImage();
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, autoPlayInterval, currentImageIndex, isFullscreen]);

  // Thumbnail layout classes
  const getThumbnailLayoutClasses = () => {
    switch (thumbnailPosition) {
      case 'left':
        return 'flex-row';
      case 'right':
        return 'flex-row-reverse';
      case 'bottom':
      default:
        return 'flex-col';
    }
  };

  // Thumbnail container classes
  const getThumbnailContainerClasses = () => {
    switch (thumbnailPosition) {
      case 'left':
      case 'right':
        return 'flex flex-col h-full overflow-auto p-2 gap-2';
      case 'bottom':
      default:
        return 'flex flex-row overflow-x-auto p-2 gap-2';
    }
  };

  // Function to render arrows
  const renderArrows = () => {
    if (!showArrows) return null;
    
    return (
      <>
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
          aria-label="Previous image"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
          aria-label="Next image"
        >
          <FaChevronRight />
        </button>
      </>
    );
  };

  // Function to render fullscreen button
  const renderFullscreenButton = () => {
    if (!showFullscreenButton) return null;
    
    return (
      <button 
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? <FaTimes /> : <FaExpand />}
      </button>
    );
  };

  // Function to render thumbnails
  const renderThumbnails = () => {
    if (!showThumbnails) return null;
    
    return (
      <div className={getThumbnailContainerClasses()}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`
              flex-shrink-0 border-2 rounded overflow-hidden transition-all
              ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}
              ${thumbnailPosition === 'left' || thumbnailPosition === 'right' ? 'w-16 h-16' : 'w-20 h-14'}
            `}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    );
  };

  // Fullscreen gallery
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div
          className="w-full h-full relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[currentImageIndex]} 
            alt={`${alt} ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          {renderArrows()}
          {renderFullscreenButton()}
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div className={`flex ${getThumbnailLayoutClasses()}`}>
        {/* Main image container */}
        <div 
          className="relative flex-grow"
          style={{ maxHeight, aspectRatio }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[currentImageIndex]} 
            alt={`${alt} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {renderArrows()}
          {renderFullscreenButton()}
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Thumbnails */}
        {renderThumbnails()}
      </div>
    </div>
  );
};

export default ImageGallery;