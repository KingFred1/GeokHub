"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface ImageSliderProps {
  images: Array<{
    asset: any;
    alt?: string;
    caption?: string;
  }>;
  className?: string;
}

export default function ImageSlider({ images, className = "" }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const preloadQueue = useRef<Set<number>>(new Set());

  if (!images || images.length === 0) return null;

  // Initialize loading states
  useEffect(() => {
    setIsLoading(Array(images.length).fill(true));
  }, [images.length]);

  // Preload all images immediately on mount
  useEffect(() => {
    const preloadAllImages = () => {
      images.forEach((image, index) => {
        // Skip if already loaded or in queue
        if (loadedImages.has(index) || preloadQueue.current.has(index)) return;
        
        preloadQueue.current.add(index);
        
        const img = new Image();
        const imageUrl = image?.asset
          ? urlFor(image.asset).width(1200).height(800).quality(85).url()
          : '';
        
        if (imageUrl) {
          img.src = imageUrl;
          img.onload = () => {
            setLoadedImages(prev => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
            preloadQueue.current.delete(index);
            
            // Update loading state for this image
            setIsLoading(prev => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          };
          
          img.onerror = () => {
            preloadQueue.current.delete(index);
            setIsLoading(prev => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          };
        }
      });
    };

    // Start preloading immediately
    preloadAllImages();

    // Also preload on visibility change (if tab was hidden)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        preloadAllImages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [images]); // Only depend on images array

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return newIndex;
    });
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
    
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const handleImageError = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          setIsFullscreen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const currentImage = images[currentIndex];
  const isCurrentImageLoading = isLoading[currentIndex] ?? true;
  
  const imageUrl = currentImage?.asset
    ? urlFor(currentImage.asset).width(1200).height(800).quality(85).url()
    : '';

  const fullscreenImageUrl = currentImage?.asset
    ? urlFor(currentImage.asset).width(1920).quality(90).url()
    : '';

  return (
    <>
      {/* Main Slider */}
      <div className={`relative mb-5 shadow-2xl overflow-hidden bg-background group ${className}`}>
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
          aria-label="View fullscreen"
        >
          <Maximize2 size={20} />
        </button>

        {/* Current Image */}
        <div 
          className="relative w-full aspect-[16/10] md:aspect-[16/9] cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
        >
          {/* Loading Skeleton */}
          {isCurrentImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          
          {/* Main Image */}
          {imageUrl && (
            <img
              ref={el => imageRefs.current[currentIndex] = el}
              src={imageUrl}
              alt={currentImage.alt || "Image"}
              className={`object-cover w-full h-full transition-opacity duration-300 ${
                isCurrentImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="eager" // Always eager for better initial load
              fetchPriority="high" // FIXED: Changed from fetchpriority to fetchPriority
              decoding="async"
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => handleImageError(currentIndex)}
            />
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Image Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm md:text-base">{currentImage.caption}</p>
            </div>
          )}
        </div>

        {/* Dots Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail Preview (for multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`w-10 h-6 rounded overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/50"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {image.asset && (
                  <img
                    src={urlFor(image.asset).width(100).height(60).quality(60).url()}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          <div 
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-10 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-10 transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              {fullscreenImageUrl && (
                <img
                  src={fullscreenImageUrl}
                  alt={currentImage.alt || "Image"}
                  className="max-w-full max-h-[80vh] object-contain"
                  loading="eager"
                  decoding="sync"
                />
              )}
            </div>

            {/* Fullscreen Caption */}
            {currentImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <p className="text-white text-lg text-center">{currentImage.caption}</p>
              </div>
            )}

            {/* Fullscreen Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}