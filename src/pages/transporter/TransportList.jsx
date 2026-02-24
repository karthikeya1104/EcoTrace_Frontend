import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";

export default function TransportList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || "";

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const skip = (page - 1) * limit;

    setLoading(true);
    api.get("/api/transports/my", {
      params: { skip, limit, search }
    })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [page, limit, search]);

  function updateQuery(newParams) {
    setParams({
      page: newParams.page ?? page,
      limit,
      search: newParams.search ?? searchInput
    });
  }

  return (
    <DashboardLayout title="My Transports">

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter")
              updateQuery({ search: searchInput, page: 1 });
          }}
          placeholder="Search batch, origin, destination..."
          className="border rounded-xl px-4 py-2 w-full sm:flex-1"
        />

        <button
          onClick={() => updateQuery({ search: searchInput, page: 1 })}
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Search
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[750px]">
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
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.items.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No results
                </td>
              </tr>
            )}

            {data.items.map(t => (
              <tr
                key={t.id}
                onClick={() =>
                  navigate(`/transporter/transports/${t.id}`)
                }
                className="border-t hover:bg-green-50 cursor-pointer"
              >
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
        {loading && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            Loading...
          </div>
        )}

        {!loading && data.items.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            No results
          </div>
        )}

        {data.items.map(t => (
          <div
            key={t.id}
            onClick={() =>
              navigate(`/transporter/transports/${t.id}`)
            }
            className="bg-white rounded-2xl shadow p-4 space-y-2 cursor-pointer hover:bg-green-50 transition"
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