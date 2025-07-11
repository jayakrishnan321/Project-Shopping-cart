import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: JSON.parse(sessionStorage.getItem("adminInfo")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.adminInfo = action.payload;
      console.log(state.adminInfo)
      sessionStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      sessionStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminInfo, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
