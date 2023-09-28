// import from packages
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  loading: false,
  token: JSON.parse(localStorage.getItem("token")) || null,
};

// creating the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

// export const { setSignupData, setLoading, setToken } = authSlice.actions;
export const { setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
