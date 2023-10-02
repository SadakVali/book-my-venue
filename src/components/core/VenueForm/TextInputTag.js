import React, { useState } from "react";
import { ReactComponent as Tick } from "../../../assets/Icons/Tick.svg";

const TextInputTag = ({
  errors,
  register,
  inTagDisabledState,
  inTagsNamePlaceholderObject,
}) => {
  const [userInteractionArr, setUserInteractionArr] = useState(
    new Array(inTagsNamePlaceholderObject.length).fill(false)
  );
  return inTagsNamePlaceholderObject.map(
    ({ inTagName, inTagPlaceholder }, index) => (
      <div className="flex flex-col" key={index}>
        <div className="mr-4 flex justify-between items-center gap-4">
          <input
            required
            onChangeCapture={() =>
              setUserInteractionArr((prevState) => {
                const newStateArr = [...prevState];
                newStateArr[index] = true;
                return newStateArr;
              })
            }
            disabled={inTagDisabledState}
            type="text"
            name={inTagName}
            placeholder={inTagPlaceholder}
            className="w-full !bg-[#ECEFF4] border-nonefocus:border-none 
            focus:outline-none text-[#28374B] placeholder-[#28374B] 
            text-[1.25rem]"
            {...register(inTagName)}
            style={{ backgroundColor: "#ECEFF4" }}
          />
          {!errors[inTagName] && userInteractionArr[index] && <Tick />}
        </div>
        <div
          className={`${
            errors[inTagName] ? "bg-[#FD2727]" : "bg-[#4135F3]"
          } h-[0.0625rem]`}
        ></div>
        {errors[inTagName] && (
          <p className="text-[1rem] text-[#FD2727]">
            {errors[inTagName].message}
          </p>
        )}
      </div>
    )
  );
};

export default TextInputTag;
