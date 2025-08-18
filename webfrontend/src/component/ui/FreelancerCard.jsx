import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

function FreelancerCard({ image, name, role, rate, rating, location, description, skills }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-80 flex flex-col border hover:shadow-lg transition-all duration-200">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-600">${rate}</p>
          <p className="text-sm text-gray-500">per hour</p>
        </div>
      </div>

      {/* Rating + Location */}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <span className="flex items-center gap-1 text-yellow-500">
          <FaStar /> {rating}
        </span>
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt /> {location}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-700 text-sm line-clamp-3">{description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {skills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {/* Profile Button */}
      <button className="mt-4 w-full py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50">
        View Profile
      </button>
    </div>
  );
}

export default FreelancerCard;
