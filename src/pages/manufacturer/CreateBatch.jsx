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
    material_info: "",
    manufacturing_location: "",
    base_carbon_footprint: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // =========================
  // Form Handling
  // =========================
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // =========================
  // Validation
  // =========================
  function validate() {
    if (!form.batch_code.trim()) {
      return "Batch code is required.";
    }

    if (!form.manufacture_date) {
      return "Manufacture date is required.";
    }

    if (!form.expiry_date) {
      return "Expiry date is required.";
    }

    if (new Date(form.expiry_date) <= new Date(form.manufacture_date)) {
      return "Expiry date must be after manufacture date.";
    }

    const carbon = Number(form.base_carbon_footprint);

    if (isNaN(carbon) || carbon < 0) {
      return "Base carbon footprint must be a positive number.";
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

      const res = await axios.post(`/api/batches/${productId}`, {
        ...form,
        base_carbon_footprint: Number(form.base_carbon_footprint),
      });

      if (!res.data?.qr_url) {
        throw new Error("QR URL missing from response.");
      }

      setQrUrl(res.data.qr_url);

    } catch (err) {
      console.error(err);
      setError("Failed to create batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Generate QR Image
  // =========================
  useEffect(() => {
    if (!qrUrl) return;

    async function generateQR() {
      try {
        setQrLoading(true);
        const url = await QRCode.toDataURL(qrUrl, { width: 300 });
        setQrImage(url);
      } catch (err) {
        console.error(err);
        setError("Failed to generate QR image.");
      } finally {
        setQrLoading(false);
      }
    }

    generateQR();
  }, [qrUrl]);

  // =========================
  // Download QR
  // =========================
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
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-green-800">
              Create Batch
            </h2>
            <p className="text-gray-600 mt-1">
              Add batch-level manufacturing and sustainability details.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {/* FORM */}
          {!qrUrl && (
            <div className="bg-white rounded-2xl shadow p-6">
              <form onSubmit={submit} className="space-y-5">

                <Input
                  label="Batch Code"
                  name="batch_code"
                  value={form.batch_code}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Manufacture Date"
                    name="manufacture_date"
                    type="datetime-local"
                    value={form.manufacture_date}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Expiry Date"
                    name="expiry_date"
                    type="datetime-local"
                    value={form.expiry_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Textarea
                  label="Material Information"
                  name="material_info"
                  value={form.material_info}
                  onChange={handleChange}
                />

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
                  required
                />

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-60"
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

              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Batch Created Successfully 🌱
              </h3>

              {qrLoading && (
                <div className="text-gray-500">Generating QR...</div>
              )}

              {qrImage && (
                <img
                  src={qrImage}
                  alt="Batch QR Code"
                  className="mx-auto my-4 rounded-xl"
                />
              )}

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p><b>Batch Code:</b> {form.batch_code}</p>
                <p><b>Manufactured At:</b> {form.manufacture_date}</p>
                <p><b>Location:</b> {form.manufacturing_location || "-"}</p>
                <p><b>Base CO₂:</b> {form.base_carbon_footprint} kg</p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadQR}
                  disabled={!qrImage}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-60"
                >
                  Download QR
                </button>

                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
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

/* Reusable Inputs */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2 rounded-xl border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-4 py-2 rounded-xl border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
      />
    </div>
  );
}