import React from "react";

const TextAreaInputField = ({ register, errors, label, name, placeholder }) => {
  return (
    <div className="flex flex-col gap-y-6">
      <p className="text-[#949BA5] text-[1rem]">{label}</p>
      <textarea
        name={name}
        placeholder={placeholder}
        className="bg-white rounded-xl p-4 w-full h-[10rem] outline-none
        overflow-y-auto resize-none focus:outline-none placeholder:text-[1rem] 
        placeholder:text-[#949BA5] text-[#28374B] text-[1.25rem]"
        style={{
          boxShadow:
            "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-[1rem] text-[#FD2727]">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextAreaInputField;
