import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineCaretDown } from "react-icons/ai";

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="">
        <img
          src={user?.image}
          alt={`profile-${user?.name}`}
          loading="lazy"
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-[#4135F3]" />
      </div>
      {/* TODO: after login and logoutimplimentation */}
      {open && <div></div>}
    </button>
  );
};

export default ProfileDropDown;
