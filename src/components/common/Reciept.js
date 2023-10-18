// imports from packages
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

// assets
import { ReactComponent as Save } from "../../assets/Icons/Save.svg";
import { BOOKING_STATUS } from "../../utils/constants";

// utility functions
import { unixAdjustment } from "../../utils/utilities";

// API call related
import { updatePaymentSummary } from "../../services/operations/dashboardAPI";

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

const schema = yup.object({
  paymentSummary: yup
    .string()
    .required("Summary is Required")
    .min(50, "Minimum 50 Characters Required")
    .trim(),
});

const Reciept = ({ customerReciept, setSummaryStateInRedux }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  // console.log({ customerReciept });

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
      bookingId: customerReciept?._id,
      paymentSummary: customerReciept?.paymentSummary,
    },
  });

  const onSubmit = (data) => {
    dispatch(updatePaymentSummary(data, token));
    dispatch(
      setSummaryStateInRedux({
        id: customerReciept?._id,
        paymentSummary: data.paymentSummary,
      })
    );
  };

  return (
    <>
      {/* customer and function hall details */}
      <div className="w-[90%] flex justify-between items-end">
        {/* customer data */}
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
            {customerReciept.customerName}
          </h1>
          <div className="flex gap-2">
            <p className="text-[1rem] font-montserrat">Personal Number : </p>
            <p className="text-[1rem] font-montserrat text-[#4135F3]">
              +91 {customerReciept.customerContactNumber}
            </p>
          </div>
        </div>
        {/* function hall data */}
        <div className="flex flex-col justify-center items-end">
          <h1 className="text-gradient text-[2rem] w-fit !font-['Open_Sans']">
            {customerReciept.venueName}
          </h1>
          <p className="text-[1rem] font-montserrat">
            {customerReciept.venueAddress}
          </p>
          <div className="flex gap-2">
            <p className="text-[1rem] font-montserrat">Manager Number : </p>
            <p className="text-[1rem] font-montserrat text-[#4135F3]">
              +91 {customerReciept.managerContactNumber}
            </p>
          </div>
        </div>
      </div>
      {/* Booking Status indicator */}
      <div className="w-[75%] -mt-8 flex justify-center items-center gap-2">
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
          <div className="absolute -bottom-[3.5rem] flex justify-center items-center flex-col">
            <p
              className=" text-[#4135F3] text-[1rem] font-montserrat
              whitespace-nowrap"
            >
              {`${steps[1].title} ${customerReciept.advancePaid.toLocaleString(
                "en-IN"
              )}/- INR`}
            </p>
            <p
              className="text-[#4135F3] text-[1rem] font-montserrat
              whitespace-nowrap"
            >
              {unixAdjustment(customerReciept?.advancePaidOn)}
            </p>
          </div>
        </div>
        <div className="h-1 flex-grow border-dashed border-b-2 border-richblack-500"></div>
        <div
          className={`rounded-full w-12 h-12 text-white text-[1.5rem]
          font-montserrat font-bold flex justify-center items-center relative 
          ${
            BOOKING_STATUS.ADVANCE_PAID === customerReciept.bookingStatus
              ? "bg-[#949BA5]"
              : "bg-[#4135F3]"
          }`}
        >
          <p>{steps[2].id}</p>
          <div
            className={`absolute flex justify-center items-center 
            flex-col ${
              BOOKING_STATUS.BOOKED === customerReciept.bookingStatus ||
              BOOKING_STATUS.ADVANCE_PAID === customerReciept.bookingStatus
                ? "-bottom-[3.5rem]"
                : "-bottom-8"
            }`}
          >
            <p
              className="text-[#4135F3] text-[1rem] font-montserrat
              whitespace-nowrap"
            >
              {BOOKING_STATUS.ADVANCE_PAID === customerReciept.bookingStatus
                ? "Payment Due"
                : customerReciept.bookingStatus}
            </p>
            {BOOKING_STATUS.BOOKED === customerReciept.bookingStatus && (
              <p
                className="text-[#4135F3] text-[1rem] font-montserrat
                whitespace-nowrap"
              >
                {unixAdjustment(customerReciept?.fullyPaidDate)}
              </p>
            )}
            {BOOKING_STATUS.ADVANCE_PAID === customerReciept.bookingStatus && (
              <p
                className="text-[#4135F3] text-[1rem] font-montserrat
                whitespace-nowrap"
              >
                {unixAdjustment(customerReciept?.nextPaymentDueDate)}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Booking information and customer followup summary */}
      <div className="flex w-[90%] justify-between items-end gap-x-16">
        {/* Complete Booking Information */}
        <div className="flex flex-col gap-y-1 justify-between max-w-[520px]">
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Total Amount :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              {customerReciept.totalAmount.toLocaleString("en-IN")}/- INR
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Next Payment Due Date :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              {unixAdjustment(customerReciept?.nextPaymentDueDate)}
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Check In Time :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              {unixAdjustment(customerReciept?.checkInTime, "t")} on{" "}
              {unixAdjustment(customerReciept?.checkInTime)}
            </p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-[1rem] font-inter leading-none">
              Check Out Time :
            </p>
            <p className="text-[1rem] font-inter text-[#4135F3] leading-none">
              {unixAdjustment(customerReciept?.checkOutTime, "t")} on{" "}
              {unixAdjustment(customerReciept?.checkOutTime)}
            </p>
          </div>
          <p className="text-[1rem] font-inter leading-tight mt-5">
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
          <form
            className="flex flex-col gap-y-6 relative"
            onSubmit={handleSubmit(onSubmit)}
          >
            <textarea
              name={"paymentSummary"}
              onFocus={() => trigger("paymentSummary")}
              placeholder={"Please Enter Customer response Summary here!"}
              className="bg-white rounded-xl p-4 w-full h-[8rem] outline-none
              overflow-y-auto resize-none focus:outline-none placeholder:text-[1rem] 
              placeholder:text-[#949BA5] text-[#4135F3] text-[1rem]"
              style={{
                boxShadow:
                  "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              {...register("paymentSummary")}
            />
            {token && (
              <button
                type="submit"
                className="absolute bottom-4 right-4 bg-white z-[1000] 
                hover:scale-110 duration-200"
              >
                <Save />
              </button>
            )}
            {errors["paymentSummary"] && (
              <p className="text-[1rem] text-[#FD2727] absolute -bottom-10 left-2">
                {errors["paymentSummary"].message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Reciept;
