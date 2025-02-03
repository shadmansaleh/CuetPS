import { useState } from "react";
import MasonryGallery from "../../components/MasonryGallery";
import type { Photo, User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: cur_user } = useAuth();

  const [user, setUser] = useState<User | null>(!id || id === "me" ? cur_user : null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const BASE_URL = "http://localhost:5000";

  const userQuery = useQuery(
    ["user", id],
    async () => {
      const { data } = await axios.get(`/api/user/username/${id}`);
      return data;
    },
    {
      enabled: !!id && id !== "me",
      onSuccess: (data) => setUser(data),
    }
  );

  const photosQuery = useQuery(
    ["user-photos", user?._id],
    async () => {
      const { data } = await axios.get(`/api/photos/user/${user?._id}`);
      return data;
    },
    {
      enabled: !!user,
      onSuccess: (data) => setPhotos(data),
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpload = async () => {
    if (selectedFile && user) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      try {
        const { data } = await axios.post(
          `/api/user/${user._id}/upload-profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                avatar_url: `${BASE_URL}${data.avatar_url}?t=${new Date().getTime()}`,
              }
            : null
        );

        setPreview(null);
        await userQuery.refetch();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8 text-2xl flex justify-center items-center">
        <div>User not found</div>
      </div>
    );
  }

  if (userQuery.isLoading || photosQuery.isLoading) {
    return <Loading />;
  }

  const avatarSrc = preview || (user.avatar_url ? `${BASE_URL}${user.avatar_url}` : "/default-avatar.png");

  return (
    <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center">
          <img
            src={avatarSrc}
            alt="Profile Preview"
            className="w-40 h-40 rounded-md object-cover border-4 border-gray-300 shadow-sm"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4"
          />

          {selectedFile && (
            <button
              onClick={handleProfilePictureUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
            >
              Upload
            </button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Photos</h2>
        <MasonryGallery photos={photos} />
      </div>
    </div>
  );
}
