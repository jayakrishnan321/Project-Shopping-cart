import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// Change Password
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

// Profile Image Add
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

// Profile Image Remove
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

// User List
export const userlist = createAsyncThunk("admin/userlist", async (thunkAPI) => {
  try {
    const res = await API.get("/admin/userlist");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Supplier List
export const supplierlist = createAsyncThunk(
  "admin/supplierlist",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/admin/supplierlist");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

/* -------------------- SEPARATE PENDING SUPPLIERS -------------------- */
// Pending Registrations
export const fetchPendingRegistrations = createAsyncThunk(
  "admin/fetchPendingRegistrations",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/admin/pending-registrations");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const approveRegistration = createAsyncThunk(
  "admin/approveRegistration",
  async (id, thunkAPI) => {
    try {
      const res = await API.put(`/admin/approve-registration/${id}`);
      return { id, data: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const rejectRegistration = createAsyncThunk(
  "admin/rejectRegistration",
  async (id, thunkAPI) => {
    try {
      const res = await API.put(`/admin/reject-registration/${id}`);
      return { id, data: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Pending Place/District Updates
export const fetchPendingUpdates = createAsyncThunk(
  "admin/fetchPendingUpdates",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/admin/pending-updates");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const approveUpdate = createAsyncThunk(
  "admin/approveUpdate",
  async (id, thunkAPI) => {
    try {
      const res = await API.put(`/admin/approve-update/${id}`);
      return { id, data: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const rejectUpdate = createAsyncThunk(
  "admin/rejectUpdate",
  async (id, thunkAPI) => {
    try {
      const res = await API.put(`/admin/reject-update/${id}`);
      return { id, data: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  adminInfo: JSON.parse(sessionStorage.getItem("adminInfo")) || null,
  users: [],
  suppliers: [],
  pendingRegistrations: [], // NEW
  pendingUpdates: [],       // NEW
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
      // USER LIST
      .addCase(userlist.pending, (state) => { state.loading = true; })
      .addCase(userlist.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(userlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // SUPPLIER LIST
      .addCase(supplierlist.pending, (state) => { state.loading = true; })
      .addCase(supplierlist.fulfilled, (state, action) => { state.loading = false; state.suppliers = action.payload; })
      .addCase(supplierlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // PENDING REGISTRATIONS
      .addCase(fetchPendingRegistrations.fulfilled, (state, action) => {
        state.pendingRegistrations = action.payload;
      })
      .addCase(approveRegistration.fulfilled, (state, action) => {
        state.pendingRegistrations = state.pendingRegistrations.filter(s => s._id !== action.payload.id);
      })
      .addCase(rejectRegistration.fulfilled, (state, action) => {
        state.pendingRegistrations = state.pendingRegistrations.filter(s => s._id !== action.payload.id);
      })

      // PENDING UPDATES
      .addCase(fetchPendingUpdates.fulfilled, (state, action) => {
        state.pendingUpdates = action.payload;
      })
      .addCase(approveUpdate.fulfilled, (state, action) => {
        state.pendingUpdates = state.pendingUpdates.filter(s => s._id !== action.payload.id);
      })
      .addCase(rejectUpdate.fulfilled, (state, action) => {
        state.pendingUpdates = state.pendingUpdates.filter(s => s._id !== action.payload.id);
      });
  },
});

export const { setAdminInfo, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
