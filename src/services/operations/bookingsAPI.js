// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import {
  setLoading,
  setVenueBookingsGivenMonth,
} from "../../slices/newBookingSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { bookingEndPoints } from "../apis";
import {
  setCustomerRecieptId,
  setMyBookings,
} from "../../slices/customerSlice";
const { CREATE_NEW_BOOKING_API, VENUE_BOOKINGS_GIVEN_MONTH_API } =
  bookingEndPoints;

// data ===> venueId, customerName, customerContactNumber, venueName, venueAddress,
// managerContactNumber, advancePaid, advancePaidOn, nextPaymentDueDate,
// checkInTime, checkOutTime, totalAmount,
export const createNewBooking = (data, navigate, token) => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("POST", CREATE_NEW_BOOKING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE NEW BOOKING API RESPONSE......", response);
    console.log(response);
    if (!response?.data?.success) throw new Error(response?.data?.message);
    console.log("DONE");
    toast.success("booking created successfully");

    dispatch(setMyBookings([response?.data?.data]));
    dispatch(setCustomerRecieptId(response?.data?.data._id));
    navigate(`/customer-bookings/${response?.data?.data._id}`);

    // navigate("/Sadiq");
  } catch (error) {
    console.log("CREATE NEW BOOKING API ERROR......", error);
    toast.error("New Booking Creation Failed");
    navigate("/");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const bookingsOfVenueGivenMonth = (data) => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  console.log({ data });
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "POST",
      VENUE_BOOKINGS_GIVEN_MONTH_API,
      data
    );
    console.log("VENUE BOOKINGS GIVEN MONTH API RESPONSE......", response);
    if (!response.data.success) throw new Error(response.data.message);
    dispatch(setVenueBookingsGivenMonth(response.data.data));
    toast.success("bookings fetched successfully");
  } catch (error) {
    console.log("VENUE BOOKINGS GIVEN MONTH API ERROR......", error);
    toast.error("Fetching Bookings HIstory Given Month Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};
