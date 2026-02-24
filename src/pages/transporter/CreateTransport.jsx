import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import jsQR from "jsqr";
import { Html5Qrcode } from "html5-qrcode";

export default function CreateTransport() {
  const [search] = useSearchParams();
  const redirectBatch = search.get("batch");

  const qrRef = useRef(null);

  const [batchId, setBatchId] = useState(null);
  const [origins, setOrigins] = useState([]);
  const [manufacturedAt, setManufacturedAt] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [scanning, setScanning] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    destination: "",
    distance_km: "",
    fuel_type: "",
    vehicle_type: "",
    notes: ""
  };

  const [form, setForm] = useState(initialForm);

  /* ================= STOP SCANNER SAFELY ================= */

  const stopScanner = async () => {
    if (!qrRef.current) return;

    try {
      await qrRef.current.stop();
    } catch {}

    try {
      qrRef.current.clear();
    } catch {}

    qrRef.current = null;
    setScanning(false);
  };

  /* ================= LOAD BATCH ================= */

  const loadBatch = async (id) => {
    try {
      setError(null);
      setLoading(true);

      const res = await api.get(
        `/api/transports/batch/${id}/available-origins`
      );

      setBatchId(id);
      setOrigins(res.data.origins || []);
      setManufacturedAt(res.data.manufactured_at);
      setSelectedOrigin(res.data.origins?.[0] || "");

    } catch (e) {
      setError(e.response?.data?.detail || "Unable to load batch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (redirectBatch) loadBatch(redirectBatch);
  }, [redirectBatch]);

  /* ================= START SCANNER ================= */

  const startScanner = () => {
    if (qrRef.current) return;

    setError(null);
    setScanning(true);

    setTimeout(async () => {
      try {
        const qr = new Html5Qrcode("reader");
        qrRef.current = qr;

        await qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            await stopScanner();

            const match = decodedText.match(/batch\/(\d+)/);
            if (match) loadBatch(match[1]);
            else setError("Invalid QR code");
          }
        );
      } catch (err) {
        setError("Camera failed to start");
        setScanning(false);
      }
    }, 100);
  };

  /* ================= CLEANUP ON UNMOUNT ================= */

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(
          imageData.data,
          canvas.width,
          canvas.height
        );

        if (!code) {
          setError("QR not detected");
          return;
        }

        const match = code.data.match(/batch\/(\d+)/);
        if (!match) {
          setError("Invalid QR format");
          return;
        }

        loadBatch(match[1]);

      } catch (err) {
        setError("Failed to process image");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      setError("Invalid image file");
      URL.revokeObjectURL(objectUrl);
    };
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await api.post("/api/transports", {
        batch_id: Number(batchId),
        origin: selectedOrigin,
        ...form,
        distance_km: Number(form.distance_km)
      });

      setMessage("Transport recorded successfully!");

      setBatchId(null);
      setOrigins([]);
      setManufacturedAt(null);
      setForm(initialForm);

    } catch (e) {
      setError(e.response?.data?.detail || "Failed to create transport");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout title="Create Transport">
      <div className="max-w-2xl mx-auto space-y-6">

        {message && <SuccessBox text={message} />}
        {error && <ErrorBox text={error} />}

        {!batchId && (
          <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-green-800">
              Scan Batch QR
            </h2>

            {/* 🔁 TOGGLE BUTTON */}
            <button
              onClick={scanning ? stopScanner : startScanner}
              className={`px-6 py-2 text-white rounded-xl transition ${
                scanning
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {scanning ? "Stop Camera" : "Scan QR using Camera"}
            </button>

            {scanning && <div id="reader" className="mt-4" />}

            <div className="text-gray-400">or</div>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
          </div>
        )}

        {batchId && (
          <form
            onSubmit={submit}
            className="bg-white rounded-2xl shadow p-6 space-y-4"
          >
            {manufacturedAt && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700">Manufactured at</p>
                <p className="text-lg font-semibold text-blue-900">
                  {manufacturedAt}
                </p>
              </div>
            )}

            <Select
              label="Origin Location"
              options={origins}
              value={selectedOrigin}
              onChange={setSelectedOrigin}
            />

            <Input label="Destination" name="destination" form={form} setForm={setForm} />
            <Input label="Distance (km)" name="distance_km" type="number" form={form} setForm={setForm} />
            <Input label="Fuel Type" name="fuel_type" form={form} setForm={setForm} />
            <Input label="Vehicle Type" name="vehicle_type" form={form} setForm={setForm} />
            <Input label="Notes" name="notes" form={form} setForm={setForm} />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              {loading ? "Saving..." : "Create Transport"}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ================= UI COMPONENTS ================= */

const Input = ({ label, name, form, setForm, type = "text" }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      value={form[name]}
      onChange={e =>
        setForm({ ...form, [name]: e.target.value })
      }
      className="w-full border rounded-xl px-4 py-2"
      required
    />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded-xl px-4 py-2"
    >
      {options.map(o => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const ErrorBox = ({ text }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
    {text}
  </div>
);

const SuccessBox = ({ text }) => (
  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
    {text}
  </div>
);