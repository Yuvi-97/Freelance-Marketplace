import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";
import Freelancerbg from "../assets/freelancer-bg.jpeg";
function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="text-white py-28 text-center relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${Freelancerbg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold ">Freelancer Dashboard</h1>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <Card title="Jobs Applied" jobs={15} />
        <Card title="Active Projects" jobs={3} />
        <Card title="Completed Projects" jobs={8} />
      </div>

      {/* Recommended Jobs */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Frontend Developer - 40k/month</span>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Apply
              </Button>
            </li>
            <li className="flex justify-between">
              <span>Logo Design Project - $500</span>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Apply
              </Button>
            </li>
            <li className="flex justify-between">
              <span>SEO Optimization - $300</span>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Apply
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
