// redux related imports
import { useState } from "react";
import BookingCalendar from "../components/core/Home/BookingCalendar";

const VenueDetails = () => {
  const [dateRange, setDateRange] = useState([]);
  return (
    <div
      className="w-full sm:w-11/12 max-w-maxContentTab mx-auto my-auto 
      grid gap-y-16 place-items-center"
    >
      <BookingCalendar setDateRange={(dateRange, setDateRange)} />
    </div>
  );
};

export default VenueDetails;
