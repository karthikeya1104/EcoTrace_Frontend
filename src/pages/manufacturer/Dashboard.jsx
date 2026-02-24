import axios from "../../api/axios";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/products/my-products/stats")
      .then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <DashboardLayout role="manufacturer">
        <div className="flex items-center justify-center h-40">
          <div className="text-green-700 font-medium animate-pulse">
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="manufacturer" title="Stats">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800">
          Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your products and batches
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.total_products}
        />
        <StatCard
          title="Total Batches"
          value={stats.total_batches}
        />
      </div>

      {/* Products overview */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-4">
          Products Overview
        </h3>

        {/* Table wrapper for horizontal scroll */}
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm sm:text-base">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Total Batches</th>
                <th className="py-2 pr-4">Last Batch</th>
                <th className="py-2">Last Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-none text-sm sm:text-base"
                >
                  <td className="py-3 pr-4 font-medium">
                    {p.name}
                  </td>
                  <td className="py-3 pr-4">
                    {p.batch_count}
                  </td>
                  <td className="py-3 pr-4">
                    {p.last_batch_code || "-"}
                  </td>
                  <td className="py-3 text-gray-600">
                    {p.last_batch_created_at
                      ? new Date(
                          p.last_batch_created_at
                        ).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 sm:p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
        {value}
      </p>
    </div>
  );
}