// import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="p-6 bg-base-200 text-base-content min-h-dvh">
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-5xl font-bold text-center mb-16">About CuetPS</h1>

        {/* What is CuetPS Section */}
        <section className="mb-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">What is CuetPS?</h2>
            <p className="text-lg">
              CuetPS is a platform dedicated to celebrating the art of photography at CUET. Our mission
              is to inspire creativity, foster collaboration, and showcase the breathtaking work of
              talented photographers. From exhibitions to interactive community events, we provide a
              space where visual storytelling comes to life.
            </p>
          </div>
          <img
            src="/about1.jpg"
            alt="What is CuetPS"
            className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </section>

        {/* Our Goals Section */}
        <section className="mb-24 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/about2.jpg"
            alt="Our Goals"
            className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Goals</h2>
            <ul className="text-lg list-disc list-inside">
              <li className="mb-2">To provide a platform for photographers to showcase their work.</li>
              <li className="mb-2">To connect individuals through the universal language of photography.</li>
              <li className="mb-2">To host regular exhibitions and competitions to nurture creativity.</li>
            </ul>
          </div>
        </section>

        {/* Future Works Section */}
        <section className="mb-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Future Works</h2>
            <p className="text-lg">
              We aim to expand CuetPS into a global platform, incorporating innovative features like
              virtual exhibitions, photography tutorials, and international collaborations. Our vision
              is to become a hub for creative minds and a source of inspiration for photography
              enthusiasts worldwide.
            </p>
          </div>
          <img
            src="/about3.jpg"
            alt="Future Works"
            className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </section>
        {/* admin */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Our Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Pritha Saha", role: "Admin1", image: "admin1.jpg" },
              { name: "Adiba Fairooz Chowdhury", role: "Admin2", image: "admin2.jpg" },
              { name: "Shadman Saleh", role: "Admin3", image: "admin3.jpg" },
            ].map((admin, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                <img
                  src={admin.image}
                  alt={admin.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-semibold">{admin.name}</h3>
                  <p className="text-sm">{admin.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* CTA Button */}
        {/* <div className="text-center">
          <Link to="/gallery" className="btn btn-primary mt-6">
            Explore Our Gallery
          </Link>
        </div> */}
      </div>
    </div>
  );
}
