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

      {/* Report Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">
            Lab Report Details
          </h2>

          <StatusBadge verified={report.verified} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-500">Lab Score</p>
            <p className="text-2xl font-bold text-green-700">
              {report.lab_score}/100
            </p>
          </div>

          <div>
            <p className="text-gray-500">Eco Rating</p>
            <p className="text-2xl font-bold text-green-700">
              {report.eco_rating}/5
            </p>
          </div>

          <div>
            <p className="text-gray-500">Certifications</p>
            <p>
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

      {/* Test Summary */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          Test Summary
        </h3>

        <p className="text-gray-700 whitespace-pre-line">
          {report.test_summary}
        </p>
      </div>

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

function StatusBadge({ verified }) {
  return verified ? (
    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
      Verified
    </span>
  ) : (
    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
      Pending
    </span>
  );
}