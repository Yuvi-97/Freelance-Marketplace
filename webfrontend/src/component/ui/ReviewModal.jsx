import axios from "axios";
import { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

/**
 * ReviewModal — shown after project completion.
 *
 * Props:
 *   projectId       — the completed project's ID
 *   projectTitle    — display name
 *   reviewerId      — current user's ID
 *   freelancerId    — set when client is reviewing freelancer
 *   clientId        — set when freelancer is reviewing client
 *   targetName      — name of the person being reviewed
 *   onClose()       — called when modal is dismissed
 *   onSubmitted()   — called after successful submission
 */
export default function ReviewModal({
  projectId,
  projectTitle,
  reviewerId,
  freelancerId,
  clientId,
  targetName,
  onClose,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a short review."); return; }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/reviews`,
        { rating, comment, reviewerId, freelancerId, clientId, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400"></div>

        <div className="p-7">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rate & Review</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                How was your experience with <span className="font-semibold text-gray-700">{targetName}</span>?
              </p>
              <p className="text-xs text-gray-400 mt-1">Project: {projectTitle}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <FiX size={18} />
            </button>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <FiStar
                  size={36}
                  className={`transition-colors ${
                    star <= (hovered || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  style={{ fill: star <= (hovered || rating) ? "currentColor" : "none" }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm font-medium text-gray-600 -mt-3 mb-4">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}

          {/* Comment */}
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience working with ${targetName}...`}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 resize-none transition"
          />

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition text-sm"
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:from-yellow-500 hover:to-orange-500 transition text-sm disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
