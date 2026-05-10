import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBackground from "../assets/hero-background.jpg";
import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";
import FreelancerCard from "../component/ui/FreelancerCard.jsx";

import {
  FaChartLine,
  FaCode,
  FaDatabase,
  FaPaintBrush,
  FaPenFancy,
  FaSearch,
} from "react-icons/fa";
import Ratings from "../component/ui/Ratings.jsx";

function Main() {
  const navigate = useNavigate();
  const [topFreelancers, setTopFreelancers] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const loadTop = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/reviews/top?limit=3",
        );
        if (!res.ok) throw new Error((await res.text()) || res.statusText);
        const data = await res.json(); // expects [{ freelancer: {...}, averageRating: 4.5 }, ...]
        setTopFreelancers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load top freelancers", e);
        setTopFreelancers([]);
      } finally {
        setLoadingTop(false);
      }
    };
    loadTop();
  }, []);

  // ensure exactly 3 slots (fill with null placeholders)
  const slots = [...topFreelancers];
  while (slots.length < 3) slots.push(null);

  return (
    <div className="App">
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>

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
          <Card Icon={FaCode} title="Web Developers" />
          <Card Icon={FaPaintBrush} title="Graphic Designers" />
          <Card Icon={FaChartLine} title="Digital Marketers" />
          <Card Icon={FaPenFancy} title="Content Writers" />
          <Card Icon={FaSearch} title="SEO Specialists" />
          <Card Icon={FaDatabase} title="Data Analysts" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <p className="text-black font-bold text-3xl">Featured Freelancers</p>
        <p className="text-gray-600">
          Discover top-rated professionals ready to bring your vision to life
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-16 mt-8 pb-20">
        {loadingTop ? (
          <p className="text-gray-600">Loading top freelancers…</p>
        ) : (
          slots.map((entry, idx) =>
            entry ? (
              <FreelancerCard
                key={entry.freelancer.id ?? idx}
                image={
                  entry.freelancer.profileUrl ||
                  `https://i.pravatar.cc/150?u=${entry.freelancer.id ?? idx}`
                }
                name={
                  entry.freelancer.name ||
                  entry.freelancer.user?.username ||
                  "Anonymous"
                }
                role={entry.freelancer.skills ?? ""}
                rate={entry.freelancer.hourlyRate ?? 0}
                rating={entry.averageRating ?? 0}
                location={""}
                description={entry.freelancer.bio ?? ""}
                skills={
                  entry.freelancer.skills
                    ? entry.freelancer.skills.split(",").map((s) => s.trim())
                    : []
                }
              />
            ) : (
              <div
                key={`empty-${idx}`}
                className="w-80 bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-gray-500"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full mb-4" />
                <p className="text-xl font-semibold">Available Soon</p>
                <p className="text-sm mt-2">More top freelancers coming</p>
              </div>
            ),
          )
        )}
      </div>

      <Ratings />
    </div>
  );
}

export default Main;
