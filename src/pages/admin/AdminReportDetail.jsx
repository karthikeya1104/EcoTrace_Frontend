import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AdminBatchDetail() {
  const { id } = useParams(); // batch_id
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/batch/${id}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center p-10 animate-pulse">
          Loading batch...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const { product, batch, materials, transports, lab_reports, ai_score } = data;
  const lab = lab_reports?.[0];

  return (
    <DashboardLayout role="admin" title="Batch Details">

      {/* PRODUCT + BATCH */}
      <Section title="Product Info">
        <Row label="Name" value={product.name} />
        <Row label="Brand" value={product.brand} />
        <Row label="Category" value={product.category} />
      </Section>

      <Section title="Batch Info">
        <Row label="Code" value={batch.code} />
        <Row label="Location" value={batch.manufacturing_location} />
        <Row label="Status" value={batch.status} />
        <Row label="Validation" value={batch.validation_status} />
      </Section>

      {/* MATERIALS */}
      <Section title="Materials">
        {materials.map(m => (
          <div key={m.material_id} className="flex justify-between text-sm border-b py-2">
            <span>{m.name}</span>
            <span>{m.percentage}%</span>
          </div>
        ))}
      </Section>

      {/* LAB REPORT */}
      <Section title="Lab Report">
        {!lab ? (
          <p className="text-yellow-600">No lab report available</p>
        ) : (
          <>
            <Row label="Score" value={lab.lab_score} />
            <Row
              label="Status"
              value={lab.verified ? "Verified ✔" : "Pending"}
            />

            {/* Safety */}
            <div className="mt-2 font-semibold">
              Safety:{" "}
              <span className={
                lab.safety_status === "safe"
                  ? "text-green-600"
                  : lab.safety_status === "caution"
                  ? "text-yellow-600"
                  : "text-red-600"
              }>
                {lab.safety_status}
              </span>
            </div>

            {/* Analysis */}
            <div className="mt-4 space-y-3">
              {lab.analysis?.map((a, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-medium">{a.title}</h4>

                  <ul className="list-disc pl-5 text-sm mt-2">
                    {a.content.split("\n").map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Actions */}
            {!lab.verified && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => api.post(`/admin/reports/${lab.id}/verify`)
                    .then(() => navigate("/admin/reports"))
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Verify
                </button>

                <button
                  onClick={() => api.post(`/admin/reports/${lab.id}/reject`)
                    .then(() => navigate("/admin/reports"))
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Reject
                </button>
              </div>
            )}
          </>
        )}
      </Section>

    </DashboardLayout>
  );
}


/* ---------- UI Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-green-700 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}