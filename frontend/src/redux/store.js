import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice"; // ✅ add this line

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer, // ✅ register reducer
  },
});
