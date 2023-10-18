// import packages
import React, { useEffect, useState } from "react";
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
  // const { checkIn, checkOut } = useSelector((state) => state.newBooking);
  const [dateRange, setDateRange] = useState([]);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // useEffect(() => {
  //   if (checkIn.date && checkOut.date)
  //     setDateRange([checkIn.date, checkOut.date]);
  //   if (checkIn.time) setCheckInTime(checkIn.time);
  //   if (checkOut.time) setCheckOutTime(checkOut.time);
  // }, []);

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
      <BookingCalendar setDateRange={setDateRange} dateRange={dateRange} />
      {/* Check in & check time time pickers */}
      {dateRange && dateRange.length > 0 && (
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
      <div
        className={`${
          checkInTime !== null && checkOutTime !== null
            ? ""
            : "pointer-events-none opacity-50"
        } `}
      >
        <SecondFancyBTN text="Next" onClick={onClickHandler} />
      </div>
    </div>
  );
};

export default ManagerHome;
