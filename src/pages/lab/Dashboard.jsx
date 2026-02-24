import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function LabDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/lab-reports/my/stats")
      .then(res => {
        setStats(res.data);
        setRecent(res.data.recent_reports);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <DashboardLayout title="Lab Dashboard">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Lab Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tested" value={stats.total_batches_tested} />
        <StatCard title="Unique Products" value={stats.unique_products_tested} />
        <StatCard title="Verified Reports" value={stats.verified_reports} />
        <StatCard title="Pending Reports" value={stats.pending_reports} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-green-800">
          Recent Reports
        </h2>

        <Link
          to="/lab/pending-tests"
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          View Pending Tests
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Report ID</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Score</th>
              <th className="p-4">Eco Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No reports yet
                </td>
              </tr>
            )}

            {recent.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-4 font-medium">#{r.id}</td>
                <td className="p-4">#{r.batch_id}</td>
                <td className="p-4">{r.lab_score}</td>
                <td className="p-4">{r.eco_rating}</td>
                <td className="p-4">
                  <StatusBadge verified={r.verified} />
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {recent.map(r => (
          <div key={r.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
            <div className="font-semibold text-green-700">
              Report #{r.id}
            </div>

            <div className="text-sm text-gray-600">
              Batch #{r.batch_id}
            </div>

            <div className="flex justify-between text-sm">
              <span>Score: {r.lab_score}</span>
              <span>Eco: {r.eco_rating}</span>
            </div>

            <StatusBadge verified={r.verified} />

            <div className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-green-700 mt-2">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ verified }) {
  return verified ? (
    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
      Verified
    </span>
  ) : (
    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
      Pending
    </span>
  );
}