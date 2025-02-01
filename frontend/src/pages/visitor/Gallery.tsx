import { useState, useEffect } from "react";
import MasonryGallery from "../../components/MasonryGallery";
import type { Photo } from "../../types";
import axios from "@/utils/axios";
import { useQuery } from "react-query";
import Loading from "@/components/Loading";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const photoQuery = useQuery(
    "gallery",
    async () => {
      const { data } = await axios.get("/api/photos/20");
      return data;
    },
    {
      onSuccess: (data) => setPhotos(data),
    }
  );

  const handleVote = async (photoId: string) => {
    // TODO: Implement voting
    console.log("Voting for photo:", photoId);
  };

  if (photoQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h1>
      <MasonryGallery photos={photos} onVote={handleVote} />
    </div>
  );
}
