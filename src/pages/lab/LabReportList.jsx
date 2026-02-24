import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";

export default function LabReportList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // Query params
  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || "";
  const verified = params.get("verified") || "";

  // State
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);

    api.get("/api/lab-reports/my", {
      params: {
        page,
        limit,
        search: search || undefined,
        verified: verified || undefined
      }
    })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));

  }, [page, limit, search, verified]);

  function updateQuery(newParams) {
    setParams({
      page,
      limit,
      search,
      verified,
      ...newParams
    });
  }

  return (
    <DashboardLayout title="My Lab Reports">

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">

        {/* Search */}
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter")
              updateQuery({ search: searchInput, page: 1 });
          }}
          placeholder="Search by report ID, batch ID, summary..."
          className="border rounded-xl px-4 py-2 w-full lg:flex-1"
        />

        <button
          onClick={() => updateQuery({ search: searchInput, page: 1 })}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Search
        </button>

        {/* Status Filter */}
        <select
          value={verified}
          onChange={(e) =>
            updateQuery({ verified: e.target.value, page: 1 })
          }
          className="border rounded-xl px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Report ID</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Score</th>
              <th className="p-4">Eco Rating</th>
              <th className="p-4">Certifications</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}

            {data.items.map(r => (
              <tr
                key={r.id}
                onClick={() => navigate(`/lab/reports/${r.id}`)}
                className="border-t hover:bg-green-50 cursor-pointer transition"
              >
                <td className="p-4 font-medium">#{r.id}</td>
                <td className="p-4">
                    <div className="font-medium text-green-700">
                        {r.batch?.batch_code}
                    </div>
                    <div className="text-xs text-gray-500">
                        {r.batch?.manufacturing_location}
                    </div>
                </td>
                <td className="p-4">{r.lab_score}</td>
                <td className="p-4">{r.eco_rating}</td>
                <td className="p-4 text-sm">
                  {r.certifications || "—"}
                </td>
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            Loading...
          </div>
        )}

        {!loading && data.items.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            No reports found
          </div>
        )}

        {data.items.map(r => (
          <div
            key={r.id}
            onClick={() => navigate(`/lab/reports/${r.id}`)}
            className="bg-white rounded-2xl shadow p-4 space-y-2 cursor-pointer hover:bg-blue-50 transition"
          >
            <div className="font-semibold text-green-700">
              Report #{r.id}
            </div>

            <div className="text-sm text-gray-600">
                Batch {r.batch?.batch_code}
            </div>

            <div className="text-xs text-gray-500">
                {r.batch?.manufacturing_location}
            </div>

            <div className="flex justify-between text-sm">
              <span>Score: {r.lab_score}</span>
              <span>Eco: {r.eco_rating}</span>
            </div>

            <div className="text-sm">
              {r.certifications || "No certifications"}
            </div>

            <StatusBadge verified={r.verified} />

            <div className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          total={data.total}
          page={page}
          limit={limit}
          onChange={(p) => updateQuery({ page: p })}
        />
      </div>

    </DashboardLayout>
  );
}

/* ---------- Status Badge ---------- */

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