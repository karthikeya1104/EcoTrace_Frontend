import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";

export default function PendingTests() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || "";

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);

    api.get("/api/labs/pending-tests", {
      params: { page, limit, search: search || undefined }
    })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));

  }, [page, limit, search]);

  function updateQuery(newParams) {
    setParams({
      page,
      limit,
      search,
      ...newParams
    });
  }

  return (
    <DashboardLayout title="Pending Lab Tests">

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter")
              updateQuery({ search: searchInput, page: 1 });
          }}
          placeholder="Search by batch code, product, location..."
          className="border rounded-xl px-4 py-2 w-full lg:flex-1"
        />

        <button
          onClick={() => updateQuery({ search: searchInput, page: 1 })}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Search
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Batch Code</th>
              <th className="p-4">Product</th>
              <th className="p-4">Location</th>
              <th className="p-4">Manufacture Date</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Action</th>
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
                  No pending tests
                </td>
              </tr>
            )}

            {data.items.map(batch => (
              <tr key={batch.id} className="border-t">
                <td className="p-4 font-medium text-green-700">
                  {batch.batch_code}
                </td>

                <td className="p-4">
                  {batch.product?.name}
                </td>

                <td className="p-4">
                  {batch.manufacturing_location}
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {new Date(batch.manufacture_date).toLocaleDateString()}
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {new Date(batch.expiry_date).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => navigate(`/lab/create-report/${batch.id}`)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Create Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.items.map(batch => (
          <div key={batch.id} className="bg-white rounded-2xl shadow p-4 space-y-2">

            <div className="font-semibold text-green-700">
              {batch.batch_code}
            </div>

            <div className="text-sm text-gray-600">
              {batch.product?.name}
            </div>

            <div className="text-sm text-gray-500">
              {batch.manufacturing_location}
            </div>

            <button
              onClick={() => navigate(`/lab/create-report/${batch.id}`)}
              className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Report
            </button>

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