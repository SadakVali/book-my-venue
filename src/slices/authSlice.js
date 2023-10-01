// import from packages
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  loading: false,
  sidebarFlag: false,
  token: !!localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

// creating the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setSidebarFlag(state, value) {
      state.sidebarFlag = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

// export const { setSignupData, setLoading, setToken } = authSlice.actions;
export const { setLoading, setToken, setSidebarFlag } = authSlice.actions;
export default authSlice.reducer;
