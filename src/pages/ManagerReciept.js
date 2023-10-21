import React, { useEffect } from "react";
import {
  cancelSingleBooking,
  changeStatusToBooked,
  fetchPaymentsDueTodayBookings,
} from "../services/operations/dashboardAPI";

import { useDispatch, useSelector } from "react-redux";

import Reciept from "../components/common/Reciept";
import { BOOKING_STATUS } from "../utils/constants";
import SecondFancyBTN from "../components/common/SecondFancyBTN";

import { setBookingStatus, setBookingSummary } from "../slices/dashboardSlice";

import { ReactComponent as ColorArrowRight } from "../assets/Icons/ColorArrowRight.svg";

import { setIndex } from "../slices/dashboardSlice";

const ManagerReciept = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { paymentDueToadyBookings, index } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    if (token) dispatch(fetchPaymentsDueTodayBookings(token));
  }, []);

  const onCancel = () => {
    dispatch(
      cancelSingleBooking(
        { bookingId: paymentDueToadyBookings[index]._id },
        token
      )
    );
    dispatch(
      setBookingStatus({
        id: paymentDueToadyBookings[index]._id,
        status: BOOKING_STATUS.CANCELLED,
      })
    );
  };

  const onBook = () => {
    dispatch(
      changeStatusToBooked(
        { bookingId: paymentDueToadyBookings[index]._id },
        token
      )
    );
    dispatch(
      setBookingStatus({
        id: paymentDueToadyBookings[index]._id,
        status: BOOKING_STATUS.BOOKED,
      })
    );
  };

  const showPreviousReciept = () => {
    if (index > 0) dispatch(setIndex(-1));
  };

  const showNextReciept = () => {
    if (index < paymentDueToadyBookings.length - 1) dispatch(setIndex(1));
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContent mx-auto flex flex-col justify-center 
      gap-y-24 items-center"
    >
      {paymentDueToadyBookings && (
        <Reciept
          customerReciept={paymentDueToadyBookings[index]}
          setSummaryStateInRedux={setBookingSummary}
        />
      )}
      {paymentDueToadyBookings && (
        <div className="flex justify-around items-center w-[100%]">
          <ColorArrowRight
            onClick={showPreviousReciept}
            className={`cursor-pointer rotate-180 active:scale-90 h-[3.5rem] 
            w-[3.5rem] ${index === 0 && "opacity-20 pointer-events-none"}`}
          />
          <div className="flex gap-x-12">
            {BOOKING_STATUS.CANCELLED !==
              paymentDueToadyBookings[index].bookingStatus && (
              <SecondFancyBTN text="Mark Cancelled" onClick={onCancel} />
            )}
            {BOOKING_STATUS.BOOKED !==
              paymentDueToadyBookings[index].bookingStatus && (
              <SecondFancyBTN text="Mark Booked" onClick={onBook} />
            )}
          </div>
          <ColorArrowRight
            onClick={showNextReciept}
            className={`cursor-pointer active:scale-90 h-[3.5rem] w-[3.5rem] ${
              index === paymentDueToadyBookings.length - 1 &&
              "opacity-20 pointer-events-none"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerReciept;
