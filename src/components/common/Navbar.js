import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/logo.png";
import { NavbarLinks } from "../../assets/data/NavbarLinks";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { setSidebarFlag } from "../../slices/authSlice";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const matchRoute = (route) => matchPath({ path: route }, location.pathname);
  const dispatch = useDispatch();
  return (
    <div className="py-2 shadow bg-[#E2E5EA]">
      <div className="flex justify-between items-center w-11/12 max-w-maxContent mx-auto">
        {/* company Logo and name */}
        <Link to="/" className="flex items-center justify-center">
          <img src={logo} alt="Logo" loading="lazy" width={80} />
          <p className="text-gradient text-[4rem]">
            BookMyVenue<sub>.</sub>
          </p>
        </Link>
        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link to={`${link.path}`}>
                  <p
                    className={`${
                      matchRoute(link?.path) && "font-bold"
                    } text-[#4135F3] text-[1.125rem] font-inter`}
                  >{`${link.text}`}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Login, Signup, Dashboard */}
        <div className="hidden md:flex items-center gap-x-4 text-[#4135F3]">
          {token === null && (
            <Link to="/login">
              <button
                className={`${
                  matchRoute("/login") && "font-bold bg-[#ECEFF4]"
                } rounded-lg border px-4 py-2 hover:bg-[#ECEFF4]`}
              >
                <p>LogIn</p>
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button
                className={`${
                  matchRoute("/signup") && "font-bold bg-[#ECEFF4]"
                } rounded-lg border px-4 py-2 hover:bg-[#ECEFF4]`}
                onClick={() => {
                  dispatch(setSidebarFlag(true));
                }}
              >
                <p>SignUp</p>
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
