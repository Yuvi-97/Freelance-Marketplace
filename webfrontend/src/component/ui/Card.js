import React from "react";

function Card({ logo, title, jobs, className }) {
  return (
    <div
      className={`bg-white items-center justify-center rounded-xl shadow-sm p-4 flex items-center gap-4 border hover:shadow-md transition-all duration-200 w-96 h-48 ${className}`}
    >
      {logo && (
        <img
          src={logo}
          alt={title}
          className="w-10 h-10 object-contain"
        />
      )}
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{jobs} Jobs</p>
      </div>
    </div>
  );
}

export default Card;
