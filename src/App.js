// import css
import "./App.css";

// import from packages
import { Routes, Route } from "react-router-dom";

// import components
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";

const App = () => (
  <div className="w-screen min-h-screen flex flex-col">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </div>
);

export default App;
