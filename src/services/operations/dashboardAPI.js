// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import {
  // setCancelledBookings,
  setPaymentDueToadyBookings,
  // setAdvancePaidBookings,
  // setBookedBookings,
  // setOccasionPastBookings,
  setLoading,
} from "../../slices/dashboardSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { dashboardEndPoints } from "../apis";
const {
  // FETCH_ALL_CANCELLED_BOOKINGS_API,
  // FETCH_ADVANCE_PAID_BOOKINGS_API,
  // FETCH_ALL_BOOKED_RECIEPTS_API,
  // FETCH_COMPLETED_BOOKINGS_API,
  FETCH_PAYMENTS_DUE_TODAY_BOOKINGS_API,
  CANCEL_A_SINGLE_BOOKING_API,
  CHANGE_STATUS_TO_BOOKED_API,
  UPDATE_PAYMENT_SUMMARY_API,
} = dashboardEndPoints;

// export const fetchAdvancePaidBookings = () => async (dispatch) => {
//   const toastId = toast.loading("Loading...");
//   dispatch(setLoading(true));
//   try {
//     const response = await apiConnector("GET", FETCH_ADVANCE_PAID_BOOKINGS_API);
//     console.log("FETCH ADVANCE PAID BOOKINGS API RESPONSE......", response);
//     if (!response.data.success) throw new Error(response.data.message);
//     dispatch(setAdvancePaidBookings(response.data.data));
//     toast.success("Advance Paid bookings fetched successfully");
//   } catch (error) {
//     console.log("FETCH ADVANCE PAID BOOKINGS API ERROR......", error);
//     toast.error("Fetching Advance Paid Bookings Failed");
//   }
//   dispatch(setLoading(false));
//   toast.dismiss(toastId);
// };

// export const fetchAllCancelledBookings = () => async (dispatch) => {
//   const toastId = toast.loading("Loading...");
//   dispatch(setLoading(true));
//   try {
//     const response = await apiConnector(
//       "GET",
//       FETCH_ALL_CANCELLED_BOOKINGS_API
//     );
//     console.log("FETCH ALL CANCELLED BOOKINGS API RESPONSE......", response);
//     if (!response.data.success) throw new Error(response.data.message);
//     dispatch(setCancelledBookings(response.data.data));
//     toast.success("Cancelled bookings fetched successfully");
//   } catch (error) {
//     console.log("FETCH ALL CANCELLED BOOKINGS API ERROR......", error);
//     toast.error("Fetching Cancelled Bookings Failed");
//   }
//   dispatch(setLoading(false));
//   toast.dismiss(toastId);
// };

// export const fetchAllBookedReciepts = () => async (dispatch) => {
//   const toastId = toast.loading("Loading...");
//   dispatch(setLoading(true));
//   try {
//     const response = await apiConnector("GET", FETCH_ALL_BOOKED_RECIEPTS_API);
//     console.log("FETCH ALL BOOKED RECIEPTS API RESPONSE......", response);
//     if (!response.data.success) throw new Error(response.data.message);
//     dispatch(setBookedBookings(response.data.data));
//     toast.success("Booked bookings fetched successfully");
//   } catch (error) {
//     console.log("FETCH ALL BOOKED RECIEPTS API ERROR......", error);
//     toast.error("Fetching Booked Bookings Failed");
//   }
//   dispatch(setLoading(false));
//   toast.dismiss(toastId);
// };

// export const fetchAllBookingsPastOccation = () => async (dispatch) => {
//   const toastId = toast.loading("Loading...");
//   dispatch(setLoading(true));
//   try {
//     const response = await apiConnector("GET", FETCH_COMPLETED_BOOKINGS_API);
//     console.log("FETCH COMPLETED BOOKINGS API RESPONSE......", response);
//     if (!response.data.success) throw new Error(response.data.message);
//     dispatch(setOccasionPastBookings(response.data.data));
//     toast.success("Completed bookings fetched successfully");
//   } catch (error) {
//     console.log("FETCH COMPLETED BOOKINGS API ERROR......", error);
//     toast.error("Fetching Completed Bookings Failed");
//   }
//   dispatch(setLoading(false));
//   toast.dismiss(toastId);
// };

export const fetchPaymentsDueTodayBookings = (token) => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "GET",
      FETCH_PAYMENTS_DUE_TODAY_BOOKINGS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(
      "FETCH PAYMENTS DUE TODAY BOOKINGS API RESPONSE......",
      response
    );
    if (!response.data.success) throw new Error(response.data.message);
    dispatch(setPaymentDueToadyBookings(response.data.data));
    toast.success("Payment Due bookings fetched successfully");
  } catch (error) {
    console.log("FETCH PAYMENTS DUE TODAY BOOKINGS API ERROR......", error);
    toast.error("Fetching Payment Due Bookings Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const cancelSingleBooking = (data, token) => async (dispatch) => {
  // data => bookingId
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "PUT",
      CANCEL_A_SINGLE_BOOKING_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("CANCEL A SINGLE BOOKING API RESPONSE......", response);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Cancelling a Single Booking successfully");
  } catch (error) {
    console.log("CANCEL A SINGLE BOOKING API ERROR......", error);
    toast.error("Cancelling a Single Booking Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const changeStatusToBooked = (data, token) => async (dispatch) => {
  // data => bookingId
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "PUT",
      CHANGE_STATUS_TO_BOOKED_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("CHANGE STATUS TO BOOKED API RESPONSE......", response);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Booking Completed successfully");
  } catch (error) {
    console.log("CHANGE STATUS TO BOOKED API ERROR......", error);
    toast.error("Booking Completion Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const updatePaymentSummary = (data, token) => async (dispatch) => {
  // data => bookingId, paymentSummary
  console.log({ data, token });
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_PAYMENT_SUMMARY_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("UPDATE PAYMENT SUMMARY API RESPONSE......", response);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Payment Summary Updated successfully");
  } catch (error) {
    console.log("UPDATE PAYMENT SUMMARY API ERROR......", error);
    toast.error("Payment Summary Update Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};
