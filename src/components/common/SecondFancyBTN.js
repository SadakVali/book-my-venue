import React from "react";

import { ReactComponent as RightArrow } from "../../assets/Icons/RightArrow.svg";

const SecondFancyBTN = ({ text, onClick }) => {
  return (
    <button
      className="bg-[#4960F9] text-white rounded-3xl h-[5.25rem] text-[1.25rem]
      flex items-center justify-center relative gap-4 cursor-pointer min-w-[20rem]
      overflow-hidden px-8 max-w-fit text-2xl"
      style={{ boxShadow: "8px 8px 8px 0px rgba(27, 57, 255, 0.20)" }}
      onClick={onClick}
      type="submit"
    >
      <p className="font-montserrat font-semibold z-[1000]">{text}</p>
      <RightArrow className="z-[1000]" />
      <div
        className="w-[9rem] aspect-square absolute rounded-full 
        right-0 bottom-0 translate-x-[30%] translate-y-[65%] bg-gradient-to-t 
        from-[#C72FF800] to-[#C72FF8] z-0"
      ></div>
      <div
        className="w-[9rem] aspect-square absolute rounded-full 
        left-0 top-0 -translate-x-[30%] -translate-y-[65%] bg-[#3AF9EF] z-0"
      ></div>
    </button>
  );
};

export default SecondFancyBTN;
