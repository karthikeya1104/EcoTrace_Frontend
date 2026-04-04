import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";

export default function AdminReportsList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const verified = params.get("verified"); // optional filter

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skip = (page - 1) * limit;

    setLoading(true);
    api.get("/admin/reports", {
      params: {
        skip,
        limit,
        ...(verified !== "" && { verified }) 
      }
    })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [page, limit, verified]);

  function updateQuery(newParams) {
    const params = {
      page: newParams.page ?? page,
      limit,
    };

    if (newParams.verified !== undefined && newParams.verified !== "") {
      params.verified = newParams.verified;
    }

    setParams(params);
  }

  return (
    <DashboardLayout role="admin" title="Lab Reports">

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => updateQuery({ verified: "", page: 1 })}
          className="px-4 py-2 rounded-xl bg-gray-200"
        >
          All
        </button>

        <button
          onClick={() => updateQuery({ verified: "false", page: 1 })}
          className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700"
        >
          Pending
        </button>

        <button
          onClick={() => updateQuery({ verified: "true", page: 1 })}
          className="px-4 py-2 rounded-xl bg-green-100 text-green-700"
        >
          Verified
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Batch</th>
              <th className="p-4">Lab</th>
              <th className="p-4">Score</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">Loading...</td>
              </tr>
            )}

            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}

            {data.items.map(r => (
              <tr
                key={r.id}
                onClick={() => navigate(`/admin/reports/${r.id}`)}
                className="border-t hover:bg-green-50 cursor-pointer"
              >
                <td className="p-4 font-medium">
                  {r.batch?.batch_code || `#${r.batch_id}`}
                </td>
                <td className="p-4">{r.lab_id}</td>
                <td className="p-4">{r.lab_score}</td>
                <td className="p-4">
                  {r.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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