import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";
import clientbg from "../assets/client-bg.jpeg";
function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <section
        style={{ backgroundImage: `url(${clientbg})` }}
        className="text-white py-28 text-center relative bg-cover bg-center h-96"
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Client Dashboard</h1>
          <p className="mt-2">Manage your job postings & track freelancers</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button className="bg-white text-[#0A2647] hover:bg-gray-100">
              Post New Job
            </Button>
            <Button className="bg-white text-[#0A2647] hover:bg-gray-100">
              View My Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 flex-1">
        <Card title="Active Jobs" jobs={5} />
        <Card title="Applications Received" jobs={42} />
        <Card title="Projects Completed" jobs={12} />
      </div>

      {/* Recent Applicants */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#0A2647]">
          Recent Applicants
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <ul className="space-y-3">
            {[
              "John Doe - Web Developer",
              "Sarah Smith - Graphic Designer",
              "Mike Johnson - SEO Specialist",
            ].map((applicant, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{applicant}</span>
                <Button
                  style={{ backgroundColor: "#2C74B3" }}
                  className="text-white hover:opacity-90"
                >
                  View Profile
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
