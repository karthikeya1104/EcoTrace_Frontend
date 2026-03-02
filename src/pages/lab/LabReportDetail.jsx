import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function LabReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/lab-reports/${reportId}`)
      .then(res => setReport(res.data))
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <DashboardLayout title="Report Details">
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout title="Report Details">
        <div className="p-6 text-red-600">
          {error || "Report not found"}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Report #${report.id}`}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        ← Back to Reports
      </button>

      {/* Report Overview */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">
            Lab Report Overview
          </h2>

          <StatusBadge 
            verified={report.verified} 
            safetyStatus={report.safety_status}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-500">Lab Score</p>
            <p className="text-2xl font-bold text-green-700">
              {report.lab_score}/5
            </p>
          </div>

          <div>
            <p className="text-gray-500">Safety Status</p>
            <p className={`text-lg font-semibold ${
              report.safety_status === "safe"
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {report.safety_status?.toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Certifications</p>
            <p className="whitespace-pre-line">
              {report.certifications || "No certifications"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Created At</p>
            <p>
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Analysis Sections */}
      {report.analysis_data?.map((section, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            {section.title}
          </h3>

          <p className="text-gray-700 whitespace-pre-line">
            {section.content}
          </p>
        </div>
      ))}

      {/* Notes */}
      {report.notes && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Additional Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-line">
            {report.notes}
          </p>
        </div>
      )}

      {/* Batch Info */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Batch Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Batch Code</p>
            <p className="font-medium text-green-700">
              {report.batch?.batch_code}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Manufacturing Location</p>
            <p>
              {report.batch?.manufacturing_location}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Expiry Date</p>
            <p>
              {new Date(report.batch?.expiry_date).toLocaleDateString()}
            </p>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}


/* ---------- Status Badge ---------- */

function StatusBadge({ verified, safetyStatus }) {
  return (
    <div className="flex gap-2">
      <span className={`px-3 py-1 text-sm rounded-full ${
        verified
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}>
        {verified ? "Verified" : "Pending"}
      </span>

      {safetyStatus && (
        <span className={`px-3 py-1 text-sm rounded-full ${
          safetyStatus === "safe"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {safetyStatus.toUpperCase()}
        </span>
      )}
    </div>
  );
}