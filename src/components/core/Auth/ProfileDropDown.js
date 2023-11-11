import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCaretDown } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineProfile } from "react-icons/ai";
import { BsDatabaseAdd } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.user);
  // console.log({ user });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  useOnClickOutside(ref, () => setOpen(false));
  if (!user) return null;
  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-end justify-center gap-x-[1px]">
        <img
          src={user?.image}
          alt={`profile-${user?.name}`}
          loading="lazy"
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-[#4135F3]" />
      </div>
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center items-start flex-col text-[#4135F3] 
          absolute top-[100%] p-2 right-0 z-[1000] overflow-hidden 
          bg-[#E2E5EA]"
        >
          <Link
            to="/venue-form"
            onClick={() => setOpen(false)}
            className="w-ful flex justify-center items-center gap-x-1 py-[10px] 
            px-[12px] hover:bg-[#ECEFF4]"
          >
            <AiOutlineProfile className="text-lg" />
            <p className="whitespace-nowrap">Venue Details</p>
          </Link>
          <Link
            to="/dashboard/payment-due-today-bookings"
            onClick={() => setOpen(false)}
            className="w-ful flex justify-center items-center gap-x-1 
            py-[10px] px-[12px] hover:bg-[#ECEFF4]"
          >
            <BsDatabaseAdd className="text-lg" />
            <p>Dashboard</p>
          </Link>
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              dispatch(logout(navigator));
            }}
            className="flex justify-center items-center gap-x-1 py-[10px] px-[12px] 
            hover:bg-[#ECEFF4]"
          >
            <MdOutlineLogout className="text-lg" />
            <p>Logout</p>
          </Link>
        </div>
      )}
    </button>
  );
};

export default ProfileDropDown;
