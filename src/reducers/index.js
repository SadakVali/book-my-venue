// imports from packages
import { combineReducers } from "@reduxjs/toolkit";

// import slice reducers
import authReducer from "../slices/authSlice";
import dashboardReducer from "../slices/dashboardSlice";
import userReducer from "../slices/userSlice";
import venueReducer from "../slices/venueSlice";
import newBookingReducer from "../slices/newBookingSlice";
import customerReducer from "../slices/customerSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  user: userReducer,
  venue: venueReducer,
  newBooking: newBookingReducer,
  customer: customerReducer,
});

export default rootReducer;
