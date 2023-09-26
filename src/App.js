// import css
import "./App.css";

// import from packages
import { Routes, Route } from "react-router-dom";

// import components
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Error from "./pages/Error";
import OpenRoute from "./components/core/Auth/OpenRoute";

const App = () => (
  <div className="w-screen min-h-screen flex flex-col">
    <Navbar />
    <Routes>
      <Route
        path="login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />
      <Route path="signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Error />} />
    </Routes>
  </div>
);

export default App;
