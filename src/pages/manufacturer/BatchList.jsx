import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";
import QRCode from "qrcode";

export default function BatchList() {
  const [params, setParams] = useSearchParams();

  // =========================
  // Query Params (Sanitized)
  // =========================
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.max(1, Number(params.get("limit")) || 10);
  const search = params.get("search") || "";

  // =========================
  // State
  // =========================
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  // Keep input synced with URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // =========================
  // Fetch Batches
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    async function fetchBatches() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/api/batches/my", {
          params: { page, limit, search },
          signal: controller.signal
        });

        setData(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load batches.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();

    return () => controller.abort();
  }, [page, limit, search]);

  // =========================
  // Update Query Params
  // =========================
  function updateQuery(newParams) {
    const updated = {
      page: newParams.page ?? page,
      limit,
      search: newParams.search ?? search
    };

    setParams(updated);
  }

  // =========================
  // QR Download
  // =========================
  const downloadQR = async (url, batchCode) => {
    if (!url) return;

    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 300 });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `batch-${batchCode}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError("Failed to generate QR code.");
    }
  };

  const isEmpty = !loading && data.items.length === 0;

  return (
    <DashboardLayout role="manufacturer" title="My Batches">

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          aria-label="Search batches"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              updateQuery({ search: searchInput, page: 1 });
            }
          }}
          placeholder="Search batch or product..."
          className="border rounded-xl px-4 py-2 w-full sm:flex-1"
        />

        <button
          type="button"
          onClick={() => updateQuery({ search: searchInput, page: 1 })}
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Search
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left min-w-[850px]">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4">Batch</th>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-center">QR</th>
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

            {isEmpty && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}

            {!loading && !isEmpty && data.items.map(b => (
              <tr
                key={b.id}
                className="border-t hover:bg-green-50"
              >
                <td className="p-4 font-medium text-green-800">
                  #{b.batch_code}
                </td>

                <td className="p-4">{b.product?.name || "-"}</td>

                <td className="p-4">{b.product?.brand || "-"}</td>

                <td className="p-4">
                  <StatusBadge status={b.status} />
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {b.created_at
                    ? new Date(b.created_at).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4 text-center space-x-2">
                  <a
                    href={b.qr_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadQR(b.qr_url, b.batch_code)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Download
                  </button>
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

        {isEmpty && (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            No results found.
          </div>
        )}

        {!loading && !isEmpty && data.items.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow p-4 space-y-2 hover:bg-green-50 transition"
          >
            <div className="font-semibold text-green-700">
              #{b.batch_code}
            </div>

            <div className="text-sm text-gray-600">
              {b.product?.name || "-"} — {b.product?.brand || "-"}
            </div>

            <div className="flex justify-between text-sm">
              <StatusBadge status={b.status} />
              <span className="text-gray-500">
                {b.created_at
                  ? new Date(b.created_at).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={b.qr_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center text-sm py-2 border rounded-lg"
              >
                View
              </a>

              <button
                type="button"
                onClick={() => downloadQR(b.qr_url, b.batch_code)}
                className="flex-1 text-sm py-2 bg-green-600 text-white rounded-lg"
              >
                Download
              </button>
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

function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const styles =
    normalized === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {normalized || "unknown"}
    </span>
  );
}