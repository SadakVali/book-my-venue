// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  customerBookings: null,
  cancelledBookings: null,
  paymentDueToadyBookings: null,
  advancePaidBookings: null,
  occasionPastBookings: null,
  bookedBookings: null,
  loading: false,
};

// creating a new slice of information
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setCustomerBookings(state, value) {
      state.customerBookings = value.payload;
    },
    setCancelledBookings(state, value) {
      state.cancelledBookings = value.payload;
    },
    setPaymentDueToadyBookings(state, value) {
      state.paymentDueToadyBookings = value.payload;
    },
    setAdvancePaidBookings(state, value) {
      state.advancePaidBookings = value.payload;
    },
    setBookedBookings(state, value) {
      state.bookedBookings = value.payload;
    },
    setOccasionPastBookings(state, value) {
      state.occasionPastBookings = value.payload;
    },
    sertLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const {
  setCustomerBookings,
  setBookedBookings,
  setCancelledBookings,
  setPaymentDueToadyBookings,
  setAdvancePaidBookings,
  setOccasionPastBookings,
  setLoading,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
