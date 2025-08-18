import React from "react";

function Card({ Icon, title, jobs, className }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-3 border hover:shadow-md transition-all duration-200 w-96 h-48 ${className}`}
    >
      {Icon && <Icon className="w-12 h-12 text-blue-500" />} 
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{jobs} Jobs</p>
    </div>
  );
}

export default Card;
