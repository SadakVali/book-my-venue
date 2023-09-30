import React, { useRef, useState } from "react";
import FirstFancyBTN from "./FirstFancyBTN";
import { setSidebarFlag } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const SignupSidebar = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [step2, setStep2] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => {
    dispatch(setSidebarFlag(false));
    setStep2(false);
  });
  return !step2 ? (
    <div
      className="flex flex-col items-center gap-y-4 fixed right-[0%] top-[50%] 
      -translate-y-[50%] bg-richblack-5 px-4 min-h-screen justify-center
      z-[1000]"
      ref={ref}
    >
      <p className="text-gradient w-fit text-[6rem]">
        Are You a<sub>.</sub>
      </p>
      <div className="flex items-center gap-x-8">
        <FirstFancyBTN
          text="Function Hall Customer ?"
          onClick={() => setStep2(true)}
        />
        <p className="text-gradient w-fit text-[6rem]">
          <sub>.</sub>OR<sub>...</sub>
        </p>
        <FirstFancyBTN
          text="Function Hall Manager ?"
          onClick={() => {
            navigator("/signup");
            dispatch(setSidebarFlag(false));
          }}
        />
      </div>
    </div>
  ) : (
    <div
      className="gap-y-4 fixed right-[0%] top-[50%] -translate-y-[50%] 
      bg-richblack-5 px-4 min-h-screen z-[1000] flex flex-col items-center 
        justify-center"
      ref={ref}
    >
      <div
        className="text-gradient w-fit text-[4rem] flex flex-col items-center 
        justify-center !font-accent"
      >
        <p>You Don't Need to</p>
        <p>LogIn / SignUp</p>
        <p>to Use Our Platform</p>
      </div>
    </div>
  );
};

export default SignupSidebar;
