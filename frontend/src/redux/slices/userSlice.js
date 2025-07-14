import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';
export const addprofile = createAsyncThunk(
  "profile/image",
  async ({ data, email }, thunkAPI) => {
    try {
      const res = await API.post(`/user/upload/${email}`, data);
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
      const res = await API.put(`/user/remove-image/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
export const changePassword = createAsyncThunk(
  "admin/change",
  async ({ email, oldPassword, newPassword }, thunkAPI) => {
    try {
      const res = await API.post(`/user/changepassword/${email}`, {
        oldPassword,
        newPassword,
      });
      
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


const initialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
