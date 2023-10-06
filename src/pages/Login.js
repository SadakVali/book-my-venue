// import from packages
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";

// API related imports
import { login } from "../services/operations/authAPI";
import FirstFancyBTN from "../components/common/FirstFancyBTN";

import { ReactComponent as Tick } from "../assets/Icons/Tick.svg";
import { setSidebarFlag } from "../slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);
  const [tickFlagState, setTickFlagState] = useState(false);

  const [formData, setFormData] = useState({
    contactNumber: "",
    password: "",
  });
  const { contactNumber, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const isNaturalNumberWith10Digits = (input) => {
    // Check if the input is a string containing exactly 10 digits
    const digitRegex = /^\d{10}$/; // Regular expression for 10 digits
    return digitRegex.test(input);
  };

  const handleOnChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "contactNumber") {
      if (isNaturalNumberWith10Digits(event.target.value))
        setTickFlagState(true);
      else setTickFlagState(false);
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    dispatch(login(contactNumber, password, navigate));
    console.log("START");
    navigate("/venue-form");
    console.log("END");
  };

  return (
    <div className="my-auto grid place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <form onSubmit={handleOnSubmit} className="w-full max-w-fit">
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-6">
              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">
                  Contact Number
                </p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type="text"
                    name="contactNumber"
                    value={contactNumber}
                    onChange={handleOnChange}
                    placeholder="Enter Your Contact Number"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  {tickFlagState && <Tick />}
                </div>
                <div className="h-[0.0625rem] bg-[#4135F3]"></div>
              </label>

              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">Password</p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible fontSize={24} fill="#CB3EF9" />
                    ) : (
                      <AiOutlineEye fontSize={24} fill="#CB3EF9" />
                    )}
                  </span>
                </div>
                <div className="h-[0.0625rem] bg-[#4135F3]"></div>
              </label>
              <div className="flex justify-between items-center">
                <Link to="/forgot-password">
                  <p
                    className="font-inter text-[#2B47FC] text-base leading-normal 
                    font-normal"
                  >
                    Forgot Password?
                  </p>
                </Link>
                <Link onClick={() => dispatch(setSidebarFlag(true))}>
                  <p
                    className="font-inter text-[#2B47FC] text-base leading-normal 
                    font-normal"
                  >
                    Create Account?
                  </p>
                </Link>
              </div>
            </div>
            <FirstFancyBTN text="Sign In" />
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
