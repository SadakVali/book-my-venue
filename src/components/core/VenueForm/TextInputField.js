import React from "react";
import TextInputTag from "./TextInputTag";

const TextInputField = ({
  errors,
  register,
  label,
  inTagDisabledState,
  inTagsNamePlaceholderValueObject,
}) => {
  return (
    <label className="flex flex-col gap-4">
      <p
        className={`${
          label.length === 0 && "hidden"
        } text-[#949BA5] text-[1rem]`}
      >
        {label}
      </p>
      <div
        className={`${
          inTagsNamePlaceholderValueObject.length > 1 && "ml-4"
        } flex flex-col gap-y-3`}
      >
        <TextInputTag
          errors={errors}
          register={register}
          inTagDisabledState={inTagDisabledState}
          inTagsNamePlaceholderValueObject={inTagsNamePlaceholderValueObject}
        />
      </div>
    </label>
  );
};

export default TextInputField;
