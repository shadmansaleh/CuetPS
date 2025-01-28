import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { Exhibition } from '../../types'; // Adjust import according to your types location

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  useEffect(() => {
    // Fetch exhibitions from the API
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get('/api/exhibitions'); // Fetch data from the backend
        setExhibitions(response.data); // Update the exhibitions state with the fetched data
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };

    fetchExhibitions();
  }, []); // Run this effect only once when the component mounts
  
// useEffect(() => {
  //   // TODO: Fetch exhibitions from API
  //   setExhibitions([
  //     {
  //       id: '1',
  //       title: 'Nature Photography',
  //       description: 'Celebrating the beauty of nature',
  //       thumbnail_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  //       start_date: '2024-03-01',
  //       end_date: '2024-03-31',
  //       status: 'active',
  //       created_at: new Date().toISOString()
  //     },
  //     // Add more sample exhibitions
  //   ]);
  // }, []);
  return (
    <div className="max-w-7xl mx-auto min-h-dvh px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Exhibitions</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => (
          <Link
            key={exhibition.id} // Use the exhibition id as the unique key
            to={`/exhibitions/${exhibition.id}`} // Link to the individual exhibition page
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={exhibition.thumbnail_url} // Use thumbnail_url for the image
                  alt={exhibition.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{exhibition.title}</h3>
                <p className="text-gray-600 mb-2">{exhibition.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: {exhibition.status}</span>
                  <span>{new Date(exhibition.start_date).toLocaleDateString()} - {new Date(exhibition.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
