
import API from "../../api";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
export const ChangePassword = createAsyncThunk(
  "supplier/change",
  async ({ email, oldPassword, newPassword }, thunkAPI) => {
    try {
      const res = await API.post(`/supplier/changepassword/${email}`, {
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
      const res = await API.post(`/supplier/upload/${email}`, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const removeProfile = createAsyncThunk(
  "profile/remove",
  async (email, thunkAPI) => {
    try {
      const res = await API.put(`/supplier/remove-image/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const initialState = {
  supplierInfo: JSON.parse(sessionStorage.getItem("supplierInfo")) || null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSupplierInfo: (state, action) => {
      state.supplierInfo = action.payload;
      sessionStorage.setItem("supplierInfo", JSON.stringify(action.payload));
    },
    clearSupplierInfo: (state) => {
      state.supplierInfo = null;
      sessionStorage.removeItem("supplierInfo");
    },
  },
});



export const { setSupplierInfo, clearSupplierInfo } = supplierSlice.actions;
export default supplierSlice.reducer;



