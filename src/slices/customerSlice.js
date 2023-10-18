// import from packages
import { createSlice } from "@reduxjs/toolkit";
import { BOOKING_STATUS } from "../utils/constants";
import { formatDate } from "../utils/utilities";

// initial state
const initialState = {
  loading: false,
  myVenue: null,
  customerRecieptId: null,
  myBookings: [],
};

// creating the slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setCustomerRecieptId(state, value) {
      state.customerRecieptId = value.payload;
    },
    setMyVenue(state, value) {
      state.myVenue = value.payload;
    },
    setMyBookings(state, value) {
      state.myBookings = value.payload;
    },
    setMyBookingStatus(state, value) {
      const temp = [...state.myBookings];
      let index;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === value.payload.id) {
          index = i;
          break;
        }
      }
      temp[index].bookingStatus = value.payload.status;
      if (value.payload.status === BOOKING_STATUS.BOOKED)
        temp[index].fullyPaidDate = Math.floor(Date.now() / 1000);
      state.myBookings = temp;
    },
    setMyBookingSummary(state, value) {
      const temp = [...state.myBookings];
      let index;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === value.payload.id) {
          index = i;
          break;
        }
      }
      temp[index].paymentSummary = value.payload.paymentSummary;
      state.myBookings = temp;
    },
  },
});

// export const { setSignupData, setLoading, setToken } = customerSlice.actions;
export const {
  setMyVenue,
  setLoading,
  setCustomerRecieptId,
  setMyBookingStatus,
  setMyBookingSummary,
  setMyBookings,
} = customerSlice.actions;
export default customerSlice.reducer;
