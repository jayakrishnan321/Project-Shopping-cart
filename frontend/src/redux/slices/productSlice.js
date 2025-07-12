import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const addProduct = createAsyncThunk("product/add", async (productData) => {
  const res = await API.post("/products", productData);
  return res.data.product;
});


export const getProducts = createAsyncThunk("product/getAll", async () => {
  const res = await API.get("/products");
  return res.data;
});

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, thunkAPI) => {
    try {
      const res = await API.delete(`/products/delete-product/${id}`);
      return res.data; // Optionally return deleted ID or message
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
