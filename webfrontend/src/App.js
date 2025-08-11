import { Route, Routes } from "react-router-dom";
import Footer from "./pages/Fotter.jsx";
import Header from "./pages/Header.jsx";
import Main from "./pages/Main.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
