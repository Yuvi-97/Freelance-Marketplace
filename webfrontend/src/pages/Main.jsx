import heroBackground from "../assets/hero-background.jpg";
import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";
import FreelancerCard from "../component/ui/FreelancerCard.jsx";
import { useNavigate } from "react-router-dom";

import {
  FaCode,
  FaPaintBrush,
  FaChartLine,
  FaPenFancy,
  FaSearch,
  FaDatabase,
} from "react-icons/fa";
import Ratings from "../component/ui/Ratings.jsx";

function Main() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Content above overlay */}
        <div className="flex flex-col items-center justify-center h-full relative z-10 text-center px-4">
          <h1 className="text-white text-5xl font-bold">
            Find the Perfect <span className="text-blue-300">Freelancer</span>
          </h1>
          <p className="mt-4 text-white text-lg max-w-2xl my-8">
            Connect with top talent from around the world. Get your projects
            done faster with our curated community of skilled professionals.
          </p>
          <div className="flex space-x-4">
            <Button
              className="bg-blue-500 text-white hover:bg-blue-300"
              onClick={() => navigate("/signup")}
            >
              Find Work
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-300"
              onClick={() => navigate("/signup")}
            >
              Post a Job
            </Button>
          </div>
        </div>
      </section>
      <div className=" bg-blue-50">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-black font-bold text-3xl pt-10">
            Popular Job Categories
          </p>
          <p>
            {" "}
            Explore thousands of opportunities across various skill categories
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-8 p-4 pb-20">
          <div>
            <Card Icon={FaCode} title="Web Developers" jobs={120} />
          </div>
          <div>
            <Card Icon={FaPaintBrush} title="Graphic Designers" jobs={80} />
          </div>
          <div>
            <Card Icon={FaChartLine} title="Digital Marketers" jobs={100} />
          </div>
          <div>
            <Card Icon={FaPenFancy} title="Content Writers" jobs={60} />
          </div>
          <div>
            <Card Icon={FaSearch} title="SEO Specialists" jobs={90} />
          </div>
          <div>
            <Card Icon={FaDatabase} title="Data Analysts" jobs={110} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <p className="text-black font-bold text-3xl">Featured Freelancers</p>
        <p className="text-gray-600">
          Discover top-rated professionals ready to bring your vision to life
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-16 mt-8 pb-20">
        <FreelancerCard
          image="https://randomuser.me/api/portraits/women/44.jpg"
          name="Sarah Johnson"
          role="Full-Stack Developer"
          rate={85}
          rating={4.9}
          location="San Francisco, CA"
          description="Experienced full-stack developer with 8+ years building scalable web applications..."
          skills={["React", "Node.js", "TypeScript", "GraphQL"]}
        />

        <FreelancerCard
          image="https://randomuser.me/api/portraits/men/32.jpg"
          name="Marcus Chen"
          role="UI/UX Designer"
          rate={75}
          rating={4.8}
          location="New York, NY"
          description="Creative designer specializing in modern, user-centered designs that drive engagement..."
          skills={["Figma", "Adobe XD", "Prototyping", "Illustrator"]}
        />

        <FreelancerCard
          image="https://randomuser.me/api/portraits/women/68.jpg"
          name="Emily Rodriguez"
          role="Frontend Developer"
          rate={70}
          rating={4.9}
          location="Austin, TX"
          description="Frontend specialist creating beautiful, responsive interfaces with a focus on usability..."
          skills={["React", "Vue.js", "CSS3", "Tailwind"]}
        />
      </div>

      <Ratings />
    </div>
  );
}

export default Main;
