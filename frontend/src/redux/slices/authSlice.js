import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
export const ChangePassword = createAsyncThunk(
  "admin/change",
  async ({ email, oldPassword, newPassword }, thunkAPI) => {
    try {
      const res = await API.post(`/admin/changepassword/${email}`, {
        oldPassword,
        newPassword,
      });
      
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const addprofile = createAsyncThunk(
  "profile/image",
  async ({ data, email }, thunkAPI) => {
    try {
      const res = await API.post(`/admin/upload/${email}`, data);
      return res.data; // contains { message: "...", admin: {...} }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


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
