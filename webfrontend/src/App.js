import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AboutPage from "./pages/AboutPage.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import Footer from "./pages/Fotter.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";
import Header from "./pages/Header.jsx";
import JobListings from "./pages/JobListings.jsx";
import Main from "./pages/Main.jsx";
import ApplicationsPage from "./pages/MyApplication.jsx";
import MyProjects from "./pages/MyProject.jsx";
import PostProject from "./pages/PostProject.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";
  return (
    <>
      {!isAuthRoute && <Header user={loggedInUser} />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/signup"
          element={<SignUp onUserLoggedIn={setLoggedInUser} />}
        />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/job-listings" element={<JobListings />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/my-applications" element={<ApplicationsPage />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
      </Routes>
      {!isAuthRoute && <Footer />}
    </>
  );
}

export default App;
