// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import { setLoading, setVenue, setVenues } from "../../slices/venueSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { venueEndPoints } from "../apis";

// utility functions
import { flattenObject } from "../../utils/utilities";

const { CREATE_NEW_VENUE_API, EDIT_VENUE_DETAILS_API, FETCH_ALL_VENUES_API } =
  venueEndPoints;

export const createVenue = (data, navigate, token) => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("POST", CREATE_NEW_VENUE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE VENUE API RESPONSE......", response);
    if (!response?.data?.success) throw new Error(response?.data?.message);
    if (response?.data?.data) {
      const flattenedResponse = flattenObject(response?.data?.data);
      flattenedResponse._id = response?.data?.data?._id;
      flattenedResponse.name = response?.data?.data?.name;
      dispatch(setVenue(flattenedResponse));
      localStorage.setItem("venue", JSON.stringify(flattenedResponse));
    }
    toast.success("new venue creation successful");
    // TODO: Route to manager home <=> venue.status === "published"
    navigate("/manager-home");
  } catch (error) {
    console.log("CREATE VENUE API ERROR......", error);
    toast.error("New Venue Creation Failed");
    navigate("/");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const editVenue = (data, navigate, token) => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("PUT", EDIT_VENUE_DETAILS_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT VENUE DETAILS API RESPONSE......", response);
    if (!response?.data?.success) throw new Error(response?.data?.message);
    if (response?.data?.data) {
      const flattenedResponse = flattenObject(response?.data?.data);
      flattenedResponse._id = response?.data?.data?._id;
      flattenedResponse.name = response?.data?.data?.name;
      dispatch(setVenue(flattenedResponse));
      localStorage.setItem("venue", JSON.stringify(flattenedResponse));
    }
    toast.success("editing venue successful");
    // TODO: Route to manager home <=> venue.status === "published"
    navigate("/manager-home");
  } catch (error) {
    console.log("EDIT VENUE DETAILS API ERROR......", error);
    toast.error("Edit Venue Details Failed");
    navigate("/");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};

export const fetchAllVenues = () => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("POST", FETCH_ALL_VENUES_API);
    console.log("FETCH ALL VENUE DETAILS API RESPONSE......", response);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Fetching All Venues Successfull");
    dispatch(setVenues(response.data.data));
    localStorage.setItem("venues", JSON.stringify(response.data.data));
    // navigate("/");
  } catch (error) {
    console.log("FETCH ALL VENUE DETAILS API ERROR......", error);
    toast.error("Login Failed");
  }
  dispatch(setLoading(false));
  toast.dismiss(toastId);
};
