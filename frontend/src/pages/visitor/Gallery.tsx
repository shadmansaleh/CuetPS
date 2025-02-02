import { useState } from "react";
import MasonryGallery from "../../components/MasonryGallery";
import type { Photo } from "../../types";
import axios from "@/utils/axios";
import { useQuery } from "react-query";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const { user } = useAuth();

  const photoQuery = useQuery(
    "gallery",
    async () => {
      const { data } = await axios.get("/api/photos/all/20");
      return data;
    },
    {
      onSuccess: (data) => setPhotos(data),
    }
  );

  const handleVote = async (photoId: string) => {
    const has_vote = !!photos
      .find((photo) => photo._id == photoId)
      ?.votes.find((u) => u == user?._id);

    const res = await axios.post(
      `/api/photos/${photoId}/${!has_vote ? "vote" : "unvote"}`
    );
    if (res.status == 200) {
      const photo = res.data;
      setPhotos((prevPhotos) => {
        return prevPhotos.map((p) => {
          if (p._id == photo._id) return photo;
          return p;
        });
      });
    }
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
