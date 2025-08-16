import { Route, Routes } from "react-router-dom";
import Footer from "./pages/Fotter.jsx";
import Header from "./pages/Header.jsx";
import Main from "./pages/Main.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import { useState } from "react";
import PostProject from "./pages/PostProject.jsx";
import JobListings from "./pages/JobListings.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  return (
    <>
      <Header user={loggedInUser}/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp onUserLoggedIn={setLoggedInUser}/>} />
        <Route path="/post-project" element={<PostProject/>} />
        <Route path="/job-listings" element={<JobListings />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
