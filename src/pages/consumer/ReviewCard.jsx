import React from "react";

const ReviewCard = React.forwardRef(({ review, isMine }, ref) => {
  //console.log(review, isMine);
  
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();

    const diffTime = today - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return d.toLocaleDateString();
  };

  return (
    <div
      ref={ref}
      className={`rounded-xl p-4 shadow-sm border transition ${
        isMine
          ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
          : "bg-white border-gray-100"
      }`}
    >
      {/* ⭐ Top Row */}
      <div className="flex justify-between items-center">

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= review.rating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Date */}
        <span className="text-xs text-gray-500">
          {formatDate(review.created_at)}
        </span>
      </div>

      {/* 👤 User */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm font-medium text-gray-800">
          {review.user?.name || "Anonymous"}
        </p>

        {/* 🔥 Highlight Badge */}
        {isMine && (
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
            You
          </span>
        )}
      </div>

      {/* 💬 Comment */}
      {review.comment && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
});

export default ReviewCard;