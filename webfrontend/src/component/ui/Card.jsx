export default function Card({ Icon, title, jobs, className, children }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3 border hover:shadow-md transition-all duration-200 ${className}`}
    >
      {Icon && <Icon className="w-12 h-12 text-blue-500 mx-auto" />}
      {title && <h3 className="text-lg font-semibold text-center">{title}</h3>}
      {jobs !== undefined && (
        <p className="text-sm text-gray-500 text-center">{jobs} Jobs</p>
      )}
      {children} {/* ✅ allows dashboard content */}
    </div>
  );
}
