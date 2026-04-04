import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";

export default function MyReviews() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // =========================
  // Query Params
  // =========================
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.max(1, Number(params.get("limit")) || 10);

  // =========================
  // State
  // =========================
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Fetch Reviews
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);

        const skip = (page - 1) * limit;

        const res = await api.get("/api/reviews/me", {
          params: { skip, limit },
          signal: controller.signal
        });

        setData(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load reviews.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();

    return () => controller.abort();
  }, [page, limit]);

  function updateQuery(newParams) {
    setParams({
      page: newParams.page ?? page,
      limit
    });
  }

  const isEmpty = !loading && data.items.length === 0;

  return (
    <DashboardLayout role="consumer" title="My Reviews">

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Review</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {isEmpty && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}

            {!loading && !isEmpty && data.items.map(r => (
              <tr
                key={r.id}
                className="border-t hover:bg-green-50 cursor-pointer"
                onClick={() =>
                  navigate(`/consumer/batches/${r.batch_id}/reviews`)
                }
              >
                <td className="p-4 font-medium text-green-800">
                  #{r.id}
                </td>

                <td className="p-4">
                  #{r.batch_id}
                </td>

                <td className="p-4">
                  <RatingBadge rating={r.rating} />
                </td>

                <td className="p-4 text-gray-600">
                  {r.comment || "-"}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {loading && (
          <div className="bg-white p-6 rounded-xl text-center">
            Loading...
          </div>
        )}

        {isEmpty && (
          <div className="bg-white p-6 rounded-xl text-center text-gray-500">
            No reviews found
          </div>
        )}

        {!loading && !isEmpty && data.items.map(r => (
          <div
            key={r.id}
            onClick={() =>
              navigate(`/consumer/batches/${r.batch_id}/reviews`)
            }
            className="bg-white rounded-2xl shadow p-4 space-y-2 cursor-pointer hover:bg-green-50"
          >
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

/* Rating Badge */
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