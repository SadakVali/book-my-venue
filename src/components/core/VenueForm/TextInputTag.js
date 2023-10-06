import { ReactComponent as Tick } from "../../../assets/Icons/Tick.svg";

const TextInputTag = ({
  errors,
  register,
  getValues,
  inTagsNamePlaceholderObject,
}) =>
  inTagsNamePlaceholderObject.map(({ inTagName, inTagPlaceholder }, index) => (
    <div className="flex flex-col" key={index}>
      <div className="mr-4 flex justify-between items-center gap-4">
        <input
          required
          type="text"
          name={inTagName}
          placeholder={inTagPlaceholder}
          className="w-full bg-[#ECEFF4] border-none focus:border-none 
          focus:outline-none text-[#28374B] placeholder-[#28374B] text-[1.25rem]"
          {...register(inTagName)}
        />
        {!errors[inTagName] &&
          (getValues(inTagName) || getValues(inTagName) === 0) && <Tick />}
      </div>
      <div
        className={`h-[0.0625rem] ${
          errors[inTagName] ? "bg-[#FD2727]" : "bg-[#4135F3]"
        }`}
      ></div>
      {errors[inTagName] && (
        <p className="text-[1rem] text-[#FD2727]">
          {errors[inTagName].message}
        </p>
      )}
    </div>
  ));

export default TextInputTag;
