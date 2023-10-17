// import packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import componnets
import SecondFancyBTN from "../../../common/SecondFancyBTN";
import TimePicker from "./TimePicker";

// import utility functions
import { formatDate } from "../../../../utils/utilities";

// redux related imports
import { setCheckIn, setCheckOut } from "../../../../slices/newBookingSlice";
import BookingCalendar from "../BookingCalendar";

const ManagerHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkIn, checkOut } = useSelector((state) => state.newBooking);

  const [dateRange, setDateRange] = useState(
    checkIn.date && checkOut.date ? [checkIn.date, checkOut.date] : []
  );

  const [checkInTime, setCheckInTime] = useState(
    checkIn.time ? checkIn.time : null
  );
  const [checkOutTime, setCheckOutTime] = useState(
    checkOut.time ? checkOut.time : null
  );

  const onClickHandler = () => {
    dispatch(setCheckIn({ date: formatDate(dateRange[0]), time: checkInTime }));
    dispatch(
      setCheckOut({ date: formatDate(dateRange[1]), time: checkOutTime })
    );
    navigate("/booking-info-form");
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col
      justify-center items-center gap-y-16"
    >
      <BookingCalendar setDateRange={(dateRange, setDateRange)} />
      {/* Check in & check time time pickers */}
      {dateRange.length > 0 && (
        <div className="flex gap-16">
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check In Time
            </p>
            <TimePicker setState={setCheckInTime} prevState={checkInTime} />
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check Out Time
            </p>
            <TimePicker setState={setCheckOutTime} prevState={checkOutTime} />
          </div>
        </div>
      )}
      <SecondFancyBTN text="Next" onClick={onClickHandler} />
    </div>
  );
};

export default ManagerHome;
