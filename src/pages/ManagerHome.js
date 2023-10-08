import React from "react";

import SecondFancyBTN from "../components/common/SecondFancyBTN";

const ManagerHome = () => {
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
      <SecondFancyBTN text="Fetch Bookings" />
    </div>
  );
};

export default ManagerHome;
