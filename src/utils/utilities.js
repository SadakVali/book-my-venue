import { toast } from "react-hot-toast";

export const flattenObject = (inputObj) => {
  const filteredInputObj = { ...inputObj };
  ["allBookings", "createdAt", "updatedAt", "__v", "_id"].forEach(
    (key) => delete filteredInputObj[key]
  );
  // console.log(filteredInputObj);
  const flatObj = {};
  for (const key in filteredInputObj) {
    // console.log(key);
    if (Array.isArray(filteredInputObj[key])) {
      flatObj[key] = filteredInputObj[key];
    } else if (
      typeof filteredInputObj[key] === "object" &&
      filteredInputObj[key] !== null
    ) {
      // Recursively flatten nested objects
      const nestedFlatObj = flattenObject(filteredInputObj[key]);
      Object.assign(flatObj, nestedFlatObj);
    } else {
      // Add non-object values directly
      flatObj[key] = filteredInputObj[key];
    }
  }
  return flatObj;
};

export const getCurrentLocation = ({ setValue, trigger }) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
        trigger(["longitude", "latitude"]);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
          toast.error("User denied the request for Geolocation");
        else toast.error("An error occurred while getting your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else toast.error("Geolocation is not available in your browser");
};
