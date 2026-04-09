import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateReport() {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  //  Dynamic Analysis Sections
  const [analysisSections, setAnalysisSections] = useState([
    { title: "", content: "" }
  ]);

  const [form, setForm] = useState({
    certifications: "",
    notes: "",
    safety_status: "",
    lab_score: ""
  });

  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await api.get(`/api/batch/${batchId}`);
        setBatchData(res.data);
      } catch {
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

  function handleSectionChange(index, field, value) {
    const updated = [...analysisSections];
    updated[index][field] = value;
    setAnalysisSections(updated);
  }

  function addSection() {
    setAnalysisSections([...analysisSections, { title: "", content: "" }]);
  }

  function removeSection(index) {
    const updated = analysisSections.filter((_, i) => i !== index);
    setAnalysisSections(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post(`/api/lab-reports/batch/${batchId}`, {
        analysis_data: analysisSections,
        certifications: form.certifications,
        notes: form.notes,
        safety_status: form.safety_status,
        lab_score: Number(form.lab_score)
      });

      navigate("/lab/reports");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Create Lab Report">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!batchData) {
    return (
      <DashboardLayout title="Create Lab Report">
        <div className="p-6 text-red-600">Batch not found</div>
      </DashboardLayout>
    );
  }

  const { batch, product, materials } = batchData;

  return (
    <DashboardLayout title="Create Lab Report">

      {/* ===== Batch Overview ===== */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Batch Overview
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <Info label="Product" value={product.name} />
          <Info label="Brand" value={product.brand} />
          <Info label="Batch Code" value={batch.code} />
          <Info label="Location" value={batch.manufacturing_location} />
          <Info label="Expiry"
                value={new Date(batch.expiry_date).toLocaleDateString()} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {materials.map(m => (
            <span
              key={m.material_id}
              className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full"
            >
              {m.name} ({m.percentage}%)
            </span>
          ))}
        </div>
      </div>

      {/* ===== Report Form ===== */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-lg font-semibold text-green-800 mb-6">
          Lab Report Details
        </h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/*  Dynamic Sections */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Analysis Sections
            </h3>

            {analysisSections.map((section, index) => (
              <div key={index} className="border rounded-xl p-4 mb-4 bg-gray-50">

                <input
                  type="text"
                  placeholder="Section Title (e.g. Microbiological Analysis)"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionChange(index, "title", e.target.value)
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 mb-3"
                />

                <textarea
                  rows={4}
                  placeholder="Enter detailed analysis..."
                  value={section.content}
                  onChange={(e) =>
                    handleSectionChange(index, "content", e.target.value)
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />

                {analysisSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Remove Section
                  </button>
                )}

              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="text-green-600 text-sm"
            >
              + Add Section
            </button>
          </div>

          {/* Certifications */}
          <FormInput
            label="Certifications"
            name="certifications"
            value={form.certifications}
            onChange={handleChange}
          />

          {/* Notes */}
          <FormTextarea
            label="Additional Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />

          {/* Safety Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Safety Status
            </label>
            <select
              name="safety_status"
              value={form.safety_status}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2"
            >
              <option value="">Select status</option>
              <option value="safe">Safe</option>
              <option value="caution">Caution</option>
              <option value="unsafe">Unsafe</option>
            </select>
          </div>

          {/* Lab Score */}
          <FormInput
            label="Lab Score (0 - 5)"
            name="lab_score"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.lab_score}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>

        </form>
      </div>

    </DashboardLayout>
  );
}

/* Reusable Components */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input {...props} className="w-full border rounded-xl px-4 py-2" />
    </div>
  );
}

function FormTextarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <textarea {...props} rows={4} className="w-full border rounded-xl px-4 py-2" />
    </div>
  );
}