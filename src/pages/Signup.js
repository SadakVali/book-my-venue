// import from packages
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import FirstFancyBTN from "../components/common/FirstFancyBTN";
import { ReactComponent as Tick } from "../assets/Icons/Tick.svg";
import { signup } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameTickFlagState, setNameTickFlagState] = useState(false);

  const [isValidContactNum, setIsValidContactNum] = useState(false);
  const [isContactNumMatching, setIsContactNumMatching] = useState(false);

  const [isPasswordMatching, setIsPasswordMatching] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    confirmContactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const {
    name,
    contactNumber,
    confirmContactNumber,
    password,
    confirmPassword,
  } = formData;

  const isNaturalNumberWith10Digits = (input) => {
    // Check if the input is a string containing exactly 10 digits
    const digitRegex = /^\d{10}$/; // Regular expression for 10 digits
    return digitRegex.test(input);
  };

  // handle input fields, when some value changes
  const handleOnChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "name") {
      if (event.target.value.length > 2) setNameTickFlagState(true);
      else setNameTickFlagState(false);
    }
    if (event.target.name === "password") {
      if (confirmPassword === event.target.value) setIsPasswordMatching(true);
      else setIsPasswordMatching(false);
      if (event.target.value.length >= 6) setIsPasswordStrong(true);
      else setIsPasswordStrong(false);
    }
    if (event.target.name === "confirmPassword") {
      if (password === event.target.value) setIsPasswordMatching(true);
      else setIsPasswordMatching(false);
    }
    if (event.target.name === "contactNumber") {
      if (isNaturalNumberWith10Digits(event.target.value))
        setIsValidContactNum(true);
      else setIsValidContactNum(false);
      if (confirmContactNumber === event.target.value)
        setIsContactNumMatching(true);
      else setIsContactNumMatching(false);
    }
    if (event.target.name === "confirmContactNumber") {
      if (contactNumber === event.target.value) setIsContactNumMatching(true);
      else setIsContactNumMatching(false);
    }
  };

  // handle form submission
  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (contactNumber !== confirmContactNumber) {
      toast.error("Contact Numbers do not match");
      return;
    }
    // Make an API call to store the formData to the DB
    dispatch(signup(name, contactNumber, password, navigate));
    // reset form
    setFormData({
      name: "",
      contactNumber: "",
      confirmContactNumber: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handlePaste = (e) => e.preventDefault();

  return (
    <div className="grid my-auto place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <form onSubmit={handleOnSubmit} className="w-full max-w-fit m-4">
          <div className="flex flex-col gap-y-14">
            <div className="flex flex-col gap-y-6">
              <label>
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">Full Name</p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleOnChange}
                    placeholder="Enter Your Full Name"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  {nameTickFlagState && <Tick />}
                </div>
                <div className="h-[0.5px] bg-[#4135F3]"></div>
              </label>

              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">
                  Contact Number
                </p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type="text"
                    name="contactNumber"
                    onPaste={handlePaste}
                    value={contactNumber}
                    onChange={handleOnChange}
                    placeholder="Enter Your Contact Number"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  {isContactNumMatching &&
                    confirmContactNumber &&
                    isValidContactNum && <Tick />}
                </div>
                <div className="h-[0.5px] bg-[#4135F3]"></div>
              </label>

              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">
                  Confirm Contact Number
                </p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type="text"
                    name="confirmContactNumber"
                    onPaste={handlePaste}
                    value={confirmContactNumber}
                    onChange={handleOnChange}
                    placeholder="Confirm Your Contact Number"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  {isContactNumMatching &&
                    contactNumber &&
                    isValidContactNum && <Tick />}
                </div>
                <div className="h-[0.5px] bg-[#4135F3]"></div>
              </label>

              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">Password</p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onPaste={handlePaste}
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
                  {isPasswordMatching &&
                    confirmPassword &&
                    isPasswordStrong && <Tick />}
                </div>
                <div className="h-[0.5px] bg-[#4135F3]"></div>
              </label>

              <label className="w-full">
                <p className="mb-3 text-[1.25rem] text-[#949BA5]">
                  Confirm Password
                </p>
                <div className="mb-2 mr-4 flex justify-between items-center gap-4">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onPaste={handlePaste}
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm Password"
                    className="w-full bg-transparent border-nonefocus:border-none 
                    focus:outline-none text-[#28374B] placeholder-[#28374B] 
                    text-[1.23rem]"
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible fontSize={24} fill="#CB3EF9" />
                    ) : (
                      <AiOutlineEye fontSize={24} fill="#CB3EF9" />
                    )}
                  </span>
                  {isPasswordMatching && password && isPasswordStrong && (
                    <Tick />
                  )}
                </div>
                <div className="h-[0.5px] bg-[#4135F3]"></div>
              </label>
            </div>
            <FirstFancyBTN text="Sign Up" />
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
