import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { NavbarLinks } from "../../assets/data/NavbarLinks";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarFlag } from "../../slices/authSlice";
import { logout } from "../../services/operations/authAPI";

import { SiGnuprivacyguard } from "react-icons/si";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";

import { AiOutlineProfile } from "react-icons/ai";
import { BsDatabaseAdd } from "react-icons/bs";

const NavSidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigator = useNavigate();
  const matchRoute = (route) => matchPath({ path: route }, location.pathname);
  return (
    <div>
      {sidebar ? (
        <div
          className="fixed right-0 py-10 px-10 flex flex-col gap-y-6 bg-white 
          min-h-screen z-[100000] top-0 pr-20"
        >
          <Link to="#">
            <AiOutlineClose
              className="text-[1.75rem] text-[#BE52F2]"
              onClick={() => setSidebar(!sidebar)}
            />
          </Link>
          <nav>
            <ul className="flex flex-col gap-y-4 text-[1.125rem]">
              {NavbarLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="flex gap-x-2 items-center justify-start"
                  >
                    {item.icon}{" "}
                    <span
                      className={`text-[#4135F3] text-[1.25rem] ${
                        matchRoute(item.path) && "font-bold"
                      }`}
                    >
                      {item.text}
                    </span>
                  </Link>
                </li>
              ))}
              {token === null && (
                <Link to="/login" className="flex gap-x-2">
                  <FiLogIn className="text-[#2B47FC] text-[1.75rem]" />
                  <button
                    className={`text-[#4135F3] text-[1.25rem] ${
                      matchRoute("/login") && "font-bold"
                    }`}
                  >
                    LogIn
                  </button>
                </Link>
              )}
              {token === null && (
                <Link
                  to="/signup"
                  className={`flex gap-x-2 ${
                    matchRoute("/signup") && "font-bold"
                  }`}
                >
                  <SiGnuprivacyguard className="text-[#2B47FC] text-[1.75rem]" />
                  <button
                    onClick={() => {
                      dispatch(setSidebarFlag(true));
                    }}
                    className={`text-[#4135F3] text-[1.25rem]`}
                  >
                    SignUp
                  </button>
                </Link>
              )}
              {token && (
                <Link to="/venue-form" className="flex gap-x-2">
                  <AiOutlineProfile className="text-[#2B47FC] text-[1.75rem]" />
                  <p
                    className={`text-[#4135F3] text-[1.25rem] ${
                      matchRoute("/venue-form") && "font-bold"
                    }`}
                  >
                    Venue Details
                  </p>
                </Link>
              )}
              {token && (
                <Link
                  to="/dashboard/payment-due-today-bookings"
                  className="flex gap-x-2"
                >
                  <BsDatabaseAdd className="text-[#2B47FC] text-[1.75rem]" />
                  <p
                    className={`text-[#4135F3] text-[1.25rem] ${
                      matchRoute("/dashboard/payment-due-today-bookings") &&
                      "font-bold"
                    }`}
                  >
                    Dashboard
                  </p>
                </Link>
              )}
              {token && (
                <Link
                  to="/"
                  onClick={() => {
                    dispatch(logout(navigator));
                  }}
                  className="flex gap-x-2"
                >
                  <FiLogOut className="text-[#2B47FC] text-[1.75rem]" />
                  <span
                    className={`text-[#4135F3] text-[1.25rem] ${
                      matchRoute("/login") && "font-bold"
                    }`}
                  >
                    Logout
                  </span>
                </Link>
              )}
            </ul>
          </nav>
        </div>
      ) : (
        <Link>
          <FaBars
            className="text-[1.75rem] text-[#BE52F2]"
            onClick={() => setSidebar(!sidebar)}
          />
        </Link>
      )}
    </div>
  );
};

export default NavSidebar;
