import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Fetch Products
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("/api/products/my-products/all", {
          signal: controller.signal
        });

        if (!Array.isArray(res.data)) {
          throw new Error("Invalid products response.");
        }

        setProducts(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const isEmpty = !loading && products.length === 0;

  return (
    <DashboardLayout role="manufacturer" title="My Products">

      {/* Header */}
      <div className="mb-6 sm:mb-8 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800">
          My Products
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your products and create batches for tracking.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
          Loading products...
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
          No products found. Create your first product to get started.
        </div>
      )}

      {/* Products */}
      {!loading && !isEmpty && (
        <div className="grid gap-4 w-full max-w-4xl">

          {products.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow p-4 sm:p-6 
                         flex flex-col gap-4 
                         md:flex-row md:items-center md:justify-between"
            >
              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-700 break-words">
                  {p.name || "Unnamed Product"}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600">
                  {p.brand || "-"} • {p.category || "-"}
                </p>

                <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                  {p.description || "No description provided."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  to={`/manufacturer/batch/create/${p.id}`}
                  className="w-full sm:w-auto text-center px-4 py-2 
                             bg-green-600 text-white rounded-xl
                             hover:bg-green-700 transition"
                >
                  Create Batch
                </Link>

                <Link
                  to={`/manufacturer/products/${p.id}`}
                  className="w-full sm:w-auto text-center px-4 py-2 
                             border border-gray-300 rounded-xl
                             text-gray-600 hover:bg-gray-50 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}

        </div>
      )}

    </DashboardLayout>
  );
}