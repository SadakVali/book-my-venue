import CutomerBookingDetailsRequestForm from "../components/core/Booking/CutomerBookingDetailsRequestForm";
import CustomerBookingDetailsCard from "../components/core/Booking/CustomerBookingDetailsCard";
import { useSelector } from "react-redux";

const CustomerBookings = () => {
  const { myBookings } = useSelector((state) => state.customer);

  return (
    <div className="w-11/12 max-w-maxContent mx-auto flex justify-center items-center">
      {!myBookings.length ? (
        <div className="mx-auto flex justify-center items-center w-full h-full">
          <CutomerBookingDetailsRequestForm />
        </div>
      ) : (
        <div className="my-16 mx-auto w-full auto-adjust-reciept-cards">
          {myBookings.map((booking) => (
            <CustomerBookingDetailsCard
              key={booking._id}
              bookingDetails={booking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
