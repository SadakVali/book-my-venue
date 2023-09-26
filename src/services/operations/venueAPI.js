// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import { setLoading, setVenues } from "../../slices/venueSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { venueEndPoints } from "../apis";
const { CREATE_NEW_VENUE_API, EDIT_VENUE_DETAILS_API, FETCH_ALL_VENUES_API } =
  venueEndPoints;

export const createVenue =
  (
    name,
    aboutVenue,
    venuePricePerDay,
    advancePercentage,
    guestCapacity,
    carParkingSpace,
    numOfLodgingRooms,
    lodgingRoomPrice,
    isBookingCancellable,
    // Food
    isCateringProvidedByVenue,
    isOutsideCatererAllowed,
    isNonVegAllowedAtVenue,
    vegPricePerPlate,
    nonvegPricePerPlate,
    // Alcohol
    isAlcoholProvidedByVenue,
    isOutsideAlcoholAllowed,
    // Decor
    isDecorProvidedByVenue,
    isOutsideDecoratersAllowed,
    // OtherPolicies
    isMusicAllowedLateAtNight,
    isHallAirConditioned,
    isBaaratAllowed,
    areFireCrackersAllowed,
    isHawanAllowed,
    isOverNightWeddingAllowed,
    // Address
    street,
    landmark,
    distanceFromLandmark,
    village,
    city,
    pin,
    // GPS
    coordinates,
    // other parameters
    navigate
  ) =>
  async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_NEW_VENUE_API, {
        name,
        aboutVenue,
        venuePricePerDay,
        advancePercentage,
        guestCapacity,
        carParkingSpace,
        numOfLodgingRooms,
        lodgingRoomPrice,
        isBookingCancellable,
        // Food
        isCateringProvidedByVenue,
        isOutsideCatererAllowed,
        isNonVegAllowedAtVenue,
        vegPricePerPlate,
        nonvegPricePerPlate,
        // Alcohol
        isAlcoholProvidedByVenue,
        isOutsideAlcoholAllowed,
        // Decor
        isDecorProvidedByVenue,
        isOutsideDecoratersAllowed,
        // OtherPolicies
        isMusicAllowedLateAtNight,
        isHallAirConditioned,
        isBaaratAllowed,
        areFireCrackersAllowed,
        isHawanAllowed,
        isOverNightWeddingAllowed,
        // Address
        street,
        landmark,
        distanceFromLandmark,
        village,
        city,
        pin,
        // GPS
        coordinates,
      });
      console.log("CREATE VENUE API RESPONSE......", response);
      if (!response.data.sucess) throw new Error(response.data.message);
      toast.success("new venue creation successful");
      navigate("/");
    } catch (error) {
      console.log("CREATE VENUE API ERROR......", error);
      toast.error("New Venue Creation Failed");
      // navigate("/");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };

export const editVenue =
  (
    name,
    aboutVenue,
    venuePricePerDay,
    advancePercentage,
    guestCapacity,
    carParkingSpace,
    numOfLodgingRooms,
    lodgingRoomPrice,
    isBookingCancellable,
    // Food
    isCateringProvidedByVenue,
    isOutsideCatererAllowed,
    isNonVegAllowedAtVenue,
    vegPricePerPlate,
    nonvegPricePerPlate,
    // Alcohol
    isAlcoholProvidedByVenue,
    isOutsideAlcoholAllowed,
    // Decor
    isDecorProvidedByVenue,
    isOutsideDecoratersAllowed,
    // OtherPolicies
    isMusicAllowedLateAtNight,
    isHallAirConditioned,
    isBaaratAllowed,
    areFireCrackersAllowed,
    isHawanAllowed,
    isOverNightWeddingAllowed,
    // Address
    street,
    landmark,
    distanceFromLandmark,
    village,
    city,
    pin,
    // GPS
    coordinates,
    // other parameters
    navigate
  ) =>
  async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", EDIT_VENUE_DETAILS_API, {
        name,
        aboutVenue,
        venuePricePerDay,
        advancePercentage,
        guestCapacity,
        carParkingSpace,
        numOfLodgingRooms,
        lodgingRoomPrice,
        isBookingCancellable,
        // Food
        isCateringProvidedByVenue,
        isOutsideCatererAllowed,
        isNonVegAllowedAtVenue,
        vegPricePerPlate,
        nonvegPricePerPlate,
        // Alcohol
        isAlcoholProvidedByVenue,
        isOutsideAlcoholAllowed,
        // Decor
        isDecorProvidedByVenue,
        isOutsideDecoratersAllowed,
        // OtherPolicies
        isMusicAllowedLateAtNight,
        isHallAirConditioned,
        isBaaratAllowed,
        areFireCrackersAllowed,
        isHawanAllowed,
        isOverNightWeddingAllowed,
        // Address
        street,
        landmark,
        distanceFromLandmark,
        village,
        city,
        pin,
        // GPS
        coordinates,
      });
      console.log("EDIT VENUE DETAILS API RESPONSE......", response);
      if (!response.data.sucess) throw new Error(response.data.message);
      toast.success("editing venue successful");
      navigate("/");
    } catch (error) {
      console.log("EDIT VENUE DETAILS API ERROR......", error);
      toast.error("Edit Venue Details Failed");
      // navigate("/");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };

export const fetchAllVenues = () => async (dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  try {
    const response = await apiConnector("POST", FETCH_ALL_VENUES_API, {
      venueId,
    });
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
