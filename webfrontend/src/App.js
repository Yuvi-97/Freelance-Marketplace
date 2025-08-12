import { Route, Routes } from "react-router-dom";
import Footer from "./pages/Fotter.jsx";
import Header from "./pages/Header.jsx";
import Main from "./pages/Main.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import { useState } from "react";

function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  return (
    <>
      <Header user={loggedInUser}/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp onUserLoggedIn={setLoggedInUser}/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
