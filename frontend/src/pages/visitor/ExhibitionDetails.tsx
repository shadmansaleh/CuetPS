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

  const approvalQuery = useQuery(
    ["exhibition", id, "approval", user?._id],
    async () => {
      const { data } = await axios.get(`/api/exhibitions/${id}/get_pending`);
      return data;
    },
    {
      enabled: !!user?._id && !!id,
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

  if (exhibitionQuery.isLoading || approvalQuery.isLoading) {
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
                  onUpload={() => approvalQuery.refetch()}
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
            <span>
              Start: {new Date(exhibition.start_date).toLocaleDateString()}
            </span>
            <span>
              End: {new Date(exhibition.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        {approvalQuery.isSuccess && approvalQuery.data.length > 0 && (
          <>
            <div className="mb-8">
              <div className="relative">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Approval Pending
                </h2>
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-10"></div>
                <MasonryGallery photos={approvalQuery.data} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
          </>
        )}

        <MasonryGallery
          photos={exhibition.photos}
          onVote={handleVote}
          sortbyVotes={true}
        />
      </div>
    </div>
  );
}
