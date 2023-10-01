// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import {
  setLoading,
  setBookingsHistoryGivenMonth,
} from "../../slices/newBookingSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { bookingEndPoints } from "../apis";
const { CREATE_NEW_BOOKING_API, VENUE_BOOKINGS_GIVEN_MONTH_API } =
  bookingEndPoints;

export const createNewBooking =
  (
    venueId,
    customerName,
    customerContactNumber,
    venueName,
    venueAddress,
    managerContactNumber,
    advancePaid,
    advancePaidOn,
    // fullyPaidDate,
    nextPaymentDueDate,
    checkInTime,
    checkOutTime,
    totalAmount
    // paymentSummary
  ) =>
  async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_NEW_BOOKING_API, {
        venueId,
        customerName,
        customerContactNumber,
        venueName,
        venueAddress,
        managerContactNumber,
        advancePaid,
        advancePaidOn,
        // fullyPaidDate,
        nextPaymentDueDate,
        checkInTime,
        checkOutTime,
        totalAmount,
        // paymentSummary,
      });
      console.log("CREATE NEW BOOKING API RESPONSE......", response);
      if (!response.data.sucess) throw new Error(response.data.message);
      toast.success("booking created successfully");
      navigate("/");
    } catch (error) {
      console.log("CREATE NEW BOOKING API ERROR......", error);
      toast.error("New Booking Creation Failed");
      navigate("/");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };

export const bookingsOfVenueGivenMonth =
  (venueId, startingUnixTimeStamp, endingUnixTimeStamp) => async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        VENUE_BOOKINGS_GIVEN_MONTH_API,
        { venueId, startingUnixTimeStamp, endingUnixTimeStamp }
      );
      console.log("VENUE BOOKINGS GIVEN MONTH API RESPONSE......", response);
      if (!response.data.success) throw new Error(response.data.message);
      dispatch(setBookingsHistoryGivenMonth(response.data.data));
      toast.success("bookings fetched successfully");
    } catch (error) {
      console.log("VENUE BOOKINGS GIVEN MONTH API ERROR......", error);
      toast.error("Fetching Bookings HIstory Given Month Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
