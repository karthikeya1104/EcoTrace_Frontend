import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import QRCode from "qrcode";

export default function CreateBatch() {
  const { productId } = useParams();

  const [form, setForm] = useState({
    batch_code: "",
    manufacture_date: "",
    expiry_date: "",
    manufacturing_location: "",
    base_carbon_footprint: "",
    material: [{ name: "", percentage: "", source: "" }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // =========================
  // Basic Input Change
  // =========================
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // =========================
  // Material Handlers
  // =========================
  const addMaterial = () => {
    setForm(prev => ({
      ...prev,
      material: [
        ...prev.material,
        { name: "", percentage: "", source: "" }
      ]
    }));
  };

  const updateMaterial = (index, field, value) => {
    const updated = [...form.material];
    updated[index][field] = value;

    setForm(prev => ({
      ...prev,
      material: updated
    }));
  };

  const removeMaterial = (index) => {
    const updated = form.material.filter((_, i) => i !== index);
    setForm(prev => ({
      ...prev,
      material: updated
    }));
  };

  // =========================
  // Validation
  // =========================
  function validate() {
    if (!form.batch_code.trim()) return "Batch code is required.";
    if (!form.manufacture_date) return "Manufacture date is required.";
    if (!form.expiry_date) return "Expiry date is required.";

    if (new Date(form.expiry_date) <= new Date(form.manufacture_date))
      return "Expiry date must be after manufacture date.";

    const carbon = Number(form.base_carbon_footprint);
    if (isNaN(carbon) || carbon < 0)
      return "Base carbon footprint must be a positive number.";

    for (let mat of form.material) {
      if (!mat.name.trim()) return "Material name is required.";
      if (Number(mat.percentage) < 0 || Number(mat.percentage) > 100)
        return "Material percentage must be between 0 and 100.";
    }

    return null;
  }

  // =========================
  // Submit
  // =========================
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        batch_code: form.batch_code,
        manufacture_date: new Date(form.manufacture_date).toISOString(),
        expiry_date: new Date(form.expiry_date).toISOString(),
        manufacturing_location: form.manufacturing_location,
        base_carbon_footprint: Number(form.base_carbon_footprint),
        material: form.material.map(m => ({
          name: m.name,
          percentage: Number(m.percentage),
          source: m.source
        }))
      };

      const res = await axios.post(`/api/batches/${productId}`, payload);

      if (!res.data?.qr_url)
        throw new Error("QR URL missing from response.");

      setQrUrl(res.data.qr_url);

    } catch (err) {
      console.error(err);
      setError("Failed to create batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Generate QR
  // =========================
  useEffect(() => {
    if (!qrUrl) return;

    async function generateQR() {
      try {
        setQrLoading(true);
        const url = await QRCode.toDataURL(qrUrl, { width: 300 });
        setQrImage(url);
      } catch {
        setError("Failed to generate QR image.");
      } finally {
        setQrLoading(false);
      }
    }

    generateQR();
  }, [qrUrl]);

  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `${form.batch_code}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout role="manufacturer" title="Create Batch">
      <div className="min-h-[calc(100vh-120px)] flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-3xl py-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
              Create Batch
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Add batch-level manufacturing and sustainability details.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {!qrUrl && (
            <div className="bg-white rounded-2xl shadow p-5 sm:p-8">
              <form onSubmit={submit} className="space-y-6">

                <Input
                  label="Batch Code"
                  name="batch_code"
                  value={form.batch_code}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Manufacture Date"
                    name="manufacture_date"
                    type="datetime-local"
                    value={form.manufacture_date}
                    onChange={handleChange}
                  />
                  <Input
                    label="Expiry Date"
                    name="expiry_date"
                    type="datetime-local"
                    value={form.expiry_date}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Manufacturing Location"
                  name="manufacturing_location"
                  value={form.manufacturing_location}
                  onChange={handleChange}
                />

                <Input
                  label="Base Carbon Footprint (kg CO₂)"
                  name="base_carbon_footprint"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.base_carbon_footprint}
                  onChange={handleChange}
                />

                {/* MATERIALS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Materials
                  </label>

                  <div className="space-y-4">
                    {form.material.map((mat, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-4 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

                          <div className="lg:col-span-4">
                            <Input
                              label="Name"
                              value={mat.name}
                              onChange={(e) =>
                                updateMaterial(index, "name", e.target.value)
                              }
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <Input
                              label="Percentage (%)"
                              type="number"
                              min="0"
                              max="100"
                              value={mat.percentage}
                              onChange={(e) =>
                                updateMaterial(index, "percentage", e.target.value)
                              }
                            />
                          </div>

                          <div className="lg:col-span-4">
                            <Input
                              label="Source"
                              value={mat.source}
                              onChange={(e) =>
                                updateMaterial(index, "source", e.target.value)
                              }
                            />
                          </div>

                          <div className="lg:col-span-1 flex items-end justify-end">
                            {form.material.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMaterial(index)}
                                className="text-red-500 text-sm hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addMaterial}
                    className="mt-4 w-full sm:w-auto text-sm text-green-600 hover:text-green-700"
                  >
                    + Add Material
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full sm:w-auto
                      px-8 py-3
                      bg-green-600 text-white
                      rounded-xl
                      hover:bg-green-700
                      transition
                      disabled:opacity-60
                    "
                  >
                    {loading ? "Creating..." : "Create Batch"}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* QR RESULT */}
          {qrUrl && (
            <div className="bg-white rounded-2xl shadow p-6 text-center">

              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Batch Created Successfully 🌱
              </h3>

              {qrLoading && <div className="text-gray-500">Generating QR...</div>}

              {qrImage && (
                <img
                  src={qrImage}
                  alt="Batch QR Code"
                  className="mx-auto my-4 rounded-xl w-48 sm:w-64"
                />
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={downloadQR}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Download QR
                </button>

                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  Open Link
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

/* Reusable Input */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="
          w-full px-4 py-2
          rounded-xl border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-green-500
          text-sm
        "
      />
    </div>
  );
}