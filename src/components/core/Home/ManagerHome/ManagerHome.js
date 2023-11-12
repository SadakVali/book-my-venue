// import packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import componnets
import SecondFancyBTN from "../../../common/SecondFancyBTN";
import TimePicker from "./TimePicker";

// import utility functions
import {
  checkForConflict,
  formatDate,
  localToUnixTimestamp,
} from "../../../../utils/utilities";

// redux related imports
import { setCheckIn, setCheckOut } from "../../../../slices/newBookingSlice";
import BookingCalendar from "../BookingCalendar";
import toast from "react-hot-toast";

const ManagerHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { checkIn, checkOut } = useSelector((state) => state.newBooking);
  const [dateRange, setDateRange] = useState([]);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const { venueBookingsGivenMonth } = useSelector((state) => state.newBooking);

  const onClickHandler = () => {
    const unixTimeStamps = [];
    if (venueBookingsGivenMonth.length > 0) {
      for (const iter of venueBookingsGivenMonth) {
        const { checkInTime, checkOutTime } = iter; // unix time stamps
        unixTimeStamps.push([checkInTime, checkOutTime]);
      }
      const [di, mi, yi] = formatDate(dateRange[0]).split("/");
      const checkInUnixTime = localToUnixTimestamp(yi, mi, di, checkInTime);
      const [doo, mo, yo] = formatDate(dateRange[1]).split("/");
      const checkOutUnixTime = localToUnixTimestamp(yo, mo, doo, checkOutTime);
      if (
        checkForConflict([checkInUnixTime, checkOutUnixTime], unixTimeStamps)
      ) {
        toast.error("Booking Conflict Occured");
        return;
      }
    }
    dispatch(setCheckIn({ date: formatDate(dateRange[0]), time: checkInTime }));
    dispatch(
      setCheckOut({ date: formatDate(dateRange[1]), time: checkOutTime })
    );
    navigate("/booking-info-form");
  };

  return (
    <div
      className="min-h-[75vh] w-11/12 max-w-maxContentTab mx-auto flex flex-col
      justify-center items-center gap-y-16"
    >
      <BookingCalendar setDateRange={setDateRange} dateRange={dateRange} />
      {/* Check in & check time time pickers */}
      {dateRange && dateRange.length > 0 && (
        <div className="flex gap-16 flex-col sm:flex-row">
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check In Time
            </p>
            <TimePicker setState={setCheckInTime} />
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check Out Time
            </p>
            <TimePicker setState={setCheckOutTime} />
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
