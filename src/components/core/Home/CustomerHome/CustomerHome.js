import VenueCard from "./VenueCard";

// API call related imports
import { fetchAllVenues } from "../../../../services/operations/venueAPI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomerHome = () => {
  const dispatch = useDispatch();
  const { venues } = useSelector((state) => state.venue);
  // console.log({ venues });
  useEffect(() => {
    if (!venues.length) dispatch(fetchAllVenues());
  }, []);
  return (
    <div className="flex justify-center items-center flex-wrap mx-auto gap-8">
      {venues.map((venue) => (
        <VenueCard key={venue._id} venueDetails={venue} />
      ))}
    </div>
  );
};

export default CustomerHome;
