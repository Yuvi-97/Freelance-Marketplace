import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

function Ratings() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/app-reviews");

      // Get only top 3 reviews
      setReviews(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          What Our Clients Say
        </h2>

        <p className="mt-2 text-gray-600">
          Join thousands of satisfied customers who found success with
          FreelanceHub
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow-md rounded-xl p-6 text-left hover:shadow-lg transition"
            >
              <div className="flex items-center mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400 w-5 h-5"
                  />
                ))}
              </div>

              <p className="text-gray-700 italic">"{review.comment}"</p>

              <div className="mt-4">
                <p className="font-semibold text-gray-900">
                  {review.user?.username}
                </p>

                <p className="text-gray-500 text-sm">Platform User</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ratings;
