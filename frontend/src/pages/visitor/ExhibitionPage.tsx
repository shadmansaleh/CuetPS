import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/utils/axios";
import type { Exhibition } from "../../types"; // Adjust import according to your types location
import { useQuery } from "react-query";
import Loading from "@/components/Loading";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const exhibitionsQuery = useQuery(
    "exhibitions",
    async () => {
      const { data } = await axios.get("/api/exhibitions");
      return data;
    },
    {
      onSuccess: (data) => setExhibitions(data),
    }
  );

  if (exhibitionsQuery.isLoading) return <Loading />;
  return (
    <div className="max-w-7xl mx-auto min-h-dvh px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Exhibitions</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => (
          <Link
            key={exhibition._id}
            to={`/exhibitions/${exhibition._id}`}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={exhibition.thumbnail_url}
                  alt={exhibition.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {exhibition.title}
                </h3>
                <p className="text-gray-600 mb-2">{exhibition.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: {exhibition.status}</span>
                  <span>
                    {new Date(exhibition.start_date).toLocaleDateString()} -{" "}
                    {new Date(exhibition.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
