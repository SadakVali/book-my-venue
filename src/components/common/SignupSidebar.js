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

  return (
    <div
      className="flex flex-col items-center gap-y-16 bg-[#E2E5EA] px-4 
      min-h-screen justify-center absolute min-w-full z-[10000]"
    >
      <p className="text-gradient w-fit text-[5rem]">
        Are You a<sub>.</sub>
      </p>
      <div className="flex flex-col items-center gap-y-8 w-full">
        <FirstFancyBTN
          text="Customer?"
          onClick={() => {
            navigator("/");
            dispatch(setSidebarFlag(false));
          }}
        />
        <p className="text-gradient w-fit text-[5rem]">
          <sub>.</sub>OR<sub>...</sub>
        </p>
        <FirstFancyBTN
          text="Manager?"
          onClick={() => dispatch(setSidebarFlag(false))}
        />
      </div>
    </div>
  );
};

export default SignupSidebar;
