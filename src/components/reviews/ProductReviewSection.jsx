import { useEffect, useState, useRef, useCallback } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const LIMIT = 10;

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async (pageNum = 1) => {
    const skip = (pageNum - 1) * LIMIT;

    const res = await api.get(`/api/reviews/batch/${batchId}`, {
      params: { skip, limit: LIMIT }
    });

    return res.data;
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    setLoading(true);

    fetchReviews(1).then((data) => {
      const items = data.items || [];

      const mine = items.find(r => r.is_mine === true);
      const others = items.filter(r => !r.is_mine);

      setMyReview(mine || null);
      setReviews(others);
      setHasMore(items.length < data.total);
      setLoading(false);
    });

  }, [batchId]);

  // =========================
  // LOAD MORE
  // =========================
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    const data = await fetchReviews(nextPage);

    const newItems = data.items.filter(r => !r.is_mine);

    setReviews(prev => [...prev, ...newItems]);
    setPage(nextPage);

    if ((nextPage - 1) * LIMIT + newItems.length >= data.total) {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  // =========================
  // SCROLL OBSERVER
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

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

      <h2 className="text-xl font-bold mb-4">
        Batch Reviews ({reviews.length + (myReview ? 1 : 0)})
      </h2>

      {/* WRITE */}
      {isConsumer && !myReview && (
        <WriteReview
          batchId={batchId}
          batchStatus={batchStatus}
          onSuccess={() => {
            setPage(1);
            fetchReviews(1).then(d => setReviews(d.items));
          }}
        />
      )}

      {/* LIST */}
      <div className="space-y-4 mt-4">
        {reviews.map((r, index) => {
          const isLast = reviews.length === index + 1;

          return (
            <div
              key={r.id}
              ref={isLast ? lastRef : null}
              className="animate-fadeInUp"
            >
              <ReviewCard review={r} isMine={r.is_mine} />
            </div>
          );
        })}
      </div>

      {/* LOADING MORE */}
      {loadingMore && (
        <p className="text-center mt-4 text-gray-500">
          Loading more...
        </p>
      )}
    </div>
  );
}