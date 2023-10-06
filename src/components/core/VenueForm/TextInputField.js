import React from "react";
import TextInputTag from "./TextInputTag";

const TextInputField = ({
  errors,
  register,
  getValues,
  label,
  inTagsNamePlaceholderObject,
}) => {
  return (
    <label className="flex flex-col gap-4">
      {label.length !== 0 && (
        <p className="text-[#949BA5] text-[1rem]">{label}</p>
      )}
      <div
        className={`flex flex-col gap-y-3 ${
          inTagsNamePlaceholderObject.length > 1 && "ml-4"
        }`}
      >
        <TextInputTag
          errors={errors}
          getValues={getValues}
          register={register}
          inTagsNamePlaceholderObject={inTagsNamePlaceholderObject}
        />
      </div>
    </label>
  );
};

export default TextInputField;
