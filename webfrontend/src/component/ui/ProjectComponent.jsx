// src/components/ProjectCard.jsx
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const getStatusBadge = (status) => {
    console.log(project);
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
            COMPLETED
          </span>
        );
      case "in progress":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">
            IN PROGRESS
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
            OPEN
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
        {getStatusBadge(project.status)}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <p className="font-semibold">${project.budget}</p>
        <p className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-gray-500" />
          Due: {new Date(project.dueDate).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2 text-gray-600">
          <FaUsers className="text-gray-500" />
          {project.freelancerCount || 0} freelancer
          {project.freelancerCount > 1 ? "s interested" : " interested"}
        </p>
      </div>

      {project.assignedFreelancer && (
        <p className="mt-3 text-sm">
          Assigned to:{" "}
          <Link
            to={`/freelancer/${project.assignedFreelancer.id}`}
            className="text-indigo-600 font-medium hover:underline"
          >
            {project.assignedFreelancer.name}
          </Link>
        </p>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Posted: {new Date(project.postedDate).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ProjectCard;
