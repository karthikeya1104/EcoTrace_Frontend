import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../api/axios";
import { getUser, isAuthenticated } from "../../utils/useAuth";
import ReviewCard from "../../pages/consumer/ReviewCard";
import WriteReview from "./WriteReview";

export default function ReviewSection({ batchId, productId, batchStatus, navigate }) {
  const user = isAuthenticated() ? getUser() : null;
  const isConsumer = user?.role === "consumer";

  const [mode, setMode] = useState("batch");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const limit = 10;
  const observer = useRef();

  // =========================
  // FETCH
  // =========================
  const fetchReviews = async (pageNum) => {
    const skip = (pageNum - 1) * limit;

    let res;

    if (mode === "batch") {
      res = await api.get(`/api/reviews/batch/${batchId}`, {
        params: { skip, limit }
      });
    } else {
      res = await api.get(`/api/reviews/product/${productId}`, {
        params: { skip, limit }
      });
    }

    return res.data;
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    setPage(1);
    setReviews([]);
    setHasMore(true);
    setLoading(true);

    fetchReviews(1).then((data) => {
      let items = data.items;

      if (mode === "batch") {
        items = items.sort((a, b) => (b.is_mine ? 1 : 0) - (a.is_mine ? 1 : 0));
      }

      setReviews(items);
      setHasMore(items.length < data.total);
      setLoading(false);
    });

  }, [mode, batchId, productId]);

  // =========================
  // LOAD MORE
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
  // OBSERVER
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

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

      {/* TOGGLE */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("batch")}
          className={`px-4 py-2 rounded-xl ${
            mode === "batch" ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          Batch Reviews
        </button>

        <button
          onClick={() => setMode("product")}
          className={`px-4 py-2 rounded-xl ${
            mode === "product" ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          Product Reviews
        </button>
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-bold mb-4">
        {mode === "batch" ? "Batch Reviews" : "Product Reviews"}
      </h2>

      {/* WRITE REVIEW */}
      {mode === "batch" && isConsumer && (
        <WriteReview
          batchId={batchId}
          batchStatus={batchStatus}   //  PASS HERE
          onSuccess={() => {
            setPage(1);
            fetchReviews(1).then(d => setReviews(d.items));
          }}
        />
      )}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      <div className="space-y-4">
        {reviews.map((review, index) => {
          const isLast = reviews.length === index + 1;

          return (
            <div key={review.id} ref={isLast ? lastRef : null}>
              <ReviewCard review={review} />

              {mode === "product" && (
                <button
                  onClick={() =>
                    navigate(`/public/batch/${review.batch_id}`, {
                      state: { highlightReviewId: review.id }
                    })
                  }
                  className="text-xs text-green-600 mt-1"
                >
                  View batch →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {loadingMore && <p className="mt-4">Loading more...</p>}

      {/* END */}
      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-6">
          No more reviews
        </p>
      )}
    </div>
  );
}