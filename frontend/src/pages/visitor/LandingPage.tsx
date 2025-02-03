import { Link } from "react-router-dom";
import { Camera, Image, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Full Background Image */}
      <div
        className="relative bg-cover bg-center w-full h-screen flex items-center justify-center mb-16"
        style={{ backgroundImage: "url('/cuetps.jpg')" }}
      >
        <div className="bg-transparent bg-opacity-50 p-8 rounded-xl text-center text-white">
          {/* Animated Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to CuetPS
          </motion.h1>

          {/* Animated Subheading */}
          <motion.p
            className="text-xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Discover and share amazing photographs from our community
          </motion.p>

          {/* Explore Button */}
          <Link
            to="/gallery"
            className="inline-block bg-indigo-800 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Explore Gallery
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 pb-15 grid md:grid-cols-3 gap-8">
        {[
          { Icon: Camera, title: "Share Your Photos", description: "Upload and share your best photographs with our community" },
          { Icon: Image, title: "Browse Gallery", description: "Explore stunning photographs from talented photographers" },
          { Icon: Award, title: "Join Exhibitions", description: "Participate in themed exhibitions and showcase your work" },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center min-h-[250px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <feature.Icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      {/* About Us Section */}
      <div className="bg-gray-50 py-16 my-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gray-500 italic mb-2">Some words</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ABOUT US</h2>
          </motion.div>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            CuetPS is a vibrant community of photography enthusiasts, curators, and
            creators dedicated to celebrating the art of photography through
            exhibitions, workshops, and collaborative projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/about"
              className="px-8 py-3 text-pink-400 border-2 border-pink-400 rounded-lg hover:bg-pink-400 hover:text-white transition-colors"
            >
              Read more
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Contact Us Section */}
      
    </div>
  );
}
