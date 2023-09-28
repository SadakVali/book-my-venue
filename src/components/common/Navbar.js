import React from "react";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/logo.png";
import { NavbarLinks } from "../../assets/data/navbar-links";
import ProfileDropDown from "../core/Auth/ProfileDropDown";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const matchRoute = (route) => matchPath({ path: route }, location.pathname);
  return (
    <div className="py-2 shadow">
      <div className="flex justify-between items-center w-11/12 max-w-maxContent mx-auto">
        {/* company Logo and name */}
        <Link to="/" className="flex items-center justify-center">
          <img src={logo} alt="Logo" loading="lazy" width={80} />
          <p className="text-gradient">
            BookMyVenue<sub>.</sub>
          </p>
        </Link>
        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link to={`${link.path}`}>
                  <p
                    className={`${
                      matchRoute(link?.path) && "font-bold"
                    } text-[#4135F3] text-[1.125rem]`}
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
              <button className="rounded-lg border px-4 py-2">LogIn</button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-lg border px-4 py-2">SignUp</button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
