import { Link } from "react-router-dom";
import { Camera, Image, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to CuetPS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover and share amazing photographs from our community
          </p>
          <Link
            to="/gallery"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Explore Gallery
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Camera className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Your Photos</h3>
            <p className="text-gray-600">
              Upload and share your best photographs with our community
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Browse Gallery</h3>
            <p className="text-gray-600">
              Explore stunning photographs from talented photographers
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join Exhibitions</h3>
            <p className="text-gray-600">
              Participate in themed exhibitions and showcase your work
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
