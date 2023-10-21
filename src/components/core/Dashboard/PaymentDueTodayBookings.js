import React, { useEffect } from "react";
import { fetchPaymentsDueTodayBookings } from "../../../services/operations/dashboardAPI";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { unixAdjustment } from "../../../utils/utilities";

import { setIndex } from "../../../slices/dashboardSlice";

const PaymentDueTodayBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { paymentDueToadyBookings } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (token) dispatch(fetchPaymentsDueTodayBookings(token));
  }, []);

  const onClick = (booking) => {
    for (let i = 0; i < paymentDueToadyBookings.length; i++) {
      if (paymentDueToadyBookings[i]._id === booking._id) {
        dispatch(setIndex(i));
        break;
      }
    }
    navigate(`/dashboard/payment-due-today-bookings/${booking._id}`);
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContent mx-auto flex gap-x-6 flex-wrap justify-center 
      gap-y-24 items-center"
    >
      {paymentDueToadyBookings &&
        paymentDueToadyBookings.map((booking) => (
          <div
            key={booking._id}
            className="rounded-xl py-4 px-6 w-fit h-fit flex flex-col gap-y-3 
            justify-center items-start hover:cursor-pointer"
            style={{
              boxShadow:
                "-4px -4px 4px 0px rgba(0, 0, 0, 0.25), 4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            onClick={() => onClick(booking)}
          >
            <div
              className="flex gap-x-3 w-fit justify-start items-center border-b-2 
              pb-3 border-[#DEE1EF]"
            >
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${booking?.customerName}`}
                alt={`profile-${booking?.customerName}`}
                loading="lazy"
                className="aspect-square w-[100px] rounded-full object-cover"
              />
              <div>
                <p className="font-montserrat font-semibold text-[1.125rem] text-[#4135F3]">
                  {booking?.customerName}
                </p>
                <div className="text-[#4135F3] font-montserrat">
                  <p>
                    Paid {booking?.advancePaid.toLocaleString("en-IN")} /{" "}
                    <b>{booking?.totalAmount.toLocaleString("en-IN")}</b>
                  </p>
                  <p>
                    Next Due Date{" "}
                    <b>{unixAdjustment(booking?.nextPaymentDueDate)}</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="font-montserrat text-[1rem]">
              <p>
                Personal Number :{" "}
                <span className="text-[#4135F3]">
                  +91 {booking.customerContactNumber}
                </span>
              </p>
              <p>
                Check In Time :{" "}
                <span className="text-[#4135F3]">
                  {unixAdjustment(booking?.checkInTime, "t")} on{" "}
                  {unixAdjustment(booking?.checkInTime)}
                </span>
              </p>
              <p>
                Check Out Time :{" "}
                <span className="text-[#4135F3]">
                  {unixAdjustment(booking?.checkOutTime, "t")} on{" "}
                  {unixAdjustment(booking?.checkOutTime)}
                </span>
              </p>
              <p>
                Booking Status :{" "}
                <span className="text-[#4135F3]">{booking.bookingStatus}</span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PaymentDueTodayBookings;
