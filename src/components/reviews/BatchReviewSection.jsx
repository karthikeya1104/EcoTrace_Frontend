import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getUser, isAuthenticated } from "../../utils/useAuth";
import ReviewCard from "../../pages/consumer/ReviewCard";
import WriteReview from "./WriteReview";

export default function BatchReviewSection({ batchId, batchStatus }) {
  const user = isAuthenticated() ? getUser() : null;
  const isConsumer = user?.role === "consumer";

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/api/reviews/batch/${batchId}`);
      const items = res.data.items || [];

      // ✅ Separate my review safely
      const mine = items.find(r => r.is_mine === true);
      const others = items.filter(r => !r.is_mine);

      setMyReview(mine || null);
      setReviews(others);

    } catch (err) {
      if (err.response?.status === 401) {
        setReviews([]);
        setMyReview(null);
        return;
      }

      console.error(err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [batchId]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

      {/* HEADER */}
      <h2 className="text-xl font-bold mb-4">
        Batch Reviews ({reviews.length + (myReview ? 1 : 0)})
      </h2>

      {/* 🔥 MY REVIEW */}
      {isConsumer && myReview && (
        <div className="mb-6 border border-blue-200 bg-blue-50 rounded-xl p-4">

          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600 font-medium">
              Your Review
            </p>

            <button
              onClick={() => setIsEditing(prev => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* SHOW REVIEW */}
          {!isEditing && (
            <ReviewCard
              review={myReview}
              isMine={true}
            />
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <WriteReview
              batchId={batchId}
              batchStatus={batchStatus}
              existing={myReview}
              onSuccess={() => {
                setIsEditing(false);
                fetchReviews();
              }}
            />
          )}
        </div>
      )}

      {/* 🔥 WRITE NEW REVIEW */}
      {isConsumer && !myReview && (
        <div className="mb-6">
          <WriteReview
            batchId={batchId}
            batchStatus={batchStatus}
            onSuccess={fetchReviews}
          />
        </div>
      )}

      {/* ❗ ERROR */}
      {error && (
        <p className="text-red-500 mb-3">{error}</p>
      )}

      {/* 📋 OTHER REVIEWS */}
      {reviews.length ? (
        <>
          <p className="text-sm text-gray-500 mb-2">
            All Reviews
          </p>

          <div className="space-y-4">
            {reviews.map(r => (
              <ReviewCard
                key={r.id}
                review={r}
                isMine={r.is_mine}
              />
            ))}
          </div>
        </>
      ) : !myReview ? (
        <p className="text-gray-500 text-center py-6">
          No reviews yet. Be the first!
        </p>
      ) : null}
    </div>
  );
}