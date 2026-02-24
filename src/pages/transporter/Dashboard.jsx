import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TransporterDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/transports/my/stats"),
      api.get("/api/transports/my?limit=5")
    ])
      .then(([statsRes, recentRes]) => {
        setStats(statsRes.data);
        setRecent(recentRes.data.items);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <DashboardLayout title="Dashboard">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Transporter Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Transports" value={stats.total_transports} />
        <StatCard title="Total Distance" value={`${stats.total_distance} km`} />
        <StatCard title="Total Emission" value={`${stats.total_emission} kg`} />
        <StatCard title="Avg / km" value={stats.avg_emission_per_km} />
      </div>

      {/* Quick Action */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-800">
          Recent Movements
        </h2>

        <Link
          to="/transporter/create"
          className="w-full sm:w-auto text-center px-4 py-2 
                     bg-green-600 text-white rounded-xl 
                     hover:bg-green-700 transition"
        >
          + New Transport
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Batch</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Distance</th>
              <th className="p-4">Emission</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No transports yet
                </td>
              </tr>
            )}

            {recent.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-4 font-medium">
                  {t.batch?.batch_code || `#${t.batch_id}`}
                </td>
                <td className="p-4">{t.origin}</td>
                <td className="p-4">{t.destination}</td>
                <td className="p-4">{t.distance_km} km</td>
                <td className="p-4">{t.transport_emission} kg</td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {recent.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            No transports yet
          </div>
        )}

        {recent.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-2xl shadow p-4 space-y-2"
          >
            <div className="font-semibold text-green-700">
              {t.batch?.batch_code || `#${t.batch_id}`}
            </div>

            <div className="text-sm text-gray-600">
              {t.origin} → {t.destination}
            </div>

            <div className="flex justify-between text-sm">
              <span>{t.distance_km} km</span>
              <span>{t.transport_emission} kg</span>
            </div>

            <div className="text-xs text-gray-500">
              {new Date(t.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
        {value}
      </p>
    </div>
  );
}