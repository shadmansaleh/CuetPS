import { useState } from "react";
import { useParams } from "react-router-dom";
import MasonryGallery from "../../components/MasonryGallery";
import type { Exhibition } from "../../types";
import PhotoUploadModal from "@/components/PhotoUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import { useQuery } from "react-query";
import axios from "@/utils/axios";

export default function ExhibitionDetails() {
  const { id } = useParams<{ id: string }>();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const { user } = useAuth();

  const exhibitionQuery = useQuery(
    ["exhibition", id],
    async () => {
      const { data } = await axios.get(`/api/exhibitions/${id}`);
      return data;
    },
    {
      onSuccess: (data) => setExhibition(data),
    }
  );

  const handleVote = async (photoId: string) => {
    if (!exhibition) return;
    try {
      const has_vote = !!exhibition.photos
        .find((photo) => photo._id == photoId)
        ?.votes.find((u) => u == user?._id);

      const res = await axios.post(
        `/api/photos/${photoId}/${!has_vote ? "vote" : "unvote"}`
      );
      if (res.status == 200) {
        const photo = res.data;
        setExhibition((prevExhibition) => {
          if (!prevExhibition) return prevExhibition;
          return {
            ...prevExhibition,
            photos: prevExhibition.photos.map((p) => {
              if (p._id == photo._id) return photo;
              return p;
            }),
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (exhibitionQuery.isLoading) {
    return <Loading />;
  }

  if (!exhibition) {
    return <div>Exhibition not found</div>;
  }

  const isPastDeadline = new Date() > new Date(exhibition.end_date);
  const isNotbegin = new Date() < new Date(exhibition.start_date);
  return (
    <div>
      <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {exhibition.title}
            </h1>
            {user &&
              (!isPastDeadline && !isNotbegin ? (
                <PhotoUploadModal
                  className="sticky bottom-12 right-12"
                  exhibitionId={id as string}
                >
                  <button className="btn btn-outline btn-md btn-primary cursor-pointer">
                    Upload
                  </button>
                </PhotoUploadModal>
              ) : isPastDeadline ? (
                <p className="text-red-500 font-medium">
                  We are no longer accepting photo submissions.
                </p>
              ) : (
                <p className="text-grey-500 font-medium">Has not started yet</p>
              ))}
          </div>
          <p className="text-gray-600 mb-4">{exhibition.description}</p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>Status: {exhibition.status}</span>
            <span>
              Start: {new Date(exhibition.start_date).toLocaleDateString()}
            </span>
            <span>
              End: {new Date(exhibition.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <MasonryGallery photos={exhibition.photos} onVote={handleVote} />
      </div>
    </div>
  );
}
