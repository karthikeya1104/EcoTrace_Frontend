import axios from "../../api/axios";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-40">
          <div className="text-green-700 animate-pulse">
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800">
          System Overview
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Real-time platform insights
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Users" value={stats.users.total} />
        <StatCard title="Products" value={stats.products.total} />
        <StatCard title="Batches" value={stats.batches.total} />
        <StatCard title="Reports" value={stats.lab_reports.total} />
      </div>

      {/* Activity */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard title="Batches Today" value={stats.batches.today} />
        <StatCard title="Reports Today" value={stats.lab_reports.today} />
      </div>

      {/* Role Breakdown */}
      <Section title="Users by Role">
        {Object.entries(stats.users.by_role).map(([role, count]) => (
          <Row key={role} label={role} value={count} />
        ))}
      </Section>

      {/* Batch Status */}
      <Section title="Batch Status">
        {Object.entries(stats.batches.status).map(([status, count]) => (
          <Row key={status} label={status} value={count} />
        ))}
      </Section>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-4">
          Top Products
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Product</th>
              <th className="py-2">Batches</th>
            </tr>
          </thead>
          <tbody>
            {stats.products.top_products.map((p) => (
              <tr key={p.id} className="border-b last:border-none">
                <td className="py-3">{p.name}</td>
                <td>{p.batch_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-green-700 mt-2">
        {value}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-green-700 mb-4">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="capitalize text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}