import React from "react";
import {
  convertHour24HourToAMPM,
  unixTimestampToLocal,
} from "../../../utils/utilities";
import { setCustomerRecieptId } from "../../../slices/customerSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const CustomerBookingDetailsCard = ({ bookingDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClick = () => {
    dispatch(setCustomerRecieptId(bookingDetails._id));
    navigate(`/customer-bookings/${bookingDetails._id}`);
  };
  const profileImgSrc = `https://api.dicebear.com/5.x/initials/svg?seed=${bookingDetails?.customerName}`;

  const unixAdjustment = (unixTime, type = "d") => {
    // console.log({ type });
    const [y, m, d, t] = unixTimestampToLocal(unixTime);
    if (type === "d")
      return [d < 10 ? `0${d}` : d, m < 10 ? `0${m}` : m, y].join("-");
    const res = convertHour24HourToAMPM(t);
    // console.log({ res });
    return res;
  };

  return (
    <div
      className="rounded-xl py-4 px-6 w-fit h-fit flex flex-col gap-y-3 
          justify-center items-start hover:cursor-pointer"
      style={{
        boxShadow:
          "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
      onClick={onClick}
    >
      <div
        className="flex gap-x-3 w-fit justify-start items-center border-b-2 
        pb-3 border-[#DEE1EF]"
      >
        <img
          src={profileImgSrc}
          alt={`profile-${bookingDetails?.customerName}`}
          loading="lazy"
          className="aspect-square w-[100px] rounded-full object-cover"
        />
        <div>
          <p className="font-montserrat font-semibold text-[1.125rem] text-[#4135F3]">
            {bookingDetails?.customerName}
          </p>
          <div className="text-[#4135F3] font-montserrat">
            <p>
              Paid {bookingDetails?.advancePaid} /{" "}
              <b>{bookingDetails?.totalAmount}</b>
            </p>
            <p>
              Next Due Date{" "}
              <b>{unixAdjustment(bookingDetails?.nextPaymentDueDate)}</b>
            </p>
          </div>
        </div>
      </div>
      <div className="font-montserrat text-[1rem]">
        <p>
          Personal Number :{" "}
          <span className="text-[#4135F3]">
            +91 {bookingDetails.customerContactNumber}
          </span>
        </p>
        <p>
          Check In Time :{" "}
          <span className="text-[#4135F3]">
            {unixAdjustment(bookingDetails?.checkInTime, "t")} on{" "}
            {unixAdjustment(bookingDetails?.checkInTime)}
          </span>
        </p>
        <p>
          Check Out Time :{" "}
          <span className="text-[#4135F3]">
            {unixAdjustment(bookingDetails?.checkOutTime, "t")} on{" "}
            {unixAdjustment(bookingDetails?.checkOutTime)}
          </span>
        </p>
        <p>
          Booking Status :{" "}
          <span className="text-[#4135F3]">{bookingDetails.bookingStatus}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerBookingDetailsCard;
