import { AiFillHome } from "react-icons/ai";
import { IoIosPaper } from "react-icons/io";
import { SiCloudfoundry } from "react-icons/si";

export const NavbarLinks = [
  {
    text: "Home",
    path: "/",
    icon: <AiFillHome className="text-[#2B47FC] text-[1.75rem]" />,
  },
  {
    text: "Fetch Receipt",
    path: "/customer-bookings",
    icon: <IoIosPaper className="text-[#2B47FC] text-[1.75rem]" />,
  },
  {
    text: "About Us",
    path: "/about",
    icon: <SiCloudfoundry className="text-[#2B47FC] text-[1.75rem]" />,
  },
  // {
  //   text: "Contact Us",
  //   path: "/contact",
  // },
];
