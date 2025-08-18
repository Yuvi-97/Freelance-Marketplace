import { Star } from "lucide-react";

function Ratings() {
  const testimonials = [
    {
      name: "David Park",
      role: "TechStart Inc.",
      quote:
        "Found an amazing developer within 24 hours. The quality of work exceeded our expectations!",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Creative Agency",
      quote:
        "FreelanceHub has been a game-changer for our business. Top-tier talent at competitive rates.",
      rating: 5,
    },
    {
      name: "Michael Foster",
      role: "E-commerce Co.",
      quote:
        "The platform makes it easy to find skilled professionals. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
        <p className="mt-2 text-gray-600">
          Join thousands of satisfied customers who found success with FreelanceHub
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 text-left hover:shadow-lg transition"
            >
              <div className="flex items-center mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                ))}
              </div>
              <p className="text-gray-700 italic">"{t.quote}"</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ratings;
