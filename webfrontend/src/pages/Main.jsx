import heroBackground from "../assets/hero-background.jpg";

function Main() {
  return (
    <div className="App">
      <section
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div>Hello world</div>
      </section>
    </div>
  );
}

export default Main;
