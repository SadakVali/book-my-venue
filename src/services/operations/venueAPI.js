// import from packages
import { toast } from "react-hot-toast";

// redux related imports
import { setLoading, setVenue, setVenues } from "../../slices/venueSlice";

// API call related imports
import { apiConnector } from "../apiConnector";
import { venueEndPoints } from "../apis";
const { CREATE_NEW_VENUE_API, EDIT_VENUE_DETAILS_API, FETCH_ALL_VENUES_API } =
  venueEndPoints;

// {
//   name,
//   aboutVenue,
//   venuePricePerDay,
//   advancePercentage,
//   guestCapacity,
//   carParkingSpace,
//   numOfLodgingRooms,
//   lodgingRoomPrice,
//   isBookingCancellable,
//   // Food
//   isCateringProvidedByVenue,
//   isOutsideCatererAllowed,
//   isNonVegAllowedAtVenue,
//   vegPricePerPlate,
//   nonvegPricePerPlate,
//   // Alcohol
//   isAlcoholProvidedByVenue,
//   isOutsideAlcoholAllowed,
//   // Decor
//   isDecorProvidedByVenue,
//   isOutsideDecoratersAllowed,
//   // OtherPolicies
//   isMusicAllowedLateAtNight,
//   isHallAirConditioned,
//   isBaaratAllowed,
//   areFireCrackersAllowed,
//   isHawanAllowed,
//   isOverNightWeddingAllowed,
//   // Address
//   street,
//   landmark,
//   distanceFromLandmark,
//   village,
//   city,
//   pin,
//   // GPS
//   coordinates,
//   // other parameters

//   images,
//   videos,
// }

const flattenObject = (inputObj) => {
  const flatObj = {};
  for (const key in inputObj) {
    if (Array.isArray(inputObj[key]) && key === "coordinates") {
      flatObj["longitude"] = inputObj[key][0];
      flatObj["latitude"] = inputObj[key][1];
    } else if (typeof inputObj[key] === "object" && inputObj[key] !== null) {
      // Recursively flatten nested objects
      const nestedFlatObj = flattenObject(inputObj[key]);
      Object.assign(flatObj, nestedFlatObj);
    } else {
      // Add non-object values directly
      flatObj[key] = inputObj[key];
    }
  }
  return flatObj;
};

export const createVenue = (data, navigate, token) => {
  return async (dispatch) => {
    // console.log({ images: data.images, videos: data.videos, token });
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      console.log(data);
      const response = await apiConnector("POST", CREATE_NEW_VENUE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });
      console.log("CREATE VENUE API RESPONSE......", response);
      const flattenedResponse = flattenObject(response.data.data);
      dispatch(setVenue(flattenedResponse));
      if (!response.data.success) throw new Error(response.data.message);
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
    navigate,
    token
  ) =>
  async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PUT",
        EDIT_VENUE_DETAILS_API,
        {
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
        },
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
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
