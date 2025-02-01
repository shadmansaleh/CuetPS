import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MasonryGallery from "../../components/MasonryGallery";
import type { Exhibition, Photo } from "../../types";
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

  // useEffect(() => {
  //   // TODO: Fetch exhibition and photos from API
  //   setExhibition({
  //     id: "1",
  //     title: "Nature Photography",
  //     description: "Celebrating the beauty of nature",
  //     thumbnail_url:
  //       "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  //     start_date: "2024-03-01",
  //     end_date: "2024-03-31",
  //     status: "active",
  //     created_at: new Date().toISOString(),
  //   });

  //   setPhotos([
  //     {
  //       id: "1",
  //       title: "Mountain Landscape",
  //       description: "Beautiful mountain view at sunset",
  //       image_url:
  //         "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  //       user_id: "1",
  //       votes: 42,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "1",
  //       title: "Mountain Landscape",
  //       description: "Beautiful mountain view at sunset",
  //       image_url:
  //         "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  //       user_id: "1",
  //       votes: 42,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "2",
  //       title: "Ocean View",
  //       description:
  //         "A serene view of the ocean with waves crashing on the shore",
  //       image_url:
  //         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  //       user_id: "2",
  //       votes: 35,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "3",
  //       title: "Forest Path",
  //       description: "A peaceful forest path surrounded by tall trees",
  //       image_url:
  //         "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  //       user_id: "3",
  //       votes: 50,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "4",
  //       title: "City Skyline",
  //       description: "A vibrant city skyline during sunset",
  //       image_url:
  //         "https://images.unsplash.com/photo-1668786418135-6227c68c8391",
  //       user_id: "4",
  //       votes: 29,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "5",
  //       title: "Snowy Mountains",
  //       description: "Snow-covered mountains under a clear blue sky",
  //       image_url:
  //         "https://plus.unsplash.com/premium_photo-1674635191027-3d9a5520790f",
  //       user_id: "5",
  //       votes: 47,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "6",
  //       title: "Desert Dunes",
  //       description: "Golden sand dunes under a clear sky",
  //       image_url:
  //         "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
  //       user_id: "6",
  //       votes: 38,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "7",
  //       title: "Tropical Beach",
  //       description: "Crystal clear water and white sand beach with palm trees",
  //       image_url:
  //         "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  //       user_id: "7",
  //       votes: 55,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "8",
  //       title: "Aurora Borealis",
  //       description: "Northern lights over a snowy landscape",
  //       image_url:
  //         "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  //       user_id: "8",
  //       votes: 62,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "9",
  //       title: "Countryside View",
  //       description: "Rolling hills and meadows under a cloudy sky",
  //       image_url:
  //         "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  //       user_id: "9",
  //       votes: 31,
  //       created_at: new Date().toISOString(),
  //     },
  //     {
  //       id: "10",
  //       title: "Rainforest Canopy",
  //       description: "Lush green rainforest trees viewed from above",
  //       image_url:
  //         "https://images.unsplash.com/photo-1444044205806-38f3ed106c10",
  //       user_id: "10",
  //       votes: 49,
  //       created_at: new Date().toISOString(),
  //     },
  //     // Add more sample photos here
  //   ]);
  // }, [id]);

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
          <PhotoUploadModal className="absolute bottom-12 right-12">
            <IoMdCloudUpload className="text-blue-600 cursor-pointer h-16 w-16" />
          </PhotoUploadModal>
        )}
      </div>
    </div>
  );
}
