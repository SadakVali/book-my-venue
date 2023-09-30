// import from packages
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";

// API related imports
import { login } from "../services/operations/authAPI";
import FirstFancyBTN from "../components/common/FirstFancyBTN";

const Login = () => {
  const { loading } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    contactNumber: "",
    password: "",
  });
  const { contactNumber, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (event) =>
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));

  const handleOnSubmit = (event) => {
    event.preventDefault();
    dispatch(login(contactNumber, password, navigate));
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <form
          onSubmit={handleOnSubmit}
          className="mt-6 flex w-full max-w-fit flex-col gap-y-4"
        >
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Contact Number <sup className="text6-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="contactNumber"
              value={contactNumber}
              onChange={handleOnChange}
              placeholder="Enter Contact Number"
              className="form-style w-full"
            />
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style w-full !pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            <Link to="/forgot-password">
              <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                Forgot Password
              </p>
            </Link>
          </label>
          <FirstFancyBTN text="Sign In" />
          {/* <button
            type="submit"
            className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
          >
            Sign In
          </button> */}
        </form>
      )}
    </div>
  );
};

export default Login;
