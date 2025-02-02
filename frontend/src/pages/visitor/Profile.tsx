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

  const [user, setUser] = useState<User | null>(
    !id || id == "me" ? cur_user : null
  );

  const [photos, setPhotos] = useState<Photo[]>([]);

  const userQuery = useQuery(
    ["user", id],
    async () => {
      const { data } = await axios.get(`/api/user/username/${id}`);
      return data;
    },
    {
      enabled: !!id && id != "me",
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

  if (!user) {
    // user not found
    return (
      <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8 text-2xl flex justify-center items-center">
        <div>User not found</div>
      </div>
    );
  }
  if (userQuery.isLoading || photosQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl min-h-dvh mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Photos</h2>
        <MasonryGallery photos={photos} />
      </div>
    </div>
  );
}
