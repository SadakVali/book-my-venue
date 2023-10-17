import React from "react";
import { useSelector } from "react-redux";

const CustomerBookingDetailsCard = () => {
  const { user } = useSelector((state) => state.user);
  const onClick = () => {};
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
          src={user?.image}
          alt={`profile-${user?.name}`}
          loading="lazy"
          className="aspect-square w-[100px] rounded-full object-cover"
        />
        <div>
          <p className="font-montserrat font-semibold text-[1.125rem] text-[#4135F3]">
            Sadiq Vali
          </p>
          <div className="text-[#4135F3] font-montserrat">
            <p>
              Paid 150000 / <b>300000</b>
            </p>
            <p>
              Next Due Date <b>16-11-2023</b>
            </p>
          </div>
        </div>
      </div>
      <div className="font-montserrat text-[1rem]">
        <p>
          Personal Number :{" "}
          <span className="text-[#4135F3]">+91 83091 57924</span>
        </p>
        <p>
          Check In Time :{" "}
          <span className="text-[#4135F3]">03 : 00 PM on 16-12-2023</span>
        </p>
        <p>
          Check Out Time :{" "}
          <span className="text-[#4135F3]">02 : 00 PM on 18-12-2023</span>
        </p>
        <p>
          Booking Status : <span className="text-[#4135F3]">CANCELLED</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerBookingDetailsCard;
