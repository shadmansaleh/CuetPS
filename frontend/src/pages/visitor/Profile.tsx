import { useRef, useState } from "react";
import MasonryGallery from "../../components/MasonryGallery";
import type { Photo, User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import axios from "@/utils/axios";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";
import default_avater from "@/assets/default_avater.jpg";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: cur_user } = useAuth();

  const [user, setUser] = useState<User | null>(
    !id || id === "me" ? cur_user : null
  );

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadButtonRef = useRef<HTMLInputElement>(null);

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

  const myProfile = cur_user !== null && user?._id === cur_user?._id;

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
      formData.append("file", selectedFile);

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

        setSelectedFile(null);
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

  const avatarSrc =
    preview || (user.avatar_url ? user.avatar_url : default_avater);

  return (
    <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={avatarSrc}
              alt="Profile Preview"
              className={`w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-sm transition duration-300 ${
                myProfile && "group-hover:brightness-75"
              }`}
            />
            {myProfile && (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                onClick={() => myProfile && uploadButtonRef.current?.click()}
              >
                <span className="text-white font-medium text-sm">
                  Upload Photo
                </span>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={uploadButtonRef}
            onChange={handleFileChange}
            className="mt-4 hidden"
          />

          {selectedFile && (
            <button
              onClick={handleProfilePictureUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
            >
              Save Profile Picture
            </button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {user.role !== "admin" && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos</h2>
          <MasonryGallery photos={photos} />
        </div>
      )}
    </div>
  );
}
