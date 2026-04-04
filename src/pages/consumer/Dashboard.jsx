import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ConsumerDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/reviews/dashboard")
      .then((res) => {
        setStats(res.data);
        setRecent(res.data.recent_reviews || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <DashboardLayout title="My Dashboard">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="My Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Reviews" value={stats?.total_reviews || 0} />
        <StatCard title="5 ⭐ Ratings" value={stats?.ratings?.["5"] || 0} />
        <StatCard title="4 ⭐ Ratings" value={stats?.ratings?.["4"] || 0} />
        <StatCard title="3 ⭐ Ratings" value={stats?.ratings?.["3"] || 0} />
      </div>

      {/* Extra row for remaining ratings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
        <StatCard title="2 ⭐ Ratings" value={stats?.ratings?.["2"] || 0} />
        <StatCard title="1 ⭐ Ratings" value={stats?.ratings?.["1"] || 0} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-green-800">
          Recent Reviews
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Review ID</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No reviews yet
                </td>
              </tr>
            )}

            {recent.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-4 font-medium">#{r.id}</td>

                <td className="p-4">#{r.batch_id}</td>

                <td className="p-4">
                  <RatingBadge rating={r.rating} />
                </td>

                <td className="p-4 text-gray-600">
                  {r.comment || "-"}
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
        {recent.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No reviews yet
          </div>
        )}

        {recent.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
            <div className="font-semibold text-green-700">
              Review #{r.id}
            </div>

            <div className="text-sm text-gray-600">
              Batch #{r.batch_id}
            </div>

            <RatingBadge rating={r.rating} />

            <div className="text-sm text-gray-600">
              {r.comment || "No comment"}
            </div>

            <div className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}

/* Components */

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

function RatingBadge({ rating }) {
  const colors = {
    5: "bg-green-100 text-green-700",
    4: "bg-green-100 text-green-700",
    3: "bg-yellow-100 text-yellow-700",
    2: "bg-orange-100 text-orange-700",
    1: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${colors[rating]}`}>
      {rating} ⭐
    </span>
  );
}