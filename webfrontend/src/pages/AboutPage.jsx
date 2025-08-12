import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Welcome to <span className="font-semibold text-gray-800">SkillConnect</span> —
          a modern freelance marketplace where ideas meet talent. We connect
          passionate clients with skilled professionals across the globe,
          ensuring every project is built on trust, transparency, and top-notch
          quality.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To empower freelancers and businesses by creating a platform that
              values skill, fosters collaboration, and simplifies the way people
              work together in a digital-first world.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A world where geography is no barrier to opportunity — where
              anyone, anywhere, can turn their passion into a profession and
              contribute to projects that make a real impact.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why Choose Us?
        </h2>
        <ul className="space-y-4 mb-10">
          {[
            "Global network of talented freelancers and trusted clients.",
            "Secure payments with milestone-based protection.",
            "Advanced matching system to find the right talent faster.",
            "Transparent reviews and ratings for informed decisions.",
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <span className="text-blue-500 font-bold">✓</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-lg text-gray-600">
          Whether you’re a business looking for expertise or a professional
          seeking your next big opportunity, <span className="font-semibold text-gray-800">SkillConnect</span> is here
          to make it happen. Let’s build the future of work — together.
        </p>
      </div>
    </div>
  );
}
