import clientbg from "../assets/client-bg.jpeg";
import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";

function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <section
        style={{ backgroundImage: `url(${clientbg})` }}
        className="text-white py-28 text-center relative bg-cover bg-center h-96"
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-8 -mt-16 relative z-20 mt-12">
        <Card className="text-center">
          <h3 className="text-sm text-gray-500">Total Spent</h3>
          <p className="text-2xl font-bold">$8750</p>
          <p className="text-xs text-green-500">+15.2% from last month</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Active Projects</h3>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-gray-400">2 awaiting review</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Completed Projects</h3>
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-gray-400">+3 this month</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold">96%</p>
          <p className="text-xs text-gray-400">Project completion rate</p>
        </Card>
      </div>

      {/* Active Projects + Recent Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-12">
        {/* Active Projects */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
          <div className="mb-4 p-4 border rounded-lg bg-white">
            <h3 className="font-bold">Corporate Website Redesign</h3>
            <p className="text-sm text-gray-600">In Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2 my-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Due: Dec 20, 2024 • $3500</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-bold">Mobile App Development</h3>
            <p className="text-sm text-yellow-600">Review</p>
            <p className="text-xs text-gray-500">iOS & Android app • $5000</p>
          </div>
        </Card>

        {/* Recent Applications */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
          <div className="flex justify-between items-center p-4 border rounded-lg bg-white mb-3">
            <div>
              <h3 className="font-bold">Alex Developer</h3>
              <p className="text-sm text-gray-600">
                Full-stack Developer • $45/hr
              </p>
              <p className="text-xs text-yellow-600">⭐ 4.9 • 15 projects</p>
            </div>
            <Button className="bg-[#0A2647] text-white px-3 py-1">View</Button>
          </div>
          <div className="flex justify-between items-center p-4 border rounded-lg bg-white">
            <div>
              <h3 className="font-bold">Sarah Chen</h3>
              <p className="text-sm text-gray-600">UI/UX Designer • $40/hr</p>
              <p className="text-xs text-yellow-600">⭐ 4.8 • 22 projects</p>
            </div>
            <Button className="bg-[#0A2647] text-white px-3 py-1">View</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ClientDashboard;
