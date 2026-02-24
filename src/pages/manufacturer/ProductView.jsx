import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  if (!product) return null;

  return (
    <DashboardLayout role="manufacturer" title="View Product Details">

      {/* Product Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-green-800">
          {product.name}
        </h2>
        <p className="text-gray-600 mt-1">
          {product.brand} • {product.category}
        </p>
        <p className="text-gray-500 mt-3 max-w-3xl">
          {product.description}
        </p>

        <Link
          to={`/manufacturer/batch/create/${product.id}`}
          className="inline-block mt-6 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          + Create New Batch
        </Link>
      </div>

      {/* Batch List */}
      <div>
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Product Batches
        </h3>

        {product.batches.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
            No batches created yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
          {product.batches.map(batch => (
            <Link
              key={batch.id}
              to={`/public/batch/${batch.id}`}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition border border-transparent hover:border-green-200"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-green-700">
                  {batch.batch_code}
                </h4>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Traceable
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Created on{" "}
                {new Date(batch.created_at).toLocaleDateString()}
              </p>

              <div className="mt-4 text-sm text-green-600 font-semibold">
                View Public Trace →
              </div>
            </Link>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
