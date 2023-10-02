import React, { useState } from "react";
import { ReactComponent as Tick } from "../../../assets/Icons/Tick.svg";

const TextInputField = ({
  errors,
  register,
  title,
  inTagDisabledState,
  inTagsNameLabelObject,
}) => {
  const [userInteractionArr, setUserInteractionArr] = useState(
    new Array(inTagsNameLabelObject.length).fill(false)
  );
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#949BA5] text-[1rem]">{title}</p>
      <div className="ml-4 flex flex-col gap-2">
        {inTagsNameLabelObject.map(({ inTagName, label }, index) => (
          <label
            key={index}
            htmlFor={inTagName}
            className="relative w-fit cursor-pointer flex justify-start 
              items-center gap-4"
            onClick={() =>
              setUserInteractionArr((prevState) => {
                const newStateArr = [...prevState];
                newStateArr[index] = !newStateArr[index];
                return newStateArr;
              })
            }
          >
            <input
              disabled={inTagDisabledState}
              type="checkbox"
              name={inTagName}
              value={userInteractionArr[index]}
              checked={userInteractionArr[index]}
              className="relative appearance-none w-[1.9rem] aspect-square 
                rounded-md bg-white"
              {...register(inTagName)}
            />
            <p
              className={`${
                errors[inTagName] ? "text-[#FD2727]" : "text-[#28374B]"
              } text-[1.25rem]`}
            >
              {label}
            </p>
            <div className="absolute left-[3px]">
              {userInteractionArr[index] && <Tick />}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TextInputField;
