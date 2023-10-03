import React from "react";

import { ReactComponent as RightArrow } from "../../assets/Icons/RightArrow.svg";

const FirstFancyBTN = ({ text, onClick }) => {
  return (
    <button
      className="bg-[#4960F9] text-white rounded-3xl h-[5.25rem] text-[1.25rem]
      flex items-center justify-center relative gap-4 hover:cursor-pointer min-w-[24rem]
      overflow-hidden px-8 max-w-fit text-2xl"
      style={{ boxShadow: "8px 8px 8px 0px rgba(27, 57, 255, 0.20)" }}
      onClick={onClick}
      type="submit"
    >
      <p className="font-montserrat">{text}</p>
      <RightArrow />
      <div
        className="w-[9rem] aspect-square absolute rounded-full 
        right-0 top-0 translate-x-[40%] -translate-y-[80%] bg-gradient-to-t 
        from-[#C72FF8] to-[#C72FF800]"
      ></div>
      <div
        className="w-[9rem] aspect-square absolute rounded-full 
        right-0 top-0 translate-x-[68%] -translate-y-[70%] bg-[#3AF9EF]"
      ></div>
    </button>
  );
};

export default FirstFancyBTN;
