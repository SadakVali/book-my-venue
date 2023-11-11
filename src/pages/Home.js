import { useSelector } from "react-redux";
import CustomerHome from "../components/core/Home/CustomerHome/CustomerHome";
import ManagerHome from "../components/core/Home/ManagerHome/ManagerHome";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { venue } = useSelector((state) => state.venue);
  useEffect(() => {
    if (!venue && token) {
      navigate("/venue-form");
      console.log("Entered but WTF");
    }
  }, []);
  return (
    <div
      className="flex flex-col justify-center items-center w-full sm:w-11/12 
      max-w-maxContent mx-auto my-16 gap-y-8 home-screen"
    >
      {token ? <ManagerHome /> : <CustomerHome />}
    </div>
  );
};

export default Home;
