import { useState } from "react";
import api from "../../api/axios";

export default function WriteReview({ batchId, batchStatus, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = batchStatus !== "verified";

  async function submit() {
    if (!rating) return;

    setLoading(true);
    setError("");

    try {
      await api.post(`/api/reviews/batch/${batchId}`, {
        rating,
        comment
      });

      setRating(0);
      setComment("");
      onSuccess();

    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl mb-4">

      <h3 className="font-semibold mb-2">
        Write a Review
      </h3>

      {/* 🚫 Show restriction message */}
      {isDisabled && (
        <p className="text-sm text-red-500 mb-2">
          You can only review verified batches.
        </p>
      )}

      {/* ⭐ Rating */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => !isDisabled && setRating(star)}
            className={`text-xl ${
              isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "cursor-pointer " +
                  (star <= rating
                    ? "text-yellow-500"
                    : "text-gray-300")
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* 💬 Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isDisabled}
        placeholder={
          isDisabled
            ? "Batch must be verified to review"
            : "Share your experience..."
        }
        className="w-full border rounded p-2 mb-2 disabled:bg-gray-100"
      />

      {/* ❗ Error */}
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading || isDisabled}
        className={`px-4 py-2 rounded text-white ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}