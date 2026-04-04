import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ReviewCard from "./ReviewCard";

export default function BatchReviews() {
  const { id } = useParams();
  const location = useLocation();

  const highlightId = location.state?.highlightReviewId;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [myReview, setMyReview] = useState(null);

  const limit = 10;
  const observer = useRef();

  // =========================
  // Fetch Reviews
  // =========================
  const fetchReviews = async (pageNum) => {
    const skip = (pageNum - 1) * limit;

    const res = await api.get(`/api/reviews/batch/${id}`, {
      params: { skip, limit }
    });

    return res.data;
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchReviews(1).then((data) => {
      setReviews(data.items);
      setHasMore(data.items.length < data.total);
      setLoading(false);

      // detect user's own review
      const mine = data.items.find(r => r.is_mine);
      if (mine) setMyReview(mine);
    });
  }, [id]);

  // =========================
  // Load More
  // =========================
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    const data = await fetchReviews(nextPage);

    setReviews(prev => [...prev, ...data.items]);
    setPage(nextPage);

    if ((nextPage - 1) * limit + data.items.length >= data.total) {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  // =========================
  // Infinite Scroll Observer
  // =========================
  const lastRef = useCallback((node) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  // =========================
  // Reload Reviews
  // =========================
  const reload = async () => {
    setPage(1);
    setReviews([]);
    setHasMore(true);
    setLoading(true);

    const data = await fetchReviews(1);
    setReviews(data.items);
    setHasMore(data.items.length < data.total);
    setLoading(false);
  };

  // =========================
  // Delete Review
  // =========================
  const handleDelete = async (reviewId) => {
    await api.delete(`/api/reviews/${reviewId}`);
    reload();
  };

  return (
    <DashboardLayout title="Reviews">

      {/* HEADER */}
      <h2 className="text-xl font-bold text-green-800 mb-6">
        Customer Reviews
      </h2>

      {/* WRITE / EDIT */}
      <WriteReview
        batchId={id}
        existing={myReview}
        onSuccess={reload}
      />

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {reviews.map((review, index) => {
          const isLast = reviews.length === index + 1;
          const isTarget = review.id === highlightId;

          return (
            <ReviewCard
              key={review.id}
              review={review}
              isMine={review.is_mine}
              onDelete={handleDelete}
              ref={
                isLast
                  ? lastRef
                  : isTarget
                    ? (el => el?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                      }))
                    : null
              }
            />
          );
        })}
      </div>

      {/* LOADING MORE */}
      {loadingMore && (
        <div className="mt-4 space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {/* END */}
      {!hasMore && !loading && (
        <div className="text-center text-gray-500 mt-6">
          No more reviews
        </div>
      )}

    </DashboardLayout>
  );
}

function WriteReview({ batchId, existing, onSuccess }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    }
  }, [existing]);

  async function submit() {
    if (!rating) return;

    setLoading(true);
    try {
      await api.post(`/api/reviews/batch/${batchId}`, {
        rating,
        comment
      });

      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6">

      <h3 className="font-semibold text-green-700 mb-3">
        {existing ? "Update Your Review" : "Write a Review"}
      </h3>

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl cursor-pointer ${
              star <= (hover || rating)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full border rounded-xl p-3 text-sm mb-3"
      />

      <button
        onClick={submit}
        disabled={loading || !rating}
        className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit"}
      </button>

    </div>
  );
}


function Skeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
  );
}