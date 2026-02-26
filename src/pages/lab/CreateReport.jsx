import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateReport() {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    test_summary: "",
    certifications: "",
    eco_rating: "",
    lab_score: ""
  });

  const [error, setError] = useState("");

  // ✅ Fetch batch info (FIXED HERE)
  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await api.get(`/api/batch/${batchId}`);
        const data = res.data;

        // 🔥 Normalize backend response
        setBatch({
          batch_code: data.batch.code,
          manufacturing_location: data.batch.location,
          expiry_date: data.batch.expiry,
          product: data.product
        });
      } catch (err) {
        setError("Failed to load batch details");
      } finally {
        setLoading(false);
      }
    }

    fetchBatch();
  }, [batchId]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post(`/api/lab-reports/batch/${batchId}`, {
        test_summary: form.test_summary,
        certifications: form.certifications,
        eco_rating: Number(form.eco_rating),
        lab_score: Number(form.lab_score)
      });

      navigate("/lab/reports");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to create report"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Create Report">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout title="Create Report">
        <div className="p-6 text-red-600">Batch not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Lab Report">

      {/* Batch Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-800 mb-3">
          Batch Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Batch Code</p>
            <p className="font-medium">{batch.batch_code}</p>
          </div>

          <div>
            <p className="text-gray-500">Product</p>
            <p className="font-medium">{batch.product?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Manufacturing Location</p>
            <p>{batch.manufacturing_location}</p>
          </div>

          <div>
            <p className="text-gray-500">Expiry Date</p>
            <p>
              {batch.expiry_date &&
                new Date(batch.expiry_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Report Details
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Test Summary */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Test Summary
            </label>
            <textarea
              name="test_summary"
              value={form.test_summary}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Certifications
            </label>
            <input
              type="text"
              name="certifications"
              value={form.certifications}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Eco Rating */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Eco Rating (1-5)
            </label>
            <select
              name="eco_rating"
              value={form.eco_rating}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2"
            >
              <option value="">Select rating</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Lab Score */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Lab Score (0-100)
            </label>
            <input
              type="number"
              name="lab_score"
              value={form.lab_score}
              onChange={handleChange}
              min="0"
              max="100"
              required
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>

        </form>
      </div>

    </DashboardLayout>
  );
}