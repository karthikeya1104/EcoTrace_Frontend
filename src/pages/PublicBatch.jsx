import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUser, isAuthenticated } from "../utils/useAuth";

export default function PublicBatch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = isAuthenticated() ? getUser() : null;
  const role = user?.role;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await api.get(`/api/batch/${id}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to fetch batch data");
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [id]);

  if (loading) return <CenterMsg text="Loading product verification..." />;
  if (error) return <CenterMsg text={error} error />;
  if (!data) return null;

  const lab = data.lab_reports?.[0] || null;
  const aiScore = data.ai_score?.rating;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HERO ================= */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">

            {/* LEFT SIDE */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.product.name}
              </h1>
              <p className="text-gray-500 text-lg">
                {data.product.brand} • {data.product.category}
              </p>

              <div className="mt-3 flex gap-3 flex-wrap">
                <StatusBadge status={data.batch.status} />
                {lab && <SafetyBadge status={lab.safety_status} />}
              </div>
            </div>

            {/* RIGHT SIDE SCORES */}
            <div className="flex items-center gap-10 flex-wrap">

              {/* LAB SCORE (PRIMARY) */}
              <ScoreCircle
                label="Lab Score"
                score={lab?.lab_score}
                scale="5"
              />

              {/* AI SCORE (SECONDARY) */}
              <ScoreCircle
                label="AI Score"
                score={aiScore}
                scale="100"
                small
              />

            </div>
          </div>

          {/* ACTIONS (INLINE, NO FLOATING) */}
          {role && (
            <div className="mt-6 flex gap-4 flex-wrap">
              <ActionButtons
                role={role}
                batchId={id}
                navigate={navigate}
              />
            </div>
          )}

        </div>

        {/* ================= TABS ================= */}

        <div className="bg-white rounded-3xl shadow-xl">

          <div className="flex border-b overflow-x-auto">
            {[
              { id: "overview", label: "Overview" },
              { id: "materials", label: "Ingredients" },
              { id: "lab", label: "Lab Report" },
              { id: "transport", label: "Transport" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 whitespace-nowrap font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <Overview data={data} />
            )}
            {activeTab === "materials" && (
              <Materials materials={data.materials} />
            )}
            {activeTab === "lab" && (
              <LabReport lab={lab} />
            )}
            {activeTab === "transport" && (
              <Transport transports={data.transports} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= SCORE COMPONENT ================= */

function ScoreCircle({ label, score, scale, small }) {
  if (score === undefined || score === null) return null;

  const max = scale === "5" ? 5 : 100;
  const percentage = (score / max) * 100;

  // Color logic
  let color = "#16a34a"; // green
  if (scale === "5") {
    if (score < 2) color = "#dc2626"; // red
    else if (score < 4) color = "#ca8a04"; // yellow
  }

  const size = small ? 90 : 130;
  const fontSize = small ? "text-xl" : "text-3xl";

  return (
    <div className="text-center">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}%)`
        }}
      >
        {/* Inner Circle */}
        <div
          className="absolute bg-white rounded-full flex items-center justify-center"
          style={{
            width: size - 18,
            height: size - 18
          }}
        >
          <span className={`font-bold ${fontSize}`}>
            {scale === "5" ? score.toFixed(1) : Math.round(score)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3">
        {label}
      </p>
    </div>
  );
}

/* ================= ACTION BUTTONS ================= */

function ActionButtons({ role, batchId, navigate }) {
  if (role === "transporter") {
    return (
      <button
        onClick={() =>
          navigate(`/transporter/create?batch=${batchId}`)
        }
        className="px-6 py-2 rounded-xl bg-blue-600 text-white"
      >
        Update Transport
      </button>
    );
  }

  if (role === "lab") {
    return (
      <button
        onClick={() =>
          navigate(`/lab/create-report/${batchId}`)
        }
        className="px-6 py-2 rounded-xl bg-purple-600 text-white"
      >
        Upload Lab Report
      </button>
    );
  }

  if (role === "consumer") {
    return (
      <button
        onClick={() =>
          navigate(`/consumer/rate/${batchId}`)
        }
        className="px-6 py-2 rounded-xl bg-green-600 text-white"
      >
        Give Rating
      </button>
    );
  }

  return null;
}

/* ================= BADGES ================= */

function StatusBadge({ status }) {
  const color =
    status === "approved"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-4 py-1 rounded-full text-sm font-medium ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}

function SafetyBadge({ status }) {
  const safe = status === "safe";
  return (
    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
      safe ? "bg-green-100 text-green-700"
           : "bg-red-100 text-red-700"
    }`}>
      {safe ? "SAFE ✔" : "RISK"}
    </span>
  );
}

/* ================= TAB CONTENT ================= */

function Overview({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Fact label="Manufactured"
        value={formatDate(data.batch.manufacture_date)} />
      <Fact label="Expiry"
        value={formatDate(data.batch.expiry_date)} />
      <Fact label="Location"
        value={data.batch.manufacturing_location} />
      <Fact label="Carbon Footprint"
        value={`${data.batch.base_carbon_footprint} kg CO₂ per product`} />
    </div>
  );
}

function Materials({ materials }) {
  if (!materials?.length)
    return <p className="text-gray-500">No materials listed.</p>;

  return (
    <div className="space-y-6">
      {materials.map(m => (
        <div key={m.material_id}
          className="bg-gray-50 p-5 rounded-xl">
          <div className="flex justify-between">
            <h3 className="font-semibold">{m.name}</h3>
            <span>{m.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded mt-2">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${m.percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Source: {m.source || "Not Provided"}
          </p>
        </div>
      ))}
    </div>
  );
}

function LabReport({ lab }) {
  if (!lab)
    return <p className="text-gray-500">No lab reports available.</p>;

  const toList = text =>
    text?.split("\n")
      .map(l => l.trim())
      .filter(Boolean);

  return (
    <div className="space-y-8">

      {lab.analysis?.map((a, i) => (
        <details key={i}
          className="bg-gray-50 p-5 rounded-xl">
          <summary className="font-medium cursor-pointer">
            {a.title}
          </summary>

          <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
            {toList(a.content).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </details>
      ))}

    </div>
  );
}

function Transport({ transports }) {
  if (!transports?.length)
    return <p className="text-gray-500">No transport records.</p>;

  return (
    <div className="space-y-6">
      {transports.map(t => (
        <div key={t.id}
          className="bg-gray-50 p-5 rounded-xl">
          <p className="font-semibold">
            {t.origin} → {t.destination}
          </p>
          <p className="text-sm text-gray-600">
            {t.distance_km} km • {t.vehicle_type} • {t.fuel_type}
          </p>
          <p className="text-sm text-gray-600">
            Emission: {t.transport_emission}
          </p>
        </div>
      ))}
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}

function CenterMsg({ text, error }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      error ? "text-red-600" : "text-gray-500"
    }`}>
      {text}
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}