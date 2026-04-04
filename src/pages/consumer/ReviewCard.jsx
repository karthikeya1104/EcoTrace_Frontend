import React from "react";

const ReviewCard = React.forwardRef(({ review }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow p-4"
    >
      <div className="flex justify-between items-center">
        {/* Stars */}
        <div className="text-yellow-500 text-lg">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>

        {/* Date */}
        <span className="text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* User */}
      <p className="text-sm font-medium mt-1">
        {review.user?.name || "Anonymous"}
      </p>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-gray-600 mt-2">
          {review.comment}
        </p>
      )}
    </div>
  );
});

export default ReviewCard;