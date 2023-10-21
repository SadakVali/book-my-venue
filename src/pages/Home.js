import { useSelector } from "react-redux";
import CustomerHome from "../components/core/Home/CustomerHome/CustomerHome";
import ManagerHome from "../components/core/Home/ManagerHome/ManagerHome";

const Home = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <div
      className="flex flex-col justify-center items-center w-11/12 max-w-maxContent 
      mx-auto my-16 gap-y-8 home-screen"
    >
      {token ? <ManagerHome /> : <CustomerHome />}
    </div>
  );
};

export default Home;
