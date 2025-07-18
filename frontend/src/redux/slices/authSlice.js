import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      const res = await API.put(`/admin/remove-image/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
export const userlist = createAsyncThunk("admin/userlist", async (thunkAPI) => {
  try {
    const res = await API.get('/admin/userlist')
    return res.data;

  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
})
export const supplierlist = createAsyncThunk("admin/supplierlist", async (_, thunkAPI) => {
  try {
    const res = await API.get('/admin/supplierlist');
    console.log(res.data)
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});
export const fetchPendingSuppliers = createAsyncThunk("admin/fetchPendingSuppliers", async (_, thunkAPI) => {
  try {
    const res = await API.get('/admin/pending-suppliers');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const approveSupplier = createAsyncThunk("admin/approveSupplier", async (id, thunkAPI) => {
  try {
    const res = await API.put(`/admin/approve-supplier/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const rejectSupplier = createAsyncThunk("admin/rejectSupplier", async (id, thunkAPI) => {
  try {
    const res = await API.put(`/admin/reject-supplier/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


const initialState = {
  adminInfo: JSON.parse(sessionStorage.getItem("adminInfo")) || null,
  users: [],
  suppliers: [],
  pendingSuppliers: [], // ✅ Add this to avoid undefined
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.adminInfo = action.payload;
      sessionStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      sessionStorage.removeItem("adminInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userlist.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(userlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(supplierlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(supplierlist.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(supplierlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchPendingSuppliers.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingSuppliers = action.payload; // ✅ Save data
    })
    .addCase(fetchPendingSuppliers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  }
});


export const { setAdminInfo, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
