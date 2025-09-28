
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
export const fetchplaceanddistrict=createAsyncThunk(
  'supplier/changeplacedetails',
  async({email},thunkAPI)=>{
    try{
    const res=await API.get(`/supplier/getplacedetails/${email}`)
    return res.data
    }catch(error){
    
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
)
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


export const updateSupplierDetails = createAsyncThunk(
  "supplier/updateDetails",
  async ({ email, district, place }, thunkAPI) => {
    try {
      const res = await API.put(`/supplier/update-details/${email}`, {
        district,
        place,
      });
      return res.data; // Return updated supplier
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);
export const suppliercurrentorders = createAsyncThunk(
  "supplier/currentorders", // typePrefix (required)
  async ({ place, district }, thunkAPI) => {
    try {
      const res = await API.get(`/supplier/currentorders/${district}/${place}`);
      console.log("API Response:", res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);
export const supplierallorders = createAsyncThunk(
  "supplier/currentorders", // typePrefix (required)
  async ({ place, district }, thunkAPI) => {
    try {
      const res = await API.get(`/supplier/allorders/${district}/${place}`);
      console.log("API Response:", res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);
export const sendOrderOTP = createAsyncThunk(
  "supplier/sendOrderOTP",
  async (id, thunkAPI) => {
    try {
      const res = await API.post(`/supplier/${id}/send-otp`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Verify OTP and Deliver
export const verifyOrderOTP = createAsyncThunk(
  "supplier/verifyOrderOTP",
  async ({ id, otp }, thunkAPI) => {
    try {
      const res = await API.put(`/supplier/${id}/verify-otp`, { otp });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to verify OTP");
    }
  }
);
export const sendsuccesmessage=createAsyncThunk(
  "supplier/message",
  async({id},thunkAPI)=>{
    try{
      const res=await API.post(`/supplier/successmessage/${id}`)
      return res.data

    }catch(error){
      return thunkAPI.rejectWithValue(error.response?.data?.message||"failed to send succes message")
    }
  }
)
const initialState = {
  supplierInfo: JSON.parse(sessionStorage.getItem("supplierInfo")) || null,
  orders: [],
  loading: false,
  error: null,
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
    extraReducers: (builder) => {
    builder
      .addCase(sendOrderOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrderOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOrderOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOrderOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOrderOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOrderOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },

});



export const { setSupplierInfo, clearSupplierInfo } = supplierSlice.actions;
export default supplierSlice.reducer;



