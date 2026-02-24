import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">

      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-8 py-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center sm:text-left">
          EcoTrace 🌱
        </h1>

        <div className="flex justify-center sm:justify-end gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 font-semibold hover:underline text-sm sm:text-base"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 sm:px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 sm:px-6 mt-12 sm:mt-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 max-w-3xl leading-tight">
          Transparent Sustainability Tracking Across the Supply Chain
        </h2>

        <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl">
          EcoTrace enables consumers, manufacturers, labs, and transporters
          to track environmental impact, certifications, and carbon footprint
          through a single QR code.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 border border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-16 sm:mt-24 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Feature
          title="QR-Based Transparency"
          desc="Scan once to view product origin, batch details, lab reports, and sustainability score."
        />
        <Feature
          title="Role-Based Access"
          desc="Manufacturers, labs, and transporters update data securely while consumers view verified info."
        />
        <Feature
          title="AI Sustainability Score"
          desc="AI-powered analysis evaluates environmental impact and provides insights."
        />
      </section>

      {/* Footer */}
      <footer className="mt-auto text-center text-sm text-gray-500 py-6 px-4">
        © {new Date().getFullYear()} EcoTrace. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 text-center">
      <h3 className="text-lg sm:text-xl font-semibold text-green-700">
        {title}
      </h3>
      <p className="mt-3 text-gray-600 text-sm sm:text-base">
        {desc}
      </p>
    </div>
  );
}