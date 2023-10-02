import React from "react";
import TextInputTag from "./TextInputTag";

const TextInputField = ({
  errors,
  register,
  label,
  inTagDisabledState,
  inTagsNamePlaceholderObject,
}) => {
  return (
    <label className="flex flex-col gap-4">
      <p className="text-[#949BA5] text-[1rem]">{label}</p>
      <div
        className={`${
          inTagsNamePlaceholderObject.length > 1 && "ml-4"
        } flex flex-col gap-y-3`}
      >
        <TextInputTag
          errors={errors}
          register={register}
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderObject={inTagsNamePlaceholderObject}
        />
      </div>
    </label>
  );
};

export default TextInputField;
