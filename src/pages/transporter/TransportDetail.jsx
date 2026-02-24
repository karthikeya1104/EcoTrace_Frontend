import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TransportDetail() {
  const { id } = useParams();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/transports/${id}`)
      .then(res => setTransport(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <DashboardLayout title="Transport Details">
        <div>Loading...</div>
      </DashboardLayout>
    );

  if (!transport)
    return (
      <DashboardLayout title="Transport Details">
        <div className="text-red-500">Transport not found</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title={`Transport #${transport.id}`}>

      {/* ROUTE SUMMARY */}
      <div className="bg-white rounded-2xl shadow p-8 mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2">Route</p>
        <h1 className="text-3xl font-bold text-green-800">
          {transport.origin} → {transport.destination}
        </h1>
        <p className="text-gray-500 mt-2">
          {transport.distance_km} km transported
        </p>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Transport Info */}
        <InfoCard title="Transport Information">
          <Row label="Transport ID" value={transport.id} />
          <Row label="Batch ID" value={transport.batch_id} />
          <Row label="Vehicle Type" value={transport.vehicle_type} />
          <Row label="Fuel Type" value={transport.fuel_type} />
        </InfoCard>

        {/* Emission Info */}
        <InfoCard title="Emission Calculation">
          <Row label="Distance" value={`${transport.distance_km} km`} />
          <Row label="Emission" value={`${transport.transport_emission} kg CO₂`} />
          <Row
            label="Intensity"
            value={`${transport.distance_km > 0 ? (transport.transport_emission / transport.distance_km).toFixed(4): "0"} kg/km`}
          />
        </InfoCard>

      </div>

      {/* NOTES */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-700 mb-3">
          Transport Remarks
        </h2>
        <p className="text-gray-700 whitespace-pre-line">
          {transport.notes || "No remarks recorded"}
        </p>
      </div>

      {/* AUDIT INFO */}
      <div className="bg-gray-50 border rounded-2xl p-6 text-sm text-gray-600">
        <p>
          Recorded on:{" "}
          <span className="font-medium">
            {new Date(transport.created_at).toLocaleString()}
          </span>
        </p>
        <p className="mt-1">
          Transporter ID: <span className="font-medium">{transport.transporter_id}</span>
        </p>
      </div>

    </DashboardLayout>
  );
}

/* ---------- reusable UI ---------- */

function InfoCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
