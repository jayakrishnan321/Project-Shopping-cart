import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// Add a new product
export const addProduct = createAsyncThunk("product/add", async (productData) => {
  const res = await API.post("/products", productData);
  return res.data.product;
});

// Get all products
export const getProducts = createAsyncThunk("product/getAll", async () => {
  const res = await API.get("/products");
  return res.data;
});

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
