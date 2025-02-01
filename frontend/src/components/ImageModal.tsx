// import React from 'react';
import { X } from "lucide-react";
import type { Photo } from "../types";
import { useEffect } from "react";

interface ImageModalProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageModal({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: ImageModalProps) {
  const photo = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowRight" && currentIndex < photos.length - 1) {
        onNext();
      } else if (event.key === "ArrowLeft" && currentIndex > 0) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious, currentIndex, photos.length]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-8 w-8" />
      </button>

      <button
        onClick={onPrevious}
        className={`absolute left-4 text-white hover:text-gray-300 text-4xl ${
          currentIndex === 0 && "hidden"
        }`}
        disabled={currentIndex === 0}
      >
        ‹
      </button>

      <div className="max-w-7xl max-h-[90vh] relative">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="max-h-[90vh] max-w-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <h3 className="text-xl font-bold">{photo.title}</h3>
          {photo.caption && <p className="mt-2">{photo.caption}</p>}
        </div>
      </div>

      <button
        onClick={onNext}
        className={`absolute right-4 text-white hover:text-gray-300 text-4xl ${
          currentIndex === photos.length - 1 && "hidden"
        }`}
        disabled={currentIndex === photos.length - 1}
      >
        ›
      </button>
    </div>
  );
}
