// import packages
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

// import componnets
import SecondFancyBTN from "../components/common/SecondFancyBTN";

// import utility functions
import {
  formatDate,
  generateBookingStatusOfEachDay,
  generateStartingAndEndingUnixTimeStamps,
  convertHour24HourToAMPM,
} from "../utils/utilities";

// import css
import "react-calendar/dist/Calendar.css";
import "./ManagerHome.css";
import { bookingsOfVenueGivenMonth } from "../services/operations/bookingsAPI";
import { useDispatch, useSelector } from "react-redux";
import TimePicker from "../components/core/ManagerHome/TimePicker";

// define the component level constants
let oneTime = true;

const ManagerHome = () => {
  const [dateRange, setDateRange] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [bookingStatus, setBookingStatus] = useState([]);

  const dispatch = useDispatch();
  const { venue } = useSelector((state) => state.venue);
  const { token } = useSelector((state) => state.auth);
  const { venueBookingsGivenMonth } = useSelector((state) => state.newBooking);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const { startingUnixTimeStamp, endingUnixTimeStamp } =
        generateStartingAndEndingUnixTimeStamps(selectedMonth, selectedYear);
      dispatch(
        bookingsOfVenueGivenMonth({
          venueId: venue._id,
          startingUnixTimeStamp,
          endingUnixTimeStamp,
          token,
        })
      );
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (venueBookingsGivenMonth.length) {
      const unixTimeStamps = [];
      for (const iter of venueBookingsGivenMonth) {
        const { checkInTime, checkOutTime } = iter;
        unixTimeStamps.push([checkInTime, checkOutTime]);
      }
      console.log({ unixTimeStamps });
      generateBookingStatusOfEachDay(
        selectedMonth,
        selectedYear,
        unixTimeStamps,
        setBookingStatus
      );
    }
  }, [venueBookingsGivenMonth]);

  useEffect(() => {
    // Select the previous and next buttons when the component mounts
    const prevBTN = document.querySelector(
      ".react-calendar__navigation__prev-button"
    );
    const nextBTN = document.querySelector(
      ".react-calendar__navigation__next-button"
    );

    if (!selectedMonth || !selectedYear) {
      prevBTN.classList.add("disable-button");
      nextBTN.classList.add("disable-button");
    } else if (oneTime) {
      prevBTN.classList.remove("disable-button");
      nextBTN.classList.remove("disable-button");
      setCurrentMonth(selectedMonth);
    }

    // Function to handle click on previous button
    const handlePrevClick = () => {
      oneTime = false;
      if (currentMonth === selectedMonth) {
        prevBTN.classList.add("disable-button");
        setCurrentMonth(currentMonth - 1);
      } else if (currentMonth === selectedMonth + 1) {
        setCurrentMonth(currentMonth - 1);
        nextBTN.classList.remove("disable-button");
      }
    };

    // Function to handle click on next button
    const handleNextClick = () => {
      oneTime = false;
      if (currentMonth === selectedMonth) {
        nextBTN.classList.add("disable-button");
        setCurrentMonth(currentMonth + 1);
      } else if (currentMonth === selectedMonth - 1) {
        setCurrentMonth(currentMonth + 1);
        prevBTN.classList.remove("disable-button");
      }
    };

    // Add event listeners
    prevBTN.addEventListener("click", handlePrevClick);
    nextBTN.addEventListener("click", handleNextClick);

    // Remove event listeners when component unmounts
    return () => {
      prevBTN.removeEventListener("click", handlePrevClick);
      nextBTN.removeEventListener("click", handleNextClick);
    };
  }, [selectedMonth, currentMonth, selectedYear]);

  const isLeftSideBooked = (date) =>
    bookingStatus[formatDate(date)][0] !== null;
  const isRightSideBooked = (date) =>
    bookingStatus[formatDate(date)][2] !== null;
  const isMiddleBooked = (date) =>
    bookingStatus[formatDate(date)][1].length !== 0;

  const getTileContent = ({ date, view }) => {
    const bookingInfo = bookingStatus[formatDate(date)];
    if (view === "month" && Array.isArray(bookingInfo))
      return (
        <Tippy
          interactive={true}
          content={
            <div className="z-10 flex flex-col">
              {bookingInfo[0] && (
                <p>{`Booked from 12:00 AM to ${convertHour24HourToAMPM(
                  bookingInfo[0]
                )}`}</p>
              )}
              {bookingInfo[1].length > 0
                ? bookingInfo[1].map((range, index) => (
                    <p key={index}>
                      {`Booked from ${convertHour24HourToAMPM(
                        range[0]
                      )} to ${convertHour24HourToAMPM(range[1])}`}
                    </p>
                  ))
                : null}
              {bookingInfo[2] && (
                <p>{`Booked from ${convertHour24HourToAMPM(
                  bookingInfo[2]
                )} to 11:59 PM`}</p>
              )}
            </div>
          }
        >
          <div className="absolute z-10000 w-[2.86363rem] h-[2.5rem]"></div>
        </Tippy>
      );
  };

  return (
    <div
      className="my-16 w-11/12 max-w-maxContentTab mx-auto flex flex-col
      justify-center items-center gap-y-16"
    >
      <div
        className="text-gradient w-full text-[2.5rem] flex flex-col items-center
        justify-center"
      >
        <p className="font-extrabold font-accent">
          Simplify Your Booking Experience &
        </p>
        <p className="font-extrabold font-accent">
          Stress-Free Reservations for Managers
        </p>
      </div>
      <div className="w-fit flex flex-col justify-center items-center gap-[1rem]">
        <Calendar
          tileContent={getTileContent}
          showNeighboringMonth={false}
          value={dateRange}
          onChange={(range) => setDateRange(range)}
          onClickMonth={(value) => setSelectedMonth(value.getMonth() + 1)}
          onClickYear={(value) => setSelectedYear(value.getFullYear())}
          defaultView="decade"
          nextLabel="Next"
          prevLabel="Prev"
          tileClassName={({ date, view }) => {
            if (bookingStatus[formatDate(date)] === true && view === "month")
              return "booked";
            else if (bookingStatus[formatDate(date)])
              return `partially--booked${
                isLeftSideBooked(date) ? "--left" : ""
              }${isMiddleBooked(date) ? "--middle" : ""}${
                isRightSideBooked(date) ? "--right" : ""
              }`;
          }}
          selectRange
        />
        <div className="flex w-full justify-between items-center">
          <div className="relative w-[3rem] h-[3rem] rounded-[0.625rem] bg-[#ffcfcc]">
            <p
              className="absolute font-montserrat text-black text-[0.75rem] 
              font-bold left-[50%] top-[50%]"
            >
              Booked
            </p>
          </div>
          <div className="relative w-[3rem] h-[3rem] rounded-[0.625rem] bg-white">
            <p
              className="absolute font-montserrat text-black text-[0.75rem] 
              font-bold left-[50%] top-[50%]"
            >
              Available
            </p>
          </div>
          <div className="relative w-[3rem] h-[3rem] rounded-[0.625rem] bg-[#cfd]">
            <p
              className="absolute font-montserrat text-black text-[0.75rem] 
              font-bold left-[50%] top-[50%]"
            >
              Selected
            </p>
          </div>
        </div>
      </div>
      {/* Check in check time time pickers */}
      {dateRange.length > 0 && (
        <div className="flex gap-16">
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check In Time
            </p>
            <TimePicker />
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-[1.25rem] text-[#4135F3] font-montserrat">
              Check Out Time
            </p>
            <TimePicker />
          </div>
        </div>
      )}
      <SecondFancyBTN text="Next" />
    </div>
  );
};

export default ManagerHome;
