// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import { setMyBookings, setLoading } from "../../slices/customerSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { dashboardEndPoints } from "../apis";
const { FETCH_CUSTOMER_RECIEPTS_API } = dashboardEndPoints;

export const fetchSingleCustomerReciepts = (data) => async (dispatch) => {
  // customerContactNumber input field
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector(
      "POST",
      FETCH_CUSTOMER_RECIEPTS_API,
      data
    );
    console.log("FETCH SINGLE CUSTOMER BOOKINGS RESPONSE......", response);
    if (!response?.data?.success) throw new Error(response?.data?.message);
    dispatch(setMyBookings(response?.data?.data));
    if (response?.data?.data?.length === 0)
      toast.success("No Bookings with your Number");
    else toast.success("Customer bookings fetched successfully");
  } catch (error) {
    console.log("FETCH CUSTOMER BOOKINGS API ERROR......", error);
    toast.error("Fetching Customer Bookings Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};
