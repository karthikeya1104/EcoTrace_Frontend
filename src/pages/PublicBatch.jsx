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

  /* ---------- FETCH ---------- */
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

  const score = data.ai_score?.final ?? null;
  const statusColor =
    data.batch.status === "approved"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* TRUST SUMMARY CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">
            {data.product.name}
          </h1>
          <p className="text-gray-500">{data.product.brand}</p>

          <div className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {data.batch.status.toUpperCase()}
          </div>

          {/* SCORE */}
          <div className="mt-6">
            {score ? (
              <>
                <p className="text-6xl font-bold text-green-800">{score}</p>
                <p className="text-gray-500">Sustainability Score</p>
              </>
            ) : (
              <p className="text-gray-400 mt-4">Score not generated yet</p>
            )}
          </div>
        </div>

        {/* ROLE ACTIONS */}
        {role && (
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Actions Available
              </h3>
              <p className="text-gray-500 text-sm">
                Logged in as <span className="font-medium capitalize">{role}</span>
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">

              {role === "transporter" && (
                <button
                  onClick={() => navigate(`/transporter/create?batch=${id}`)}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Update Transport
                </button>
              )}

              {role === "lab" && (
                <button
                  onClick={() => navigate(`/lab/create-report/${id}`)}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                >
                  Upload Lab Report
                </button>
              )}

              {role === "consumer" && (
                <button
                  onClick={() => navigate(`/consumer/rate/${id}`)}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Give Rating
                </button>
              )}

            </div>
          </div>
        )}

        {/* INGREDIENTS */}
        <Section title="Ingredients / Materials">
          {data.batch.material_info ? (
            <div className="flex flex-wrap gap-2">
              {data.batch.material_info.split(",").map((m, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200"
                >
                  {formatMaterial(m)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No material information provided</p>
          )}
        </Section>

        {/* QUICK FACTS */}
        <div className="grid md:grid-cols-2 gap-4">
          <Fact label="Manufactured" value={formatDate(data.batch.manufactured)} />
          <Fact label="Expiry" value={formatDate(data.batch.expiry)} />
          <Fact label="Manufactured Location" value={data.batch.location} />
          <Fact label="Carbon Footprint" value={`${data.batch.base_carbon} kg CO₂`} />
        </div>

        {/* LAB REPORTS */}
        <Section title="Lab Verification">
          {data.lab_reports?.length ? (
            data.lab_reports.map((r, i) => (
              <div key={i} className="py-3 border-b last:border-0">
                <p className="font-medium">{r.summary}</p>
                <p className="text-sm text-gray-500">
                  Eco Rating: {r.eco_rating} • {r.verified ? "Verified ✔" : "Unverified"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No lab verification uploaded</p>
          )}
        </Section>

        {/* TRANSPORT */}
        <Section title="Transport History">
          {data.transport?.length ? (
            data.transport.map((t, i) => (
              <div key={i} className="py-3 border-b last:border-0">
                <p className="font-medium">{t.origin} → {t.destination}</p>
                <p className="text-sm text-gray-500">
                  {t.distance_km} km • Emission {t.emission}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No transport records yet</p>
          )}
        </Section>

      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function CenterMsg({ text, error }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${error ? "text-red-600" : "text-gray-500"}`}>
      {text}
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value || "-"}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

function formatMaterial(m) {
  return m.trim().replace(/\b\w/g, c => c.toUpperCase());
}
