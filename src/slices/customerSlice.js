// import from packages
import { createSlice } from "@reduxjs/toolkit";

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
      temp[value.payload.index].bookingStatus = value.payload.status;
      state.myBookings = temp;
    },
    setMyBookingSummary(state, value) {
      const temp = [...state.myBookings];
      temp[value.payload.index].paymentSummary = value.payload.paymentSummary;
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
