import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdHorizontalRule } from "react-icons/md";
import TextAreaInputField from "../components/core/VenueForm/TextAreaInputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const CustomerReciept = () => {
  const steps = [
    {
      id: 1,
      title: "Payment Initiated",
    },
    {
      id: 2,
      title: "Advance Paid",
    },
    {
      id: 3,
      title: "Payment Due",
    },
  ];
  const step = 2;

  const schema = yup.object({
    name: yup
      .string()
      .required("Function Hall Name is Required")
      .min(3, "Minimum 3 Characters Required")
      .trim(),
  });

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      summary:
        "Customer Requested to Postpone the Payment Due Date, by saying that He is out of Home Town Now. Next Reminder Date 19-11-2023.",
    },
  });

  return (
    <div
      className="my-16 w-11/12 mx-auto flex flex-col 
      justify-center gap-y-8 items-center"
    >
      {/* customer and function hall details */}
      <div className="w-[80%] flex justify-between items-end">
        {/* customer data */}
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
            Sadiq Vali
          </h1>
          <div className="flex gap-2">
            <p className="text-[1rem] font-montserrat">Personal Number : </p>
            <p className="text-[1rem] font-montserrat text-[#4135F3]">
              +91 8309157924
            </p>
          </div>
        </div>
        {/* function hall data */}
        <div className="flex flex-col justify-center items-end">
          <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
            KTR Function Hall
          </h1>
          <p className="text-[1rem] font-montserrat">
            Gooty Road, Near Market Yard
          </p>
          <div className="flex gap-2">
            <p className="text-[1rem] font-montserrat">Manager Number : </p>
            <p className="text-[1rem] font-montserrat text-[#4135F3]">
              +91 8309157924
            </p>
          </div>
        </div>
      </div>
      {/* Booking Status indicator */}
      <div className="w-[60%] flex justify-center items-center gap-2">
        <div
          className="rounded-full bg-[#4135F3] w-12 h-12 text-white text-[1.5rem]
          font-montserrat font-bold flex justify-center items-center relative"
        >
          <p>{steps[0].id}</p>
          <p
            className="absolute text-[#4135F3] text-[1rem] font-montserrat
            -bottom-8 whitespace-nowrap"
          >
            {steps[0].title}
          </p>
        </div>
        <div className="h-1 flex-grow border-dashed border-b-2 border-richblack-500"></div>
        <div
          className="rounded-full bg-[#4135F3] w-12 h-12 text-white text-[1.5rem]
          font-montserrat font-bold flex justify-center items-center relative"
        >
          <p>{steps[1].id}</p>
          <p
            className="absolute text-[#4135F3] text-[1rem] font-montserrat
            -bottom-8 whitespace-nowrap"
          >
            {steps[1].title}
          </p>
        </div>
        <div className="h-1 flex-grow border-dashed border-b-2 border-richblack-500"></div>
        <div
          className="rounded-full bg-[#949BA5] w-12 h-12 text-white text-[1.5rem]
          font-montserrat font-bold flex justify-center items-center relative"
        >
          <p>{steps[2].id}</p>
          <p
            className="absolute text-[#4135F3] text-[1rem] font-montserrat
            -bottom-8 whitespace-nowrap"
          >
            {steps[2].title}
          </p>
        </div>
      </div>
      {/* Booking information and customer followup summary */}
      <div className="flex mt-16 w-[80%] justify-between items-end gap-x-16">
        {/* Complete Booking Information */}
        <div className="flex flex-col gap-y-1 max-w-[550px]">
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Total Amount :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              300000/- INR
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Next Payment Due Date :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              16-11-2023
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Check In Time :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              3:00 PM one 16-12-2023
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Check Out Time :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              2:00 PM one 18-12-2023
            </p>
          </div>
          <p className="text-[1rem] font-inter leading-none mt-5">
            <b>NOTE : </b>If You Fail to Pay the Full payment Before this Date
            Without any Proper Reason, Your Booking Can be Cancelled by the
            Manager. Please Contact Manager and Discuss If you Need more Time.
          </p>
        </div>
        {/* customer followup summary */}
        <div className="flex flex-col gap-y-5 w-full justify-end">
          <p className="text-[1rem] font-inter leading-none">
            Summary of Last Payment Reminder Phone Call :
          </p>
          <div className="flex flex-col gap-y-6 relative">
            <textarea
              name={"summary"}
              placeholder={"Please Enter Customer response Summary here!"}
              className="bg-white rounded-xl p-4 w-full h-[8rem] outline-none
              overflow-y-auto resize-none focus:outline-none placeholder:text-[1rem] 
              placeholder:text-[#949BA5] text-[#4135F3] text-[1rem]"
              style={{
                boxShadow:
                  "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              {...register("summary")}
            />
            <img
              src="../../src/assets/Icons/Save.png"
              className="absolute bottom-4 right-4"
              loading="lazy"
            />
            {errors["summary"] && (
              <p className="text-[1rem] text-[#FD2727]">
                {errors["summary"].message}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* 3 action buttons on bookings */}
      <div></div>
    </div>
  );
};

export default CustomerReciept;
