import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/utils/axios";
import type { Exhibition } from "../../types";
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

  const now = new Date();
  const upcoming = exhibitions.filter((e) => new Date(e.start_date) > now);
  const active = exhibitions.filter(
    (e) => new Date(e.start_date) <= now && new Date(e.end_date) >= now
  );
  const past = exhibitions.filter((e) => new Date(e.end_date) < now);

  const renderExhibitions = (title: string, data: Exhibition[]) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 pb-2">
        {title}
      </h2>
      {data.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((exhibition) => (
            <Link
              key={exhibition._id}
              to={`/exhibitions/${exhibition._id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform group-hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={exhibition.thumbnail_url}
                    alt={exhibition.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exhibition.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{exhibition.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    {/* <span>Status: {exhibition.status}</span> */}
                    <span>
                      {new Date(exhibition.start_date).toLocaleDateString()} -
                      {new Date(exhibition.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No {title.toLowerCase()} exhibitions available.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto min-h-dvh px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Exhibitions
      </h1>
      {renderExhibitions("Upcoming Exhibitions", upcoming)}
      {renderExhibitions("Active Exhibitions", active)}
      {renderExhibitions("Past Exhibitions", past)}
    </div>
  );
}
