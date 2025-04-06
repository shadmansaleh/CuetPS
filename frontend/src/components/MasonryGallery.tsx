import { useState } from "react";
import Masonry from "react-masonry-css";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ImageModal from "./ImageModal";
import type { Photo } from "../types";
// import { twMerge } from "tailwind-merge";

interface MasonryGalleryProps {
  photos: Photo[];
  onVote?: (photoId: string) => Promise<void>;
  sortbyVotes?: boolean;
}

export default function MasonryGallery({
  photos,
  onVote,
  sortbyVotes,
}: MasonryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { user } = useAuth();

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Add some controlled randomness to aspect ratios to make layout more interesting
  // but keep heights within reasonable bounds (0.5x to 1.5x of original)
  // photos = photos.map((photo) => ({
  //   ...photo,
  //   aspect_ratio: photo.aspect_ratio * (0.75 + Math.random() * 0.5),
  // }));

  // Sort photos based on aspect ratio before rendering

  // const sortedPhotos = [...photos].sort((a, b) => {
  //   const heightA = Math.round(100 / a.aspect_ratio);
  //   const heightB = Math.round(100 / b.aspect_ratio);
  //   return heightA - heightB;
  // });
  if (sortbyVotes) {
    const sortedPhotos = [...photos].sort((a, b) => {
      return b.votes.length - a.votes.length;
    });
    photos = sortedPhotos;
  }
  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="mb-4 relative group cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={photo.image_url}
              alt={photo.title}
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
              {user && onVote && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVote(photo._id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {photo.votes.find((u) => u == user._id) ? (
                    <Heart
                      fill="currentColor"
                      className="h-5 w-5 text-red-500"
                    />
                  ) : (
                    <Heart className="h-5 w-5 text-red-500" />
                  )}
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">{photo.title}</h3>
                <p className="text-sm">{photo.votes.length} votes</p>
              </div>
            </div>
          </div>
        ))}
      </Masonry>

      {selectedIndex !== null && (
        <ImageModal
          photos={photos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() =>
            setSelectedIndex((prev) =>
              Math.min((prev || 0) + 1, photos.length - 1),
            )
          }
          onPrevious={() =>
            setSelectedIndex((prev) => Math.max((prev || photos.length) - 1, 0))
          }
        />
      )}
    </>
  );
}
