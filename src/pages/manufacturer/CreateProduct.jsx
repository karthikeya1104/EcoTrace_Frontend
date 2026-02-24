import axios from "../../api/axios";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setLoading(true);
      await axios.post("/api/products", form);
      navigate("/manufacturer/dashboard");
    } catch {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="manufacturer" title="Create Product">
      {/* Centered container */}
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-green-800">
              Create New Product
            </h2>
            <p className="text-gray-600 mt-1">
              Register a product to begin batch tracking and sustainability scoring.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <form onSubmit={submit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Organic Cotton T-Shirt"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. EcoWear"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Apparel"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Short description of the product and its sustainability aspects..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-green-600 text-white rounded-xl
                             hover:bg-green-700 transition disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-2 border border-gray-300 rounded-xl
                             text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
