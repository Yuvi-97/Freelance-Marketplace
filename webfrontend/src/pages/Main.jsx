import heroBackground from "../assets/hero-background.jpg";
import Button from "../component/ui/Button.jsx";
import Card from "../component/ui/Card.jsx";

function Main() {
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
            <Button className="bg-blue-500 text-white hover:bg-blue-300">
              Find Work
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-300">
              Post a Job
            </Button>
          </div>
        </div>
      </section>
      <div className=" bg-blue-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-black font-bold text-3xl pt-10">Popular Job Categories</p>
        <p>
          {" "}
          Explore thousands of opportunities across various skill categories
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-8 p-4 pb-20">
        <div>
          <Card className="ph-10" title="Web Developers" jobs={120} />
        </div>
        <div>
          <Card title="Graphic Designers" jobs={80} />
        </div>
        <div>
          <Card title="Digital Marketers" jobs={100} />
        </div>
        <div>
          <Card title="Content Writers" jobs={60} />
        </div>
        <div>
          <Card title="SEO Specialists" jobs={90} />
        </div>
        <div>
          <Card title="Data Analysts" jobs={110} />
        </div>
      </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <p className="text-black font-bold text-3xl">Featured Freelancers</p>
        <p>
          {" "}
          Discover top-rated professionals ready to bring your vision to life
        </p>
      </div>
    </div>
  );
}

export default Main;
