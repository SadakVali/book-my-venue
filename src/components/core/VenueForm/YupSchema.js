import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .required("Function Hall Name is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  advancePercentage: yup
    .number()
    .required()
    .min(0, "Should be >= 0")
    .max(100, "It's a Percentage Value should be <= 100"),
  guestCapacity: yup.number().required().min(1, "Should be > 0"),
  carParkingSpace: yup.number().required().min(0, "Should be >= 0"),
  venuePricePerDay: yup.number().required().min(0, "Should be >= 0"),
  numOfLodgingRooms: yup.number().required().min(0, "Should be >= 0"),
  lodgingRoomPrice: yup.number().required().min(0, "Should be >= 0"),
  vegPricePerPlate: yup.number().required().min(0, "Should be >= 0"),
  nonvegPricePerPlate: yup.number().required().min(0, "Should be >= 0"),
  aboutVenue: yup
    .string()
    .required("About Function Hall Field is Required")
    .min(200, "Minimum 200 Characters Required")
    .trim(),
  street: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  landmark: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  distanceFromLandmark: yup
    .string()
    .required("Field is Required")
    .min(5, "Minimum 5 Characters Required")
    .trim(),
  village: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  city: yup
    .string()
    .required("Field is Required")
    .min(3, "Minimum 3 Characters Required")
    .trim(),
  pin: yup.number().required("Field is Required").min(0, "Must be > 0"),
  latitude: yup.number().required("Field is Required"),
  longitude: yup.number().required("Field is Required"),
});

export default schema;
