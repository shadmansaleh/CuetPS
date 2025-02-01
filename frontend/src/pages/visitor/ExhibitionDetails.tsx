import { useState } from "react";
import { useParams } from "react-router-dom";
import MasonryGallery from "../../components/MasonryGallery";
import type { Exhibition } from "../../types";
import PhotoUploadModal from "@/components/PhotoUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { IoMdCloudUpload } from "react-icons/io";
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

  if (exhibitionQuery.isLoading) {
    return <Loading />;
  }

  if (!exhibition) {
    return <div>Exhibition not found</div>;
  }
  return (
    <div>
      <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {exhibition.title}
          </h1>
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
        <MasonryGallery photos={exhibition.photos} />
        {user && (
          <PhotoUploadModal
            className="absolute bottom-12 right-12"
            exhibitionId={id as string}
          >
            <IoMdCloudUpload className="text-blue-600 cursor-pointer h-16 w-16" />
          </PhotoUploadModal>
        )}
      </div>
    </div>
  );
}
