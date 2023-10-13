// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/userSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { authEndPoints } from "../apis";
import {
  setBookingInfo,
  setVenueBookingsGivenMonth,
} from "../../slices/newBookingSlice";
import {
  setAdvancePaidBookings,
  setCancelledBookings,
  setOccasionPastBookings,
  setPaymentDueToadyBookings,
} from "../../slices/dashboardSlice";
import { setVenue } from "../../slices/venueSlice";

// utility functions
import { flattenObject } from "../../utils/utilities";

const { LOGIN_API, SIGNUP_API } = authEndPoints;

export const signup =
  (name, contactNumber, password, navigate) => async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        name,
        contactNumber,
        password,
      });
      console.log("SIGNUP API RESPONSE......", response?.data);
      if (!response?.data?.success) throw new Error(response?.data?.message);
      toast.success("signup successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR......", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };

export const login =
  (contactNumber, password, navigate) => async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        contactNumber,
        password,
      });
      // console.log("LOGIN API RESPONSE......", response);
      if (!response?.data?.success) throw new Error(response?.data?.message);
      toast.success("Login Successfull");
      console.log("USER DATA...", response?.data?.data);
      if (!!response?.data?.data?.token) {
        dispatch(setToken(response?.data?.data?.token));
        localStorage.setItem(
          "token",
          JSON.stringify(response?.data?.data?.token)
        );
      }
      if (response?.data?.data?.venue) {
        const flattenedObj = flattenObject(response?.data?.data?.venue);
        flattenedObj._id = response?.data?.data?.venue._id;
        dispatch(setVenue(flattenedObj));
        localStorage.setItem("venue", JSON.stringify(flattenedObj));
      }
      dispatch(setUser(response?.data?.data?.user));
      localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
      localStorage.setItem(
        "token",
        JSON.stringify(response?.data?.data?.token)
      );
      // console.log(navigate);
      // navigate("/dashboard/payment-due-today-bookings");

      // if (response?.data?.data?.venue) navigate("/manager-home");
      // else {
      //   console.log("else part is being executed");
      //   navigate("/venue-form");
      // }
      console.log("Login API end...");
    } catch (error) {
      console.log("LOGIN API ERROR......", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };

export const logout = (navigate) => (dispatch) => {
  dispatch(setToken(null));
  dispatch(setUser(null));
  dispatch(setVenue(null));
  dispatch(setVenueBookingsGivenMonth(null));
  dispatch(setBookingInfo(null));
  dispatch(setCancelledBookings(null));
  dispatch(setAdvancePaidBookings(null));
  dispatch(setPaymentDueToadyBookings(null));
  dispatch(setOccasionPastBookings(null));
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("venue");
  toast.success("Logged Out");
  navigate("/");
};
