import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";
import Freelancerbg from "../assets/freelancer-bg.jpeg";

function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="text-white py-28 text-center relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${Freelancerbg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Freelancer Dashboard</h1>
          <p className="mt-2">Browse jobs & manage your work</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button className="bg-white text-[#0A2647] hover:bg-gray-100">
              Find Jobs
            </Button>
            <Button className="bg-white text-[#0A2647] hover:bg-gray-100">
              My Applications
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 text-center">
            <h3 className="text-sm text-gray-500">Total Earnings</h3>
            <p className="text-2xl font-bold text-green-600">$2540</p>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-sm text-gray-500">Active Projects</h3>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-gray-400">2 due this week</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-sm text-gray-500">Completed Projects</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-gray-400">+2 this month</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-sm text-gray-500">Average Rating</h3>
            <p className="text-2xl font-bold text-yellow-500">4.8</p>
            <p className="text-xs text-gray-400">Based on 24 reviews</p>
          </Card>
        </div>

        {/* Ongoing Projects & Recommended Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ongoing Projects */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ongoing Projects</h2>
            <Card className="p-6 mb-4">
              <h3 className="font-bold">E-commerce Website</h3>
              <p className="text-sm text-gray-500">
                Building a modern e-commerce platform with React and Node.js
              </p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full w-[65%]"></div>
                </div>
                <p className="text-xs mt-1">Progress: 65% • Due: Dec 15, 2024</p>
                <p className="text-sm font-semibold">$1,200</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold">Mobile App Design</h3>
              <p className="text-sm text-gray-500">
                UI/UX design for a fitness tracking mobile application
              </p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full w-[90%]"></div>
                </div>
                <p className="text-xs mt-1">Progress: 90% • Due: Dec 8, 2024</p>
                <p className="text-sm font-semibold">$800</p>
              </div>
            </Card>
          </div>

          {/* Recommended Jobs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recommended Jobs</h2>
            <Card className="p-6 mb-4">
              <h3 className="font-bold">React Developer Needed</h3>
              <p className="text-sm text-gray-500">
                Looking for an experienced React developer to build a dashboard interface.
              </p>
              <p className="text-sm font-semibold mt-2">$50/hr</p>
              <p className="text-xs text-gray-400">Posted 2 hours ago</p>
            </Card>
            <Card className="p-6 mb-4">
              <h3 className="font-bold">Full Stack Web Development</h3>
              <p className="text-sm text-gray-500">
                Complete web application development for a small business.
              </p>
              <p className="text-sm font-semibold mt-2">$2,500</p>
              <p className="text-xs text-gray-400">Posted 5 hours ago</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold">UI/UX Design Project</h3>
              <p className="text-sm text-gray-500">
                Design wireframes and prototypes for a SaaS platform.
              </p>
              <p className="text-sm font-semibold mt-2">$35/hr</p>
              <p className="text-xs text-gray-400">Posted 1 day ago</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FreelancerDashboard;
